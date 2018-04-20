<template>
  <div :id="plugin.config.ui.container" class="plugin-ui">
    <h1>
      <i v-if="plugin.config.icon" :class="plugin.config.icon"></i>
      <i v-else class="fas fa-plug"></i>
      <span> {{ plugin.displayName }} v{{ plugin.config.version }}</span>
    </h1>
    <div class="plugin-ui-content">
      <slot></slot>
    </div>   
  </div>
</template>

<script>
module.exports = {
  props: ['plugin'],
  model: {
    prop: 'plugin'
  }
};
</script>

<style lang="scss">
@import 'UI/scss/_globals';

.plugin-ui {
  display: flex;
  flex-flow: column;
  height: 100%;
  padding: 10px;

  h1 {
    padding: 5px 0;
    border-bottom: 1px solid $colors-light;
  }

  .plugin-ui-content {
    flex: 1;
    overflow-x: auto;
    padding: 10px;
  }
}
</style>