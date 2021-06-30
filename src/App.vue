<template>
  <div id="app">
    <LogHandle />
  </div>
</template>

<script>
import LogHandle from "./components/LogHandle.vue";

export default {
  name: "App",
  components: {
    LogHandle,
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  ::-webkit-scrollbar {
    width: 8px;
    height: 10px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #a1a3a9;
    border-radius: 3px;
  }
}
</style>
