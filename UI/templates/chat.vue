<template>
  <div id="chatWrapper" class="height-100">
    <div id="chatMessages">
      <p v-for="message in messages" :key="message.id" class="message" :style="{borderColor:message.meta.color}">
        <span class="text">
          <span class="sender" :style="{color:message.meta.color}">{{ message.username }}</span>:
          <span v-html="message.message"></span>
        </span>
        <br/>
        <span class="meta" >{{ message.time }}</span>
      </p>
    </div>
  </div>
</template>

<script>
const atFilter = /(@)([a-z0-9_]{4,25})/gi;

const sortEmotes = function(a, b) {
  return a.start - b.start;
};

const scrollToButt = function(el, atBottom) {
  if(el.scrollHeight === el.clientHeight || !atBottom) {
    return;
  }

  el.scrollTop = el.scrollHeight;
  atBottom = true;
};

module.exports = {
  created() {
    eBus.$on('message', data => this.addMessage(data));
    this.getMessages();
  },
  mounted() {
    this.$el.addEventListener('scroll', () => {
      this.atBottom = this.$el.scrollTop === 
        this.$el.scrollHeight - this.$el.clientHeight;
    });
    this.scroll();
  },
  data() {
    return {
      tmp: null,
      atBottom: true,
      count: 0,
      messages: [],
      scrubs: [ //Character replacements
        [/</g, '&lt;'],
        [/>/g, '&gt;']
      ]
    };
  },
  updated() {
    this.scroll();
  },
  methods: {
    addMessage(data) {
      let m = data.message,
          message = "";

      if(data.meta.emotes) {
        let motes = data.meta.emotes,
            em = 0,
            c = 0;

        do {
          if(motes[em] && c == motes[em].start) {
            message += `<img src="http://static-cdn.jtvnw.net/emoticons/v1/${motes[em].id}/1.0"/>`;
            c = motes[em].end + 1;
            em++;
          } else {
            //In order for emotes to work with messages included
            //scrubed characters, we must take them into account 
            //as we build the emoted message 
            let scrubed = false;
            for(let s of this.scrubs) {
              if(s[0].test(m[c])) {
                message += s[1];
                scrubed = true;
                break;
              }
            }

            if(!scrubed) {
              message += m[c];
            }

            c++;
          }
        } while(c < m.length);
      } else {
        for(let s of this.scrubs) {
          m = m.replace(s[0], s[1]);
        }

        message = m;
      }

      message = message.replace(atFilter, 
        '<span class="at-username" data-user="$2">$1$2</span>');

      data.message = message;
      data.time = moment().format('MM/DD/YY @ hh:mmA');

      if(this.messages.length === 200) {
        this.messages.shift();
      }

      this.messages.push(data);
      this.saveMessages();

      vm.$refs.chatters.updateChatter({
        username: data.username,
        mod: data.meta.mod,
        subscriber: data.meta.subscriber,
        broadcaster: data.meta.badges && data.meta.badges.broadcaster,
        turbo: data.meta.turbo
      });
      this.count++;
    },
    getMessages() {
      this.messages = JSON.parse(localStorage.getItem('chatMessages')) || [];
    },
    saveMessages() {
      localStorage.setItem('chatMessages', JSON.stringify(this.messages));
    },
    populate(delay = 1000) {
      this.tmp = setInterval(() => {
        let id = Math.random() * 10000000000000;

        this.addMessage({
          type: 'message',
          username: 'busyrich',
          channel: 'busyrich',
          message: `This <b>is</b> @notarealuser message ${id} / ${this.count + 1}`,
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
        }, delay);
    },
    stopIt() {
      clearInterval(this.tmp);
    },
    scroll() {
      setTimeout(() => scrollToButt(this.$el, this.atBottom), 1);
    }
  }
}
</script>

<style lang="scss">
@import 'UI/scss/_globals';

#chatWrapper {
  width: 75%;
  overflow: auto;

  #chatMessages {
    display: flex;
    justify-content: flex-end;
    flex-direction: column;
    min-height: 100%;

    .message {
      flex: 0 0 auto;
      min-height: min-content;
      padding-left: 8px;
      margin: 10px;
      border-left: 2px solid $colors-light;
      z-index: 0;

      .meta {
        height: 100%;
        width: 40px;
        line-height: 20px;
        color: $colors-light;
      }

      .text {
        .at-username {
          padding: 3px 5px;
          background-color: $colors-light;
        }

        img {
          vertical-align: middle;
        }
      }
    }
  }
}
</style>

