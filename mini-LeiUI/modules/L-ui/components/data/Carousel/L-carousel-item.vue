<template>
<<<<<<< HEAD
  <div
    class="item"
    v-if="selfIndex === currentIndex"
  >
=======
  <div class="item" v-if="selfIndex === currentIndex">
>>>>>>> c599be4fbba6b7f2eab69d3d45f466ea4f4bbcdb
    <slot></slot>
  </div>
</template>

<script>
import { getCurrentInstance, reactive, toRefs, watch } from "vue";
export default {
  name: "LCarouselItem",
  setup() {
    const instance = getCurrentInstance();
    const state = reactive({
<<<<<<< HEAD
      selfIndex: instance.vnode.key,
      currentIndex: instance.parent.ctx.currentIndex,
    });
=======
      currentIndex: instance.parent.ctx.currentIndex,
      selfIndex: instance.vnode.key,
    });

    console.log("currentIndex", state.currentIndex);
    console.log("selfIndex", state.selfIndex);
>>>>>>> c599be4fbba6b7f2eab69d3d45f466ea4f4bbcdb
    watch(
      () => {
        return instance.parent.ctx.currentIndex;
      },
      (value) => {
<<<<<<< HEAD
=======
        console.log("value", value);
>>>>>>> c599be4fbba6b7f2eab69d3d45f466ea4f4bbcdb
        state.currentIndex = value;
      }
    );
    return {
      ...toRefs(state),
    };
  },
};
</script>

<style scoped>
.item {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

img {
  width: 100%;
}
<<<<<<< HEAD
</style>
=======
</style>
>>>>>>> c599be4fbba6b7f2eab69d3d45f466ea4f4bbcdb
