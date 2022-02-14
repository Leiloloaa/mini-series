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

## 实现 Loader

loader 让 webpack 能够去处理那些非 JavaScript 文件（webpack 自身只理解 JavaScript）。

在 webpack 的配置中 loader 有两个目标：
- test 属性，用于标识出应该被对应的 loader 进行转换的某个或某些文件。
- use 属性，表示进行转换时，应该使用哪个 loader。

**webpack.config.js**

```js
const path = require('path');

const config = {
  output: {
    filename: 'my-first-webpack.bundle.js'
  },
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' }
    ]
  }
};

module.exports = config;
```

以上配置中，对一个单独的 module 对象定义了 rules 属性，里面包含两个必须属性：test 和 use。这告诉 webpack 编译器(compiler) 如下信息：

> “嘿，webpack 编译器，当你碰到「在 require()/import 语句中被解析为 '.txt' 的路径」时，在你对它打包之前，先使用 raw-loader 转换一下。”

> 重要的是要记得，在 webpack 配置中定义 loader 时，要定义在 module.rules 中，而不是 rules。然而，在定义错误时 webpack 会给出严重的警告。为了使你受益于此，如果没有按照正确方式去做，webpack 会“给出严重的警告”

### loader 特性

- loader 支持链式传递。能够对资源使用流水线(pipeline)。一组链式的 loader 将按照相反的顺序执行。loader 链中的第一个 loader 返回值给下一个 loader。在最后一个 loader，返回 webpack 所预期的 JavaScript。
- loader 可以是同步的，也可以是异步的。
- loader 运行在 Node.js 中，并且能够执行任何可能的操作。
- loader 接收查询参数。用于对 loader 传递配置。
- loader 也能够使用 options 对象进行配置。
- 除了使用 package.json 常见的 main 属性，还可以将普通的 npm 模块导出为 loader，做法是在 package.json 里定义一个 loader 字段。
- 插件(plugin)可以为 loader 带来更多特性。
- loader 能够产生额外的任意文件。

### 实现解析 jsonLoader

```js
const webpackConfig = {
    module: {
        rules: [{
            test: /\.json$/,
            use: jsonLoader
        }]
    }
}

function createAsset(filePath) {
    // 1、获取文件的内容
    let source = fs.readFileSync(filePath, { encoding: 'utf-8' });
    // console.log(source);

    // === 新增 ===
    // 获取完文件之后，要根据文件的后缀名用相应的 loader 去解析
    // initLoader
    const loaders = webpackConfig.module.rules
    loaders.forEach(({ test, use }) => {
        if (test.test(filePath)) {
            source = use(source)
        }
    });

    // ...
}
export function jsonLoader(source) {
    return `export default ${JSON.stringify(source)}`
}
```

### 用法准则(Guidelines)

编写 loader 时应该遵循以下准则。它们按重要程度排序，有些仅适用于某些场景，请阅读下面详细的章节以获得更多信息。

- 简单易用。
- 使用链式传递。
  - 当链式调用多个 loader 的时候，请记住它们会以相反的顺序执行。取决于数组写法格式，从右向左或者从下向上执行。
  - 最后的 loader 最早调用，将会传入原始资源内容。
  - 第一个 loader 最后调用，期望值是传出 JavaScript 和 source map（可选）。
  - 中间的 loader 执行时，会传入前一个 loader 传出的结果。
- 模块化的输出。
- 确保无状态。
- 使用 loader utilities。
- 记录 loader 的依赖。
- 解析模块依赖关系。
- 提取通用代码。
- 避免绝对路径。
- 使用 peer dependencies。