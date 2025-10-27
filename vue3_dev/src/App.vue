<template>
  <div>
    name:<input v-model="username" />{{ username }}<br />
    salary:<input v-model="salary" />{{ salary }}<br />
    <button v-on:click="addSalary">add salary</button>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    console.log("============");
    let username = ref("Roy");
    let salary = ref(1000);
    function addSalary() {
      salary.value += 1000;
      console.log(salary);
    }
    return {
      username,
      salary,
      addSalary,
    };
  },
};
</script>

<style scoped>
.userInfo {
  background-color: aqua;
  widows: 80%;
}
.userInfo span {
  background-color: yellow;
  margin-left: 10px;
  border-radius: 5px;
}
</style>
