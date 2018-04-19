<template>
  <textarea @change="updateSetting" :value="plugin.settings[setting].join(',')">
  </textarea>
</template>

<script>
module.exports = {
  props: ['plugin','setting'],
  methods: {
    updateSetting(event) {
      var value = event.target.value;
      
      if(value && value.indexOf(',') > -1) {
        value = value.split(',');
      }

      this.plugin.setSetting(this.setting, value);
    }
  }
};
</script>