<template>
  <toggle @toggled="plugin.toggleSetting(setting)" :value="plugin.settings[setting]"/>
</template>

<script>
module.exports = {
  props: ['plugin', 'setting']
};
</script>