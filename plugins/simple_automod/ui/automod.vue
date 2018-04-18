<template>
  <plugin v-model="plugin">
    <div class="setting-module">
      <h2>Ignore Streamer</h2>
      <toggle :onClick="toggle_ignoreBroadcaster" :toggled="plugin['ignore-broadcaster']">
      </toggle>
    </div>
    <div class="setting-module">
      <h2>Ignore Moderators</h2>
      <toggle :onClick="toggle_ignoreMods" :toggled="plugin['ignore-mods']">
      </toggle>
    </div>
    <div class="setting-module">
      <h2>Increasing Timeouts</h2>
      <toggle :onClick="toggle_progressiveTimeouts" :toggled="plugin['progressive-timeouts']">
      </toggle>
    </div>
    <div class="setting-module">
      <h2>Block URLs</h2>
      <toggle :onClick="toggle_removeUrls" :toggled="plugin['remove-urls']">
      </toggle>
    </div>
    <div class="setting-module">
      <h2>Timeout Multiplier</h2>
      <input type='number' min='0' v-on:change="adjustSetting('progressive-timeout-length')" v-model="plugin['progressive-timeout-length']">
    </div>
    <div class="setting-module">
      <h2>Timeout Threshold</h2>
      <input type='number' min='0' v-on:change="adjustSetting('progressive-timeout-threshold')" v-model="plugin['progressive-timeout-threshold']">
    </div>
    <div class="setting-module-double">
      <h2>Restricted Words</h2>
      <textarea v-on:change="adjustArray('restricted-words')" v-model="plugin['restricted-words']"/>
    </div>
  </plugin>
</template>

<script>
module.exports = {
  mixins: [uiHelpers.mixins.plugin],
  created() {
    this.updateData(bot.plugins["simple-automod"].config);
  },
  data() {
    return {
      name: "simple-automod"
    };
  },
  methods: {
    updateBot() {
      let b = bot.plugins["simple-automod"],
        callback = err => {
          if (err) {
            return console.log(err);
          }
          console.log(bot.plugins["simple-automod"].config);
          this.updateData(bot.plugins["simple-automod"].config);
        };
      b.update(callback);
    },
    updateData(config) {
      this.$set(this.plugin, "name", config["display-name"]);
      for (var key in config["default-settings"]) {
        this.$set(this.plugin, key, config["default-settings"][key]);
      }
    },
    toggleSetting(setting) {
      let s = bot.plugins["simple-automod"].config["default-settings"];

      if (s[setting]) {
        bot.plugins["simple-automod"].config["default-settings"][
          setting
        ] = false;
        this.updateBot();
      } else {
        bot.plugins["simple-automod"].config["default-settings"][
          setting
        ] = true;
        this.updateBot();
      }
    },
    adjustSetting(setting) {
      bot.plugins["simple-automod"].config["default-settings"][
        setting
      ] = this.plugin[setting];
      this.updateBot();
    },
    adjustArray(setting) {
      bot.plugins["simple-automod"].config["default-settings"][
        setting
      ] = this.plugin[setting].split(",");
      this.updateBot();
    },
    toggle_ignoreBroadcaster() {
      this.toggleSetting("ignore-broadcaster");
    },
    toggle_ignoreMods() {
      this.toggleSetting("ignore-mods");
    },
    toggle_progressiveTimeouts() {
      this.toggleSetting("progressive-timeouts");
    },
    toggle_removeUrls() {
      this.toggleSetting("remove-urls");
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
  .setting-module-double {
    width: calc(100% - 20px);
    min-width: 150px;
    display: inline-block;
    padding: 20px;
    textarea {
      width: 100%;
      max-width: 100%;
      height: 8rem;
    }
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
  /* Number Inputs */
  input[type="number"] {
    width: 5rem;
    height: 3rem;
    font-size: 2rem;
    text-align: right;
  }
}
</style>

