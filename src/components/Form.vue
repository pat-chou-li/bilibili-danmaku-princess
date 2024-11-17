<template>
  <el-form
    :label-position="labelPosition"
    label-width="auto"
    :model="formLabelAlign"
    style="max-width: 600px"
  >
    <el-form-item label="cookie:" :label-position="itemLabelPosition">
      <el-input
        v-model="formLabelAlign.cookie"
        disabled
        placeholder="请扫码登录"
      />
    </el-form-item>
    <el-form-item label="房间号:" :label-position="itemLabelPosition">
      <el-input v-model="formLabelAlign.room" />
    </el-form-item>
    <el-form-item :label-position="itemLabelPosition">
      <el-button type="primary" @click="onSubmit">创建弹幕姬</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
const props = defineProps(["cookie"]);
const router = useRouter();

const labelPosition = ref("left");
const itemLabelPosition = ref("");
const formLabelAlign = reactive({
  cookie: "",
  room: "",
});

// 扫码后更新cookie
watch(
  () => props.cookie,
  (newValue) => {
    formLabelAlign.cookie = newValue;
    console.log(formLabelAlign);
  },
  { immediate: true }
);

const onSubmit = () => {
  // TODO: submit form
  router.push({
    path: "/live",
    query: { room: formLabelAlign.room, cookie: formLabelAlign.cookie },
  });
};
</script>
