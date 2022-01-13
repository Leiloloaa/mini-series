<template>
<<<<<<< HEAD
  <div class="container">
    <L-carousel
      :autoplay="true"
      :duration="3000"
      :initial="0"
      :hasDot="true"
      :hasDirector="true"
    >
      <L-carousel-item
        v-for="(item,index) of itemData"
        :key="index"
      >
        <img
          :src="`./src/assets/image/${item.image_name}`"
          alt=""
        >
      </L-carousel-item>
    </L-carousel>
  </div>
</template>

<script lang="ts" setup>
import itemData from "./assets/data";
=======
  <div id="app">
    <div class="container">
      <LButton />
      <LCarousel
        :autoplay="true"
        :duration="3000"
        :initial="4"
        :hasDot="true"
        :hasDirector="true"
      >
        <LCarouselItem v-for="(item, index) of itemData" :key="index">
          <div>
            {{ item.image_name }}
            <img :src="'./src/assets/image/' + index + '.jpg'" alt="" />
          </div>
        </LCarouselItem>
      </LCarousel>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<script setup>
let itemData = [
  { image_name: "0.jpg" },
  { image_name: "1.jpg" },
  { image_name: "2.jpg" },
  { image_name: "3.jpg" },
  { image_name: "4.jpg" },
];
>>>>>>> c599be4fbba6b7f2eab69d3d45f466ea4f4bbcdb
</script>

<style scoped>
.container {
  width: 520px;
  height: 280px;
<<<<<<< HEAD
  margin: 150px 0;
}
</style>
=======
  margin: 150px auto;
}
.container > img {
  width: 100%;
}
</style>
>>>>>>> c599be4fbba6b7f2eab69d3d45f466ea4f4bbcdb
