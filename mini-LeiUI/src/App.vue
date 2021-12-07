<template>
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
</script>

<style scoped>
.container {
  width: 520px;
  height: 280px;
  margin: 150px auto;
}
.container > img {
  width: 100%;
}
</style>
