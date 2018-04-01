<template>
  <div id="chatWrapper" class="height-100">
    <div id="chatMessages">
      <p v-for="message in messages" :key="message.id" class="message">
        <i v-if="message.meta.mod" class="fas fa-shield-alt"></i>
        <i v-if="message.meta.subscriber" class="far fa-credit-card"></i>
        <i v-if="message.meta.badges && message.meta.badges.broadcaster" class="fas fa-video"></i>
        <i v-if="message.meta.turbo" class="fas fa-battery-full"></i>
        <span :style="{color:message.meta.color}">{{ message.username }}</span>: {{ message.message }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    eBus.$on('message', data => this.addMessage(data));
  },
  data() {
    return {
      count: 0,
      messages: []
    };
  },
  methods: {
    addMessage(data) {
      this.messages.push(data);
      this.count++;
    },
    populate() {
      setInterval(() => {
        let id = Math.random() * 10000000000000;

        this.addMessage({
          type: 'message',
          username: 'busyrich',
          channel: 'busyrich',
          message: `This is message ${id} / ${this.count + 1}`,
          meta: {
            badges: { 
              broadcaster: '1', turbo: '1'
            },
            color: '#8A2BE2',
            id: id,
            mod: true,
            subscriber: true,
            turbo: true,
            'user-id': '137009977'
          }});
        }, 1000);
    },
    scrollToBottom() {
      let container = this.$el;
      container.scrollTop = container.scrollHeight;
    }
  },
  updated() {
    this.scrollToBottom();
  }
}
</script>

<style lang="scss" scoped>
  #chatWrapper {
    width: 75%;
    overflow: auto;
    padding: 10px;

    #chatMessages {
      display: flex;
      justify-content: flex-end;
      flex-direction: column;
      min-height: 100%;
  
      .message {
        flex: 0 0 auto;
        min-height: min-content;
        padding-left: 8px;
        margin: 6px 0;
        border-left: 2px solid #eaeaea;
        z-index: 0;
      }
    }
  }
</style>

