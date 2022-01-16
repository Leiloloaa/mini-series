# mini-webpack

> 实现 mini-webpack 最简实践

**明确结论**

把多个小的模块打包成一个模块

**任务拆分**

1、根据 文件 关系 生成 图 graph
  - 内容
  - 依赖关系
2、然后再根据 图 生成 js
  - ejs 模板
  - 考虑重名与文件相对路径问题

## 新建项目

为了更好是实现，我们可以自己预设一下 bundle.js 里面的内容，然后再根据内容去实现

- npm init -y
- "type": "module" 从能支持 esm

## 创建图

```js
function createAsset(filePath) {
  // 1、获取文件的内容
  const source = fs.readFileSync(filePath, { encoding: 'utf-8' });
  // console.log(source);

  // 2、获取依赖关系
  // 可以通过 正则表达式的方式 因为有 import 可以区分
  // 我们还可以通过 AST 的方式 AST => 抽象语法树
  const ast = parser.parse(source, {
    sourceType: 'module'
  });
  // console.log(ast);

  // 如何或去 foo.js 呢？ 我们需要遍历整棵树 babel 也有相应的工具
  const deps = [];
  traverse.default(ast, {
    // 通过回调 拿到对应的节点 value
    ImportDeclaration({ node }) {
      deps.push(node.source.value);
      console.log(node.source.value);
    }
  });

  // transformFromAst 可以把 esm 的 import 改成 cjs 的 require 语法
  // 直接写 env 会报错 需要装一个库 babel-preset-env
  const { code } = transformFromAst(ast, null, {
    presets: ['env']
  });

  return { filePath, code, deps };
}

const asset = createAsset('./example/main.js');
console.log(asset); // 就得到了依赖关系
```

得到依赖关系后，我们通过队列依次去遍历

```js
// 创建图
function createGraph() {
  // 入口
  const mainAsset = createAsset('./example/main.js');

  // 使用一个 队列 依次去遍历
  const queue = [mainAsset];

  for (const asset of queue) {
    asset.deps.forEach(relativePath => {
      // 相对 路径 所以 引入 path
      const child = createAsset(path.resolve('./example', relativePath));
      queue.push(child);
    });
  }
  return queue;
}

const graph = createGraph();
```

## 生成 js

通过 ejs 模板生成

```js
function build(graph) {
  const template = fs.readFileSync('./bundle.ejs', { encoding: 'utf-8' });
  // 创建模板数据
  const data = graph.map(asset => {
    // 这个 id 和 mapping 是明确这个文件引入的是哪个， ./foo.js:2
    const { id, code, mapping } = asset;
    return { id, code, mapping };
  });
  // console.log(data);
  // 这个 code 就 生成了 "./foo":fooFun 这样对应的关系 但是问题又来了
  // 全局可能会存在多个 ./foo 文件 那又如何区分呢？
  // 调整一下 每个模块前 加上一个唯一 id 然后最后加上一个 mapping {'./foo',id}
  // 指向 id
  const code = ejs.render(template, { data });

  fs.writeFileSync('./dist/bundle.js', code);
}

build(graph);
```

全部代码请看 根目录下的 index.js