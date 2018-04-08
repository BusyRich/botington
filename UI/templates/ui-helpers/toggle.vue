<template>
  <a class="toggleSlider" @click="toggle">
    <i :class="'fas fa-toggle-' + (data.toggleState ? 'on' : 'off')"></i>
  </a>
</template>

<script>
module.exports = {
  props: ['toggleKey'],
  created() {
    this.data.toggleState = this.toggleKey;
  },
  data() {
    return {
      data: {
        toggleState: true
      }
    };
  },
  methods: {
    toggle() {
      this.$set(this.data, 'toggleState', !this.data.toggleState);
      console.log(this.data.toggleState);
      this.$emit('click', this.data.toggleState);
    }
  }
}
</script>
