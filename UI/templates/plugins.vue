<template>
  <div id="plugins">
    <ul>
      <h1>PLUGINS COMPONENT!</h1>
    </ul>
  </div>
</template>

<script>
export default {
  created() {
    for(let p in bot.plugins) {
      this.addPlugin(bot.plugins[p]);
    }

    console.log(this.plugins);
  },
  data() {
    return {
      plugins: {}
    };
  },
  methods: {
    addPlugin(plugin) {
      this.plugins[plugin.name] = plugin.config;
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

