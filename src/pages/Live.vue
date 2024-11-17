<script setup>
// 本组件获取直播间元数据（主播id，房间token）以及准备ws的设置
// 准备完成后显示弹幕姬
import axios from "axios";
import { reactive, ref, shallowRef } from "vue";
import { useRoute } from "vue-router";
import LiveWs from "../components/LiveWs.vue";
const route = useRoute();
const liveWsOptions = shallowRef();
const ready = ref(false);
const metaOptions = reactive({
  room: route.query.room,
  anchor: null, // 主播id
  cookie: route.query.cookie,
});

let cookieMap = metaOptions.cookie.split("; ").reduce((acc, cur) => {
  const [key, value] = cur.split("=");
  acc[key.trim()] = value;
  return acc;
}, {});

for (let item in cookieMap) {
  document.cookie = `${item}=${cookieMap[item]};`;
}

(async () => {
  // 获取直播间初始化数据：主播id和房间id
  const res = await axios.get(
    `/ok/room/v1/Room/room_init?id=${metaOptions.room}`,
    {
      withCredentials: true,
    }
  );
  const {
    code: code1,
    msg: msg1,
    data: { room_id, uid },
  } = res.data;
  if (code1 != 0) {
    console.error(msg1);
    return;
  }
  metaOptions.anchor = uid;
  metaOptions.room = parseInt(room_id);

  // 获取直播间弹幕服务器地址，用于ws连接
  const buvid = /\bbuvid3=([^;]+)\b/.exec(metaOptions.cookie)?.[1];
  const auth_uid = /\bDedeUserID=([^;]+)\b/.exec(metaOptions.cookie)?.[1];
  console.log("buvid", buvid, "auth_uid", auth_uid);
  const res2 = await axios.get(
    `/ok/xlive/web-room/v1/index/getDanmuInfo?id=${metaOptions.room}&type=0`,
    { withCredentials: true }
  );
  const {
    code: code2,
    msg: msg2,
    data: { token, host_list },
  } = res2.data;
  if (code2 != 0) {
    console.error(msg2);
    return;
  }
  liveWsOptions.value = {
    address: `wss://${host_list[0].host}/sub`,
    authBody: {
      uid: parseInt(auth_uid),
      roomid: metaOptions.room,
      protover: 3,
      buvid,
      platform: "web",
      type: 2,
      key: token,
    },
  };
  console.log(liveWsOptions.value);
  ready.value = true;
})();
</script>
<template>
  <LiveWs
    v-if="ready"
    :liveWsOptions="liveWsOptions"
    :room="metaOptions.room"
  />
</template>
<style lang="scss" scoped></style>
