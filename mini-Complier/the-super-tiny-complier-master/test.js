const {
    tokenizer,
    parser,
    transformer,
    codeGenerator,
    compiler,
} = require('./the-super-tiny-compiler');
const assert = require('assert');

const input = '(add 2 (subtract 4 2))';
const output = 'add(2, subtract(4, 2));';

// 分解 input
// 左括号
// 右括号
// 空格
// 数字
// 字母
const tokens = [
    { type: 'paren', value: '(' },
    { type: 'name', value: 'add' },
    { type: 'number', value: '2' },
    { type: 'paren', value: '(' },
    { type: 'name', value: 'subtract' },
    { type: 'number', value: '4' },
    { type: 'number', value: '2' },
    { type: 'paren', value: ')' },
    { type: 'paren', value: ')' }
];

// 把 tokens 转换成 AST 语法树（二叉树）
// 二叉树有唯一的根节点 每个节点都可以有两个子节点（左右孩子）
const ast = {
    type: 'Program',
    body: [{
        type: 'CallExpression',
        name: 'add',
        params: [{
            type: 'NumberLiteral',
            value: '2'
        }, {
            type: 'CallExpression',
            name: 'subtract',
            params: [{
                type: 'NumberLiteral',
                value: '4'
            }, {
                type: 'NumberLiteral',
                value: '2'
            }]
        }]
    }]
};

const newAst = {
    type: 'Program',
    body: [{
        type: 'ExpressionStatement',
        expression: {
            type: 'CallExpression',
            callee: {
                type: 'Identifier',
                name: 'add'
            },
            arguments: [{
                type: 'NumberLiteral',
                value: '2'
            }, {
                type: 'CallExpression',
                callee: {
                    type: 'Identifier',
                    name: 'subtract'
                },
                arguments: [{
                    type: 'NumberLiteral',
                    value: '4'
                }, {
                    type: 'NumberLiteral',
                    value: '2'
                }]
            }]
        }
    }]
};

assert.deepStrictEqual(tokenizer(input), tokens, 'Tokenizer should turn `input` string into `tokens` array');
assert.deepStrictEqual(parser(tokens), ast, 'Parser should turn `tokens` array into `ast`');
assert.deepStrictEqual(transformer(ast), newAst, 'Transformer should turn `ast` into a `newAst`');
assert.deepStrictEqual(codeGenerator(newAst), output, 'Code Generator should turn `newAst` into `output` string');
assert.deepStrictEqual(compiler(input), output, 'Compiler should turn `input` into `output`');

console.log('All Passed!');