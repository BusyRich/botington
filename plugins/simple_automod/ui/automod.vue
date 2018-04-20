<template>
  <plugin v-model="plugin">
    <div class="row stacked">
      <div>
        <h2>Ignore Streamer</h2>
        <setting-toggle :plugin="this" setting="ignore-broadcaster" />
      </div>
      <div>
        <h2>Ignore Moderators</h2>
        <setting-toggle :plugin="this" setting="ignore-mods"/>
      </div>
    </div>
    <div class="row">
      <div>
        <h2>Increasing Timeouts</h2>
        <setting-toggle :plugin="this" setting="progressive-timeouts"/>
      </div>
      <div>
        <h2>Block URLs</h2>
        <setting-toggle :plugin="this" setting="remove-urls"/>
      </div>
    </div>
    <div class="row">
      <div>
        <h2>Timeout Multiplier</h2>
        <setting-number :plugin="this" setting="progressive-timeout-length" min="0"/>
      </div>
      <div>
        <h2>Timeout Threshold</h2>
        <setting-number :plugin="this" setting="progressive-timeout-threshold" min="0"/>
      </div>
    </div>
    <div class="row">
      <div>
        <h2>Restricted Words</h2>
        <setting-multilist :plugin="this" setting="restricted-words"/>
      </div>
    </div>
  </plugin>
</template>

<script>
module.exports = {
  mixins: [uiHelpers.mixins.plugin],
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

