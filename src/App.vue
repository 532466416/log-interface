<template>
  <div id="app">
    <StudioLog />
  </div>
</template>

<script>
import StudioLog from "./components/StudioLog/index.vue";

export default {
  name: "App",
  components: {
    StudioLog,
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
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
