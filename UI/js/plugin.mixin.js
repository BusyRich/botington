module.exports = {
  created() {
    this.plugin = bot.plugins[this.name];

    if(this.plugin) {
      this.config = this.plugin.config;
      this.settings = this.plugin.settings;
    }
  },
  data() {
    return {
      name: '',
      plugin: null,
      config: null,
      settings: null
    };
  },
  methods: {
    toggleSetting(setting) {
      this.settings[setting] = !this.settings[setting];
      this.save();
    },
    setSetting(setting, value) {
      this.settings[setting] = value;
      this.save();
    },
    save(callback) {  
      this.plugin.update(error => {
        if (error) {
          return console.log(error);
        }

        if(callback) {
          callback();
        }
      });
    }
  }
};