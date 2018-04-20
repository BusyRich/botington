<template>
  <div class="plugin-setting">
    <h3 v-if="label">{{ label }}</h3>
    <textarea @change="updateSetting" :value="plugin.settings[setting].join(',')">
    </textarea>
  </div>
</template>

<script>
module.exports = {
  props: ['plugin','setting', 'label'],
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