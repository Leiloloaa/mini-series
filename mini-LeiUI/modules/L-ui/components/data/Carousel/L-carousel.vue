<template>
  <div class="carousel">
    <div class="inner">
      <slot></slot>
    </div>
<<<<<<< HEAD

=======
>>>>>>> c599be4fbba6b7f2eab69d3d45f466ea4f4bbcdb
  </div>
</template>

<script>
<<<<<<< HEAD
import {
  getCurrentInstance,
  reactive,
  toRaw,
  onMounted,
  onBeforeUnmount,
} from "vue";
=======
import { getCurrentInstance, reactive, toRaw, onMounted, onBeforeUnmount } from "vue";
>>>>>>> c599be4fbba6b7f2eab69d3d45f466ea4f4bbcdb
export default {
  name: "LCarousel",
  props: {
    autoplay: {
      type: Boolean,
      default: true,
    },
    duration: {
      type: Number,
      default: 3000,
    },
    initial: {
      type: Number,
      default: 0,
    },
    hasDot: {
      type: Boolean,
      default: true,
    },
    hasDirector: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const instance = getCurrentInstance();
<<<<<<< HEAD
    // console.log(instance);
=======
>>>>>>> c599be4fbba6b7f2eab69d3d45f466ea4f4bbcdb
    const state = reactive({
      currentIndex: props.initial,
      itemLen: 0,
    });

    let t = null;
    const autoPlay = () => {
      if (props.autoplay) {
        t = setInterval(() => {
<<<<<<< HEAD
          // 临界点和方向
=======
>>>>>>> c599be4fbba6b7f2eab69d3d45f466ea4f4bbcdb
          setIndex("next");
        }, props.duration);
      }
    };
    const setIndex = (dir) => {
<<<<<<< HEAD
      console.log(dir);
=======
>>>>>>> c599be4fbba6b7f2eab69d3d45f466ea4f4bbcdb
      switch (dir) {
        case "next":
          state.currentIndex += 1;
          if (state.currentIndex === state.itemLen) {
            state.currentIndex = 0;
          }
<<<<<<< HEAD
          console.log(state.currentIndex);
=======
>>>>>>> c599be4fbba6b7f2eab69d3d45f466ea4f4bbcdb
          break;
        case "prev":
          state.currentIndex -= 1;
          if (state.currentIndex === -1) {
            state.currentIndex = state.itemLen - 1;
          }
          break;
        default:
          break;
      }
    };
    onMounted(() => {
      state.itemLen = instance.slots.default()[0].children.length;
      autoPlay();
    });
    onBeforeUnmount(() => {
      clearInterval(t);
      // 清楚完定时器后 t 还是定时器的 id
      t = null;
    });
    return {
      ...toRaw(state),
    };
  },
};
</script>

<style scoped>
.carousel {
  width: 100%;
  height: 100%;
}

.inner {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
