<template>
  <div id="app">
    <ParameterStoreList />
  </div>
</template>

<script>
import ParameterStoreList from './components/ParameterStoreList.vue';

export default {
  name: 'app',
  components: {
      ParameterStoreList
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
}
</style>
