<template>
  <div id="plugins">
    <ul>
      <li v-for="plugin in plugins" :key="plugin.name">
        <span class="plugin-icon">
          <i v-if="plugin.icon" :class="plugin.icon"></i>
          <i v-else class="fas fa-plug"></i>
        </span>
        <h3>{{ plugin['display-name'] || plugin.name.replace('-', ' ') }} v{{ plugin.version }}</h3>
        <a v-if="plugin.ui" class="settings-link" :onclick="'switchTab(\'#' + plugin.ui.container + '\')'">
          <span>Settings <i class="fas fa-caret-right fa-lg"></i></span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  created() {
    for(let p in bot.plugins) {
      this.addPlugin(bot.plugins[p]);
    }
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
#plugins {
  padding: 10px;
   
  ul {
    list-style: none;

    li {
      width: 50%;
      float: left;
      padding: 10px;

      .plugin-icon {
        display: block;
        float: left;
        width: 70px;
        height: 70px;
        line-height: 70px;
        font-size: 50px;
        text-align: center;
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

