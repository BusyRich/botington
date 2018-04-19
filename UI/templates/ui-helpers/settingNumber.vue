<template>
  <input type='number' :min="min" :max="max" @change="updateSetting" :value="plugin.settings[setting]" />
</template>

<script>
module.exports = {
  props: ['plugin', 'setting', 'min', 'max'],
  methods: {
    updateSetting(event) {
      var value = event.target.value;
      
      if(typeof value === 'string') {
        value = parseInt(value);
      }

      this.plugin.setSetting(this.setting, value);
    }
  }
};
</script>