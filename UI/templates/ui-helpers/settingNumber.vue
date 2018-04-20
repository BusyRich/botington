<template>
  <div class="plugin-setting">
    <h3 v-if="label">{{ label }}</h3>
    <input type='number' :min="min" :max="max" @change="updateSetting" :value="plugin.settings[setting]" />
  </div>
  
</template>

<script>
module.exports = {
  props: ['plugin', 'setting', 'label', 'min', 'max'],
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