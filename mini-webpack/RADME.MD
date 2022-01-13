# mini-webpack

主要做的事情就是把多个小的模块打包成一个模块

任务拆分的思想

两个步奏

1、根据 文件 关系 生成 图 graph
  - 内容
  - 依赖关系
2、然后再根据 图 生成 js


npm init -y
"type": "module" 从能支持 esm