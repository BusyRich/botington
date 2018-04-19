<template>
  <div id="plugins">
    <h1 v-if="disabled">Plugins Have Been Disabled</h1>
    <ul v-else>
      <li v-for="plugin in plugins" :key="plugin">
        <span class="plugin-icon">
          <i v-if="plugin.icon" :class="plugin.icon"></i>
          <i v-else class="fas fa-plug"></i>
        </span>
        <span class="plugin-toggle">
          <toggle @toggled="togglePlugin($event, plugin.name)" :value="plugin.enabled"/>
        </span>
        <h3>{{ plugin.displayName }} v{{ plugin.version }}</h3>
        <a v-if="plugin.ui.container" class="settings-link" :onclick="'switchTab(\'#' + plugin.ui.container + '\')'">
          <span>Settings <i class="fas fa-caret-right fa-lg"></i></span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
module.exports = {
  created() {
    for(let p in bot.plugins) {
      this.updatePlugin(bot.plugins[p]);
    }
  },
  data() {
    return {
      updates: 0,
      disabled: bot.pluginsDisabled,
      plugins: {}
    };
  },
  methods: {
    updatePlugin(plugin) {
      this.$set(this.plugins, plugin.name, {
        name: plugin.name,
        displayName: plugin.displayName,
        version: plugin.config.version,
        icon: plugin.config.icon,
        enabled: plugin.enabled,
        ui: Object.assign({}, plugin.config.ui)
      });
    },
    togglePlugin(toggle, plugin) {
      let p = bot.plugins[plugin],
          cb = (error) => {
            if(error) {
              toggle.set(p.enabled);
              return console.log(error);
            }
            
            this.updatePlugin(p);
          };

      if(p.enabled) {
        p.disable(cb);
      } else {
        p.enable(cb);
      }
    }
  }
}
</script>

<style lang="scss">
#plugins {
  padding: 10px;
   
  ul {
    list-style: none;

    li {
      position: relative;
      width: 50%;
      float: left;
      padding: 10px;

      .plugin-icon,
      .plugin-toggle {
        display: block;
        float: left;
        width: 70px;
        height: 70px;
        line-height: 70px;
        font-size: 50px;
        text-align: center;
      }

      .plugin-toggle {
        float: right;
        font-size: 38px;

        a {
          cursor: pointer;
        }

        [class*='on'] {
          color: #a6e22a;
        }
      }

      .settings-link {
        cursor: pointer;

        i, svg {
          width: 0;
          transition: width 0.2s;
        }

        &:hover {
          color: #f92672;

          i,svg {
            width: 10px;
          }
        }
      }
    }
  }
}
</style>

