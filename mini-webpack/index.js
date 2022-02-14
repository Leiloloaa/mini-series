import fs from 'fs';
import path from 'path';
import parser from '@babel/parser';
import traverse from '@babel/traverse';
import { transformFromAst } from 'babel-core';
import ejs from 'ejs';
import { jsonLoader } from './jsonLoader.js';

// console.log(traverse.default);
// 初始值 id  创建一个就 加一 就可以了
let id = 0;

const webpackConfig = {
    module: {
        rules: [{
            test: /\.json$/,
            use: [jsonLoader]
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
            if (Array.isArray(use)) {
                // 如果是一个数组 就链式调用 是从后往前执行 loader
                use.reverse().forEach((fn) => {
                    source = fn(source)
                })
            }
        }
    });

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

    return { filePath, code, deps, mapping: {}, id: id++ };
}

// const asset = createAsset('./example/main.js');
// console.log(asset);

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
            asset.mapping[relativePath] = child.id;
            queue.push(child);
        });
    }
    return queue;
}

const graph = createGraph();
// console.log(graph);

function build(graph) {
    const template = fs.readFileSync('./bundle.ejs', { encoding: 'utf-8' });
    // 创建模板数据
    const data = graph.map(asset => {
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