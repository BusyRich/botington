<template>
  <div id="plugins">
    <h1 v-if="disabled">Plugins Have Been Disabled</h1>
    <div v-else>
      <div v-for="rowIndex in Math.ceil(names.length / 2)" :key="rowIndex" class="row two-col">
        <div v-for="plugin in getPlugins((rowIndex - 1) * 2, 2)" :key="plugin" class="plugin">
          <span class="plugin-icon">
            <i :class="plugin.icon"></i>
          </span>
          <span class="plugin-toggle">
            <toggle @toggled="togglePlugin($event, plugin.name)" :value="plugin.enabled"/>
          </span>
          <h3>{{ plugin.displayName }} v{{ plugin.version }}</h3>
          <div v-if="plugin.ui.container" class="add-sidebar">
            <span>Add to Sidebar?</span>
            <toggle @toggled="toggleSideNav($event, plugin.name)" :value="plugin.addNav" size="30"/>
          </div>
          <a v-if="plugin.ui.container" class="settings-link" :onclick="'Botington.ui.switchTab(\'#' + plugin.ui.container + '\')'">
            <span>Settings <i class="fas fa-caret-right fa-lg"></i></span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  created() {
    for(let p in bot.plugins) {
      this.updatePlugin(bot.plugins[p]);
    }

    this.names = Object.keys(this.plugins);
  },
  data() {
    return {
      updates: 0,
      disabled: bot.pluginsDisabled,
      plugins: {},
      names: []
    };
  },
  methods: {
    getPlugins(start, amount) {
      let tmpP = [];

      for(let p = start; p < start + amount; p++) {
        if(p < this.names.length) {
          tmpP.push(this.plugins[this.names[p]]);
        }
      }

      return tmpP;
    },
    updatePlugin(plugin) {
      this.$set(this.plugins, plugin.name, {
        name: plugin.name,
        displayName: plugin.displayName,
        version: plugin.config.version,
        icon: plugin.icon,
        enabled: plugin.enabled,
        addNav: plugin.addNav,
        ui: Object.assign({}, plugin.config.ui)
      });
    },
    togglePlugin(toggle, pluginName) {
      let p = bot.plugins[pluginName],
          cb = (error) => {
            if(error) {
              toggle.set(p.enabled);
              return console.log(error);
            }
          };

      if(p.enabled) {
        p.disable(cb);
      } else {
        p.enable(cb);
      }
    },
    setSideNav(plugin) {
      let pUI = plugin.config.ui || {};

      if(plugin.addNav) {
        Botington.ui.nav.addTab({
          name: plugin.name,
          icon: plugin.icon,
          label: plugin.displayName,
          element: `#${pUI.container}`,
        });
      } else {
        Botington.ui.nav.removeTab(plugin.name);
      }
    },
    toggleSideNav(toggle, pluginName) {
      let p = bot.plugins[pluginName];
      
      p.addNav = !p.addNav;

      p.update((error) => {
        if(error) {
          toggle.set(p.addNav);
          return console.log(error);
        }

        this.setSideNav(p);
      });
    }
  }
}
</script>

<style lang="scss">
@import 'UI/scss/_globals';

#plugins {
  padding: 10px;
   
  .plugin {
    position: relative;
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

    .add-sidebar .switch {
      margin-left: 10px;
      vertical-align: middle;
    }

    .plugin-toggle {
      float: right;
      font-size: 38px;

      a {
        cursor: pointer;
      }

      [class*='on'] {
        color: $colors-green;
      }
    }

    .settings-link {
      cursor: pointer;

      i, svg {
        width: 0;
        transition: width 0.2s;
      }

      &:hover {
        color: $colors-pink;

        i,svg {
          width: 10px;
        }
      }
    }
  }
}
</style>

