<template>
  <qrcode-vue v-if="value" :value="value" :size="size" level="H" />
</template>

<script setup>
import QrcodeVue from "qrcode.vue";
import { ref, onMounted, onUnmounted } from "vue";
import axios from "axios";
const emit = defineEmits(["set-cookie"]);

let value = ref("");
const size = 200;
let cookie = ref("");

async function getBuvid3() {
  const r = await axios.get("/api/x/frontend/finger/spi");
  const { code, message, data } = r.data;
  if (code !== 0) throw new Error(message);
  return data.b_3;
}

onMounted(async () => {
  // 获取二维码
  let res0 = await axios.get("/passport/x/passport-login/web/qrcode/generate");
  let { qrcode_key, url } = res0.data.data;
  console.log(qrcode_key, url);
  value.value = url;
  // 轮询二维码状态
  let timer = setInterval(async () => {
    let res1 = await axios.get(
      `/passport/x/passport-login/web/qrcode/poll?qrcode_key=${qrcode_key}&source=main-fe-header`,
      { withCredentials: true }
    );
    if (res1.data.data.code === 0) {
      clearInterval(timer);
      console.log("登录成功");
      cookie = new Cookie()
        .set("buvid3", await getBuvid3())
        .add(JSON.parse(res1.headers["hello"]))
        .del("i-wanna-go-back")
        .toString();
      emit("set-cookie", cookie);
    }
    // 86038 : 二维码已失效
    if (res1.data.data.code === 86038) {
      clearInterval(timer);
      console.log("二维码已失效");
      // 刷新页面来刷新二维码
      window.location.reload();
    }
    // 86090 : 扫描成功，未确认
    if (res1.data.data.code === 86090) {
      console.log("扫描成功，未确认");
    }
    // 86101 : 未扫码
    if (res1.data.data.code === 86101) {
      console.log("未扫码");
    }
  }, 2000);
  onUnmounted(() => {
    clearInterval(timer);
  });
});

class Cookie {
  cookie = new Map();

  constructor(cookies) {
    if (cookies) this.add(cookies);
  }

  set(name, value) {
    this.cookie.set(name, value);
    return this;
  }

  add(cookies) {
    if (typeof cookies === "string") cookies = cookies.split(",");
    cookies.forEach((str) => {
      const [nv] = str.split(";");
      const [name, ...values] = nv.split("=");
      this.cookie.set(name, values.join("="));
    });
    return this;
  }

  del(name) {
    this.cookie.delete(name);
    return this;
  }

  toString() {
    return Array.from(this.cookie.entries())
      .map(([name, value]) => `${name}=${value}`)
      .join("; ");
  }
}
</script>
