<script setup>
import QrCode from "../components/QrCode.vue";
import Form from "../components/Form.vue";
import { reactive, ref } from "vue";
const cookie = ref("");

const updateCookie = (value) => {
  cookie.value = value;
};
</script>

<template>
  <div id="root">
    <div class="mainContainer">
      <div class="qrcode">
        <QrCode @set-cookie="updateCookie"></QrCode>
      </div>
      <div class="form">
        <Form :cookie="cookie"></Form>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
#root {
  display: flex;
  min-height: 100vh;
  justify-content: center;
  align-items: center;
  .mainContainer {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 520px;
    height: 100%;
  }
  .qrcode {
    flex: 1;
  }
  .form {
    flex: 1;
  }
}
</style>
