<template>
  <div class="basic-layout">
    <a-layout>
      <GlobalHeader />
      <a-layout-content style="padding: 0 50px">
        <a-breadcrumb style="margin: 16px 0">
          <a-breadcrumb-item>Home</a-breadcrumb-item>
          <a-breadcrumb-item>List</a-breadcrumb-item>
          <a-breadcrumb-item>App</a-breadcrumb-item>
        </a-breadcrumb>
        <a-layout style="padding: 24px 0; background: #fff">
          <a-layout-sider width="200" style="background: #fff">
            <a-menu
              v-model:selectedKeys="selectedKeys2"
              v-model:openKeys="openKeys"
              mode="inline"
              style="height: 100%"
            >
              <a-sub-menu key="sub1">
                <template #title>
                  <span>
                    <user-outlined />
                    用户
                  </span>
                </template>
                <a-menu-item key="1">option1</a-menu-item>
                <a-menu-item key="2">option2</a-menu-item>
                <a-menu-item key="3">option3</a-menu-item>
                <a-menu-item key="4">option4</a-menu-item>
              </a-sub-menu>
              <a-sub-menu key="sub2">
                <template #title>
                  <span>
                    <laptop-outlined />
                    项目展示
                  </span>
                </template>
                <a-menu-item key="5">option5</a-menu-item>
                <a-menu-item key="6">option6</a-menu-item>
                <a-menu-item key="7">option7</a-menu-item>
                <a-menu-item key="8">option8</a-menu-item>
              </a-sub-menu>
              <a-sub-menu key="sub3">
                <template #title>
                  <span>
                    <notification-outlined />
                    讨论
                  </span>
                </template>
                <a-menu-item key="9">option9</a-menu-item>
                <a-menu-item key="10">option10</a-menu-item>
                <a-menu-item key="11">option11</a-menu-item>
                <a-menu-item key="12">option12</a-menu-item>
              </a-sub-menu>
            </a-menu>
          </a-layout-sider>
          <a-layout-content :style="{ padding: '0 24px', minHeight: '280px' }">
            <router-view />
          </a-layout-content>
        </a-layout>
      </a-layout-content>
      <a-layout-footer style="text-align: center">
        <a href="http://ifsihj.github.io" target="_blank">code for fun!</a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
} from "@ant-design/icons-vue";
import GlobalHeader from "@/components/GlobalHeader.vue";
const selectedKeys1 = ref<string[]>(["2"]);
const selectedKeys2 = ref<string[]>(["1"]);
const openKeys = ref<string[]>(["sub1"]);
</script>

<style scoped>
#components-layout-demo-top-side .logo {
  float: left;
  width: 120px;
  height: 31px;
  margin: 16px 24px 16px 0;
  background: rgba(255, 255, 255, 0.3);
}

.ant-row-rtl #components-layout-demo-top-side .logo {
  float: right;
  margin: 16px 0 16px 24px;
}

.site-layout-background {
  background: #fff;
}
</style>
