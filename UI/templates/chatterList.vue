<template>
  <ul id="chatters" class="height-100" >
    <li v-for="username in chatters" :key="username" class="chatter" :id="'chatter-' + username">
      <i class="fa fa-user"></i>
      <span>{{ username }}</span>
    </li>
  </ul>
</template>

<script>
export default {
  created() {
    if(bot.initialized) {
      bot.chatters.forEach(username => this.addChatter(username));
    }

    eBus.$on('names', data => data.users.forEach(
      username => this.addChatter(username)));

    eBus.$on('join', data => this.addChatter(data.username));
  },
  data()  { return {
    chatters: []
  }},
  methods: {
    addChatter(username) {
      if(this.chatters.indexOf(username) < 0) {
        this.chatters.push(username);
      }
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

