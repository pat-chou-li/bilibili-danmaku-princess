<script setup>
import QrCode from "./components/QrCode.vue";
</script>

<template>
  <div id="root">
    <div class="qrcode">
      <QrCode></QrCode>
    </div>
    <div class="option"></div>
  </div>
</template>

<style scoped lang="scss">
#root {
  display: flex;
  width: 100%;
  height: 100%;
  .qrcode {
    flex: 1;
  }
  .option {
    flex: 1;
    background-color: pink;
  }
}
</style>
