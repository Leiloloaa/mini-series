<template>
  <div class="item" v-if="selfIndex === currentIndex">
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
      currentIndex: instance.parent.ctx.currentIndex,
      selfIndex: instance.vnode.key,
    });

    console.log("currentIndex", state.currentIndex);
    console.log("selfIndex", state.selfIndex);
    watch(
      () => {
        return instance.parent.ctx.currentIndex;
      },
      (value) => {
        console.log("value", value);
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
</style>
