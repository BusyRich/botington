<template>
  <ul id="chatters" class="height-100" >
    <li v-for="chatter in chatters" :key="chatter.username" class="chatter" :id="'chatter-' + chatter.username">
      <i class="fa fa-user"></i>
      <span>{{ chatter.username }}</span>
      <i v-if="chatter.mod" class="fas fa-shield-alt"></i>
      <i v-if="chatter.subscriber" class="far fa-credit-card"></i>
      <i v-if="chatter.broadcaster" class="fas fa-video"></i>
      <i v-if="chatter.turbo" class="fas fa-battery-full"></i>
    </li>
  </ul>
</template>

<script>
module.exports = {
  created() {
    if(bot.initialized) {
      bot.chatters.forEach(username => this.addChatter(username));
    }

    eBus.$on('names', data => data.users.forEach(
      username => this.addChatter(username)));

    eBus.$on('join', data => this.addChatter(data.username));
    eBus.$on('part', data => this.removeChatter(data.username));
  },
  data()  { return {
    chatters: {}
  }},
  methods: {
    addChatter(username) {
      if(!this.chatters[username]) {
        this.$set(this.chatters, username, {username});
      }
    },
    updateChatter(memberInfo) {
      if(this.chatters[memberInfo.username]) {
        this.$set(this.chatters, memberInfo.username, memberInfo);
      }
    },
    removeChatter(username) {
      if(this.chatters[username]) {
        this.$delete(this.chatters, username);
      }
    },
    hasTags(username) {
      if(this.chatters[username]) {
        let chatter = this.chatters[username];
        return chatter.mod || chatter.subscriber || 
          chatter.broadcaster || chatter.turbo;
      }

      return false;
    }
  }
}
</script>

<style lang="scss" scoped>
  #chatters {
    width: 25%;
    list-style: none;
    padding: 5px 0;
    border-left: 1px solid #eaeaea;
    overflow-y: auto;

    .chatter {
      padding: 2px 10px;

      [class*='fa-'] {
        font-size: 0.75em;
      }
    }
  }
</style>

