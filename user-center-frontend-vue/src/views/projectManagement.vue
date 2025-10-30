<template>
  <div class="projectManagement">
    <div class="iframe-wrapper">
      <iframe src="https://www.pku.edu.cn/" width="1200" height="900"></iframe>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
<style scoped>
.iframe-wrapper {
  width: 100%;
  height: 570px;
  overflow: hidden;
  position: relative;
}
.iframe-wrapper iframe {
  transform: scale(0.9); /* 缩小到 80% */
  transform-origin: top left;
  width: 1200px;
  height: 800px;
  border: none;
}
</style>
