<template>
  <div id="global-header" class="header">
    <a-row :wrap="false">
      <a-col flex="250px"
        ><div class="title-bar">
          <img class="logo" src="../assets/logo.svg" alt="logo" />
          <div class="title">数据库系统项目中心</div>
        </div>
      </a-col>
      <a-col flex="auto"
        ><a-menu
          v-model:selectedKeys="current"
          mode="horizontal"
          :items="items"
          class="menu"
      /></a-col>
      <a-col flex="80px">
        <div class="button">
          <a-button type="primary" href="/user/login">登录</a-button>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<script lang="ts" setup>
import { h, ref } from "vue";
import {
  HomeOutlined,
  AppstoreOutlined,
  SettingOutlined,
  CrownOutlined,
} from "@ant-design/icons-vue";
import { MenuProps } from "ant-design-vue";
const current = ref<string[]>(["mail"]);
const items = ref<MenuProps["items"]>([
  {
    key: "/",
    icon: () => h(HomeOutlined),
    label: "主页",
    title: "主页",
  },
  {
    key: "user/login",
    icon: () => h(AppstoreOutlined),
    label: "用户登录",
    title: "用户登录",
  },
  {
    key: "user/register",
    icon: () => h(SettingOutlined),
    label: "用户注册",
    title: "用户注册",
  },
  {
    key: "admin/userManage",
    icon: () => h(CrownOutlined),
    label: "用户管理",
    title: "用户管理",
  },
]);
</script>
<style scoped>
.header {
  height: 48px;
  background: #fff;
}
.title-bar {
  display: flex;
  align-items: center;
  background: white;
  height: 48px;
}
.title {
  font-size: 17px;
  color: black;
  margin-left: 16px;
}
.logo {
  height: 48px;
}
.button {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
