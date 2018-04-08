<template>
  <div id="automod">
    <h1>{{plugin.name}}: Control Panel</h1>
    <div class="setting-module">
      <h2>Ignore Streamer</h2>
      <label class="switch" v-on:click="toggleSetting('ignore-broadcaster')">
        <input type="checkbox" v-model="plugin['ignore-broadcaster']">
        <span class="slider round"></span>
      </label>
    </div>
    <div class="setting-module">
      <h2>Ignore Moderators</h2>
      <label class="switch">
        <input type="checkbox" v-model="plugin['ignore-mods']">
        <span class="slider round"></span>
      </label>
    </div>
    <div class="setting-module">
      <h2>Increasing Timeouts</h2>
      <label class="switch">
        <input type="checkbox" v-model="plugin['progressive-timeouts']">
        <span class="slider round"></span>
      </label>
    </div>
    <div class="setting-module">
      <h2>Block URLs</h2>
      <label class="switch" v-on:click="toggleSetting('remove-urls')">
        <input type="checkbox" v-model="plugin['remove-urls']">
        <span class="slider round"></span>
      </label>
    </div>
  </div>
</template>

<script>
module.exports = {
  created() {
    console.log(bot.plugins["simple-automod"].config);
    this.updateData(bot.plugins["simple-automod"].config);
  },
  data() {
    return { 
    plugin: {}
    }
  },
  methods: {
    updateData(config) {
      this.$set(this.plugin, 'name', config["display-name"]);
      for (var key in config["default-settings"]) {
       this.$set(this.plugin, key, config["default-settings"][key]);
      }
    },
    toggleSetting(setting) {
      let b = bot.plugins['simple-automod'],
      s = bot.plugins['simple-automod'].config['default-settings'];
      console.log(s);
      callback = (err)=> {
        if(err){
          return console.log(err);
        }
        this.updateData(bot.plugins["simple-automod"].config);
      }

      if(s[setting]){
        s[setting] = false;
        b.update(callback);
      }else{
        s[setting] = true;
        b.update(callback);
      }
    }
  }
};
</script>

<style lang="scss">
#automod {
  font-family: monospace;
  padding: 10px;
  
  .setting-module {
    width: calc(50% - 20px);
    min-width: 150px;
    display: inline-block;
    padding: 20px;
  }

  /* The switch - the box around the slider */
  .switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
  }
  /* Hide default HTML checkbox */
  .switch input {
    display: none;
  }
  /* The slider */
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }
  .slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }
  input:checked + .slider {
    background-color: #2196f3;
  }
  input:focus + .slider {
    box-shadow: 0 0 1px #2196f3;
  }
  input:checked + .slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
  }
  /* Rounded sliders */
  .slider.round {
    border-radius: 34px;
  }
  .slider.round:before {
    border-radius: 50%;
  }
}
</style>

