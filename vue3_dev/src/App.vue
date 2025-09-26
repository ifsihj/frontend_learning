<template>
  <div>
    name:<input v-model="username" />{{ username }}<br />
    salary:<input v-model="salary" />{{ salary }}<br />
    <button v-on:click="addSalary">submit</button>
    <hr />
    <div class="userInfo">
      <h2>Personal Information</h2>
      <p>age:<input type="number" v-model="userInfo.age"/></p>
      <p>sex:<input type="radio" value="1" v-model="userInfo.sex">Male</input><input type="radio" value="2" v-model="userInfo.sex">Female</input></p>
      <p>department:<select v-model="userInfo.department">
        <option value="dev">Development</option>
        <option value="test">Test</option>
        <option value="Maintain">maintain</option>
      </select></p>
      <p>skills:<span v-for="skill in userInfo.skills" :key="skil">{{ skill }}</span></p>
      <p>new_skills:<input v-model="newSkill"/><button v-on:click="learnNewSkill">Learn new skill</button></p>
      <p>Summary:{{ userInfo }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "Romeo",
      salary: 15000,
      userInfo: {
        age: 18,
        sex: 1,
        department: "",
        skills:['java','python','vue'],
        newskill:''
    },
  };
  },
  methods: {
    addSalary() {
      this.salary += 1000;
    },
    learnNewSkill(){
      if(this.newSkill.trim()!==''){
        this.userInfo.skills.push(this.newSkill);
        this.newSkill='';
      }else{
        alert('Please enter a valid skill');
      }
    }
  },
};
</script>

<style scoped>
  .userInfo {
    background-color: aqua;
    widows:80%;
  }
  .userInfo span{
    background-color: yellow;
    margin-left:10px;
    border-radius:5px; 
  }
</style>
