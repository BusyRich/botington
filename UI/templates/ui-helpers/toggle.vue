<template>
  <a v-on:click="$emit('click')"><i :class="'fas fa-toggle-' + (toggleState ? 'on' : 'off')"></i></a>
</template>

<script>
module.exports = {
  props: ['toggleState']
}
</script>
