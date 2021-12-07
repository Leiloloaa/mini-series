import LButton from './components/basic/L-button.vue';
import LInput from './components/form/L-input.vue';
import LCarousel from './components/data/Carousel/L-carousel.vue';
import LCarouselItem from './components/data/Carousel/L-carousel-item.vue';
const components = [LButton, LInput, LCarousel, LCarouselItem];

const LeiUI = {
    // 当使用了 use 的时候 它就会去找 install 方法 然后执行
    install(Vue) {
        // 注册组件
        components.forEach(component => {
            Vue.component(component.name, component);
        });
    }
};

export default LeiUI;