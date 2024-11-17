<script setup>
import { onMounted, ref, unref, onBeforeUnmount, useTemplateRef } from "vue";
import { v4 as uuid } from "uuid";

import { nextTick } from "vue";
import DanmakuItem from "./DanmakuItem.vue";
const props = defineProps({
  isGiftList: Boolean,
});

// 弹幕列表
const danmakuList = ref([]);
const danmakuListRef = ref(null);
// const danmakuListRef = useTemplateRef("danmakuListRef");
const giftListref = ref(null);

// 移除不可见弹幕
onMounted(() => {
  const topOfList = danmakuListRef.value.getBoundingClientRect().top;
  const removeInvisibleDanmaku = () => {
    const i = danmakuList.value.findIndex((item) => {
      const { top, height } = item.el?.$el?.getBoundingClientRect() ?? {};
      if (top < topOfList) item.hidden = true;
      return top + height > topOfList;
    });
    if (i > 0) danmakuList.value.splice(0, i);
  };
  const danmakuInterval = setInterval(removeInvisibleDanmaku, 100);
  onBeforeUnmount(() => clearInterval(danmakuInterval));
});

// 滚动到最底部，显示最新弹幕
const scrollList = () => {
  const el = unref(props.isGiftList ? giftListref : danmakuListRef);
  let tmp = props.isGiftList ? giftListref : danmakuListRef;
  if (el) el.scrollTop = el.scrollHeight;
};

// 弹幕队列，用来管理请求回来但是未渲染的弹幕，避免频繁渲染
const danmakuQueue = [];
const handleDanmakuQueue = () => {
  let sleep = 200;
  const { length } = danmakuQueue;
  if (length > 0) {
    sleep = Math.min(sleep, 1000 / length);
    danmakuList.value.push(danmakuQueue.shift());
    nextTick(scrollList);
  }
  setTimeout(handleDanmakuQueue, sleep);
};
handleDanmakuQueue();

const addDanmaku = (danmaku) => {
  danmakuQueue.push({
    props: danmaku,
    key: uuid(),
    el: null,
    hidden: false,
  });
};

defineExpose({
  addDanmaku,
});
</script>
<template>
  <div v-if="props.isGiftList" class="danmaku-list-pinned" ref="danmakuListRef">
    <div class="danmaku-list absolute" ref="giftListref">
      <danmaku-item
        v-for="item in danmakuList"
        :key="item.key"
        v-bind="item.props"
        :hidden="item.hidden"
        :ref="(el) => (item.el = el)"
      />
    </div>
  </div>
  <div v-else class="danmaku-list" ref="danmakuListRef">
    <div class="danmaku-list-placeholder"></div>
    <danmaku-item
      v-for="item in danmakuList"
      :key="item.key"
      v-bind="item.props"
      :hidden="item.hidden"
      :ref="(el) => (item.el = el)"
    />
  </div>
</template>
<style lang="scss" scoped>
.danmaku-list {
  flex-grow: 1;
  width: 100%;
  overflow: hidden;
  scroll-behavior: smooth;
  &.hidden {
    visibility: hidden;
  }
  &.absolute {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
  &-pinned {
    height: 40vh;
    position: relative;
    flex-grow: 0;
    flex-shrink: 0;
    width: 100%;
  }
  &-placeholder {
    height: 100%;
  }
}
</style>
