<template>
  <div class="plugin-setting">
    <h3 v-if="label">{{ label }}</h3>
    <toggle @toggled="plugin.toggleSetting(setting)" :value="plugin.settings[setting]"/>
  </div>
  
</template>

<script>
module.exports = {
  props: ['plugin', 'setting', 'label']
};
</script>