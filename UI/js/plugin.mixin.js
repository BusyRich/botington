module.exports = {
  created() {
    this.plugin = bot.plugins[this.name];
    this.config = this.plugin.config;
  },
  data() {
    return {
      name: '',
      plugin: null,
      config: null
    };
  }
};