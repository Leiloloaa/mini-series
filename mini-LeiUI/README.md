# 实现 mini-LeiUI

**效果**

我们只需要全局引用之后，在组件中便可以不声明就直接使用。

```vue
<template>
  <L-button />
  <L-input />
</template>
```

**实现**

在 mini-ui-frame 文件中，查看 modules 目录，这个相当于我们平常使用的 node_modules，目录结构如下

- L-ui
  - components
    - L-button.vue
    - L-input.vue
  - index.js

index.js 文件的作用就是告诉 vue 需要注册哪些组件。

如何告诉？又如何执行呢？

我们在 main.js 中使用 Vue.use(LeiUI)，运行的时候 Vue 便会去 index.js 文件中找到 install 方法并且执行，所以我们只需要在 install 方法中注册组件，全局就能使用了。部分代码如下：

```js
// main.js
import LeiUI from './../modules/L-ui/index';

createApp(App).use(LeiUI).mount('#app');

// LeiUI index.js
import LButton from './components/L-button.vue';
import LInput from './components/L-input.vue';

const components = [
    LButton,
    LInput
]

const LeiUI = {
    // 当使用了 use 的时候 它就会去找 install 方法 然后执行
    install(Vue) {
        // 注册组件
        components.forEach((component) => {
            // console.log(component);
            Vue.component(component.name, component)
        });
    }
}

export default LeiUI
```