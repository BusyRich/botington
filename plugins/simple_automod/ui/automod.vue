<template>
  <plugin v-model="plugin">
    <div class="row stacked">
      <setting-toggle :plugin="this" setting="ignore-broadcaster" label="Ignore Streamer" />
      <setting-toggle :plugin="this" setting="ignore-mods" label="Ignore Moderators"/>
    </div>
    <div class="row">
      <setting-toggle :plugin="this" setting="progressive-timeouts" label="Increasing Timeouts"/>
      <setting-toggle :plugin="this" setting="remove-urls" label="Block URLs"/>
    </div>
    <div class="row">
      <setting-number :plugin="this" setting="progressive-timeout-length" label="Timeout Multiplier" min="0"/>
      <setting-number :plugin="this" setting="progressive-timeout-threshold" label="Timeout Threshold" min="0"/>
    </div>
    <div class="row">
      <setting-multilist :plugin="this" setting="restricted-words" label="Restricted Words"/>
    </div>
  </plugin>
</template>

<script>
module.exports = {
  mixins: [Botington.ui.mixins.plugin],
  data() {
    return {
      name: "simple-automod"
    };
  }
};
</script>

<style lang="scss">
#automod {
  textarea {
    width: 100%;
    max-width: 100%;
    height: 10rem;
  }
}
</style>

