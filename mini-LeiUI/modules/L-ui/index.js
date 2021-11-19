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