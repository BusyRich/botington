<template>
  <plugin v-model="plugin">
    <div class="setting-module">
      <h2>Ignore Streamer</h2>
      <setting-toggle :plugin="this" setting="ignore-broadcaster" />
    </div>
    <div class="setting-module">
      <h2>Ignore Moderators</h2>
      <setting-toggle :plugin="this" setting="ignore-mods"/>
    </div>
    <div class="setting-module">
      <h2>Increasing Timeouts</h2>
      <setting-toggle :plugin="this" setting="progressive-timeouts"/>
    </div>
    <div class="setting-module">
      <h2>Block URLs</h2>
      <setting-toggle :plugin="this" setting="remove-urls"/>
    </div>
    <div class="setting-module">
      <h2>Timeout Multiplier</h2>
      <setting-number :plugin="this" setting="progressive-timeout-length" min="0"/>
    </div>
    <div class="setting-module">
      <h2>Timeout Threshold</h2>
      <setting-number :plugin="this" setting="progressive-timeout-threshold" min="0"/>
    </div>
    <div class="setting-module-double">
      <h2>Restricted Words</h2>
      <setting-multilist :plugin="this" setting="restricted-words"/>
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
  font-family: monospace;
  padding: 10px;

  .setting-module {
    width: calc(50% - 20px);
    min-width: 150px;
    display: inline-block;
    padding: 20px;
  }
  .setting-module-double {
    width: calc(100% - 20px);
    min-width: 150px;
    display: inline-block;
    padding: 20px;

    textarea {
      width: 100%;
      max-width: 100%;
      height: 8rem;
    }
  }

  /* Number Inputs */
  input[type="number"] {
    width: 5rem;
    height: 3rem;
    font-size: 2rem;
    text-align: right;
  }
}
</style>

