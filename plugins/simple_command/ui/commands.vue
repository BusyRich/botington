<template>
  <plugin v-model="plugin">
    <h2>{{ config.dependencies.toString() }}</h2>
    <div v-for="t in testd" :key="t">Test Data #{{ t }}</div>
  </plugin>
</template>

<script>
module.exports = {
  mixins: [uiHelpers.mixins.plugin],
  created() {
    for(let t = 0; t < 100; t++) {
      this.testd.push(t);
    }
  },
  data() {
    return {
      name: 'simple-command',
      testd: []
    };
  }
}
</script>



