// iife 立即执行函数
(function(modules) {
  function require(id) {
    // 映射函数
    // const map = {
    //     './main.js': mainjs,
    //     './foo.js': foojs
    // };

    // modules 是一个数组 所以 解构一下
    const [fn, mapping] = modules[id];

    const module = {
      exports: {}
    };

    // 因为用户是传入的 路径 而修改后是 id 所以需要转换一下
    function localRequire(filePath) {
      const id = mapping[filePath];
      return require(id);
    }

    fn(localRequire, module, module.exports);

    return module.exports;
  }

  require(1);
})({
  1: [
    function(require, module, exports) {
      // 根据 esm 规则 import 要放置在最顶层
      // 所以 我们使用 cjs commonjs require 的方式
      // import foo from './foo.js';
      // esm => cjs
      const { foo } = require('./foo.js');
      foo();

      console.log('main.js');
    },
    { './foo.js': 2 }
  ],
  2: [
    function(require, module, exports) {
      function foo() {
        console.log('foo');
      }

      module.exports = {
        foo
      };
    },
    {}
  ]
});

// 如何生成这个文件呢？
// 字符串拼接
// 模板生成器 ejs
