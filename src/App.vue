<template>
  <div id="app">
    <CalculatorPanel />
  </div>
</template>

<script setup lang="ts">
// 导入计算器面板组件
import CalculatorPanel from './components/CalculatorPanel.vue';
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  background-color: #000000;
  min-height: 100vh;
  padding-top: 50px;
}
</style>
