<script setup>
import { onBeforeUnmount, onMounted, ref, useTemplateRef } from "vue";
import { KeepLiveWS } from "bilibili-live-ws";
import DanmakuList from "./DanmakuList.vue";
const giftPinList = ref(null);
const danmaKuList = ref(null);
// const danmaKuList = useTemplateRef("danmaKuList");
const props = defineProps(["liveWsOptions", "room"]);

// 添加debug用弹幕
const addInfoDanmaku = (message) => {
  danmaKuList.value.addDanmaku({
    type: "info",
    message,
  });
};
const addDanmaku = (danmaku) => {
  danmaKuList.value.addDanmaku(danmaku);
};

onMounted(() => {
  console.log("正在链接ws", props.room);
  const live = new KeepLiveWS(props.room, props.liveWsOptions);
  live.interval = 1000;
  onBeforeUnmount(() => {
    live.close();
  });
  live.on("open", () => {
    if (live.closed) return;
    console.log("服务器链接成功");
    addInfoDanmaku("ws链接成功");
  });
  live.on("live", () => {
    if (live.closed) return;
    console.log("已连接直播间", props.room);
    addInfoDanmaku(`已连接直播间 ${props.room}`);
  });
  live.on("close", () => {
    if (live.closed) return;
    console.log("连接已断开");
    addInfoDanmaku("连接已断开");
    const now = Date.now();
    failedTimestamps = failedTimestamps.filter((time) => now - time < 10000);
    failedTimestamps.push(now);
    if (failedTimestamps.length >= 3) {
      console.log("连接失败过于频繁，停止重连");
      addInfoDanmaku("连接失败过于频繁，停止重连");
      live.close();
    }
  });
  // 弹幕
  live.on(
    "DANMU_MSG",
    ({ info: [, message, [uid, uname, isOwner]], dm_v2 }) => {
      const danmaku = {
        type: "message",
        showFace: false,
        uid,
        uname,
        message,
        isAnchor: uid === props.anchor,
        isOwner: !!isOwner,
      };
      addDanmaku(danmaku);
    }
  );
  // 礼物
  live.on("SEND_GIFT", ({ data }) => {
    handleSendGift(data);
  });
  const handleSendGift = ({ uid, uname, giftName, num }) => {
    giftPinList.value.addDanmaku({
      type: "gift",
      uid,
      uname,
      giftName,
      num,
    });
  };
  // sc
  live.on(
    "SUPER_CHAT_MESSAGE",
    ({
      data: {
        uid,
        user_info: { uname, face },
        message,
      },
    }) => {
      handleSuperChat({ uid, uname, message, face });
    }
  );
  const handleSuperChat = ({ uid, uname, message, face }) => {
    giftList.value.addDanmaku({
      type: "sc",
      uid,
      uname,
      message,
    });
  };
  // 续费和购买舰长
  live.on("GUARD_BUY", ({ data: { uid, username, gift_name, num } }) => {
    handleGuard({ uid, uname: username, giftName: gift_name, num });
  });
  live.on(
    "USER_TOAST_MSG",
    ({ data: { uid, username, role_name, num, unit } }) => {
      handleGuard({ uid, uname: username, giftName: role_name, num, unit });
    }
  );
  const handleGuard = ({ uid, uname, giftName, num, unit }) => {
    giftList.value.addDanmaku({
      type: "gift",
      uid,
      uname,
      giftName: unit ? `${num}个${unit}${giftName}` : giftName,
      num: unit ? 0 : num,
    });
  };
});
</script>
<template>
  <div id="live">
    <danmaku-list ref="giftPinList" :is-gift-list="true" />
    <danmaku-list ref="danmaKuList" :is-gift-list="false" />
  </div>
</template>
<style lang="scss" scoped>
#live {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  background-color: transparent;
  display: flex;
  flex-direction: column;
}
</style>
