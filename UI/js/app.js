const eWindow = require('electron').remote.getCurrentWindow();

window.bot = eWindow.bot;
window.eBus = new Vue();

import menu from './templates/menu.vue';
Vue.component('side-menu', menu);

import chat from './templates/chat.vue';
Vue.component('chat-messages', chat);

import chatterList from './templates/chatterList.vue';
Vue.component('chatter-list', chatterList);

//Making these seperate functions is required
//so we can unbind them from the bot later
const onNames = data => eBus.$emit('names', data),
      onJoin = data => eBus.$emit('join', data),
      onMessage = data => eBus.$emit('message', data);

$(document).ready(() => {
  window.vm = new Vue({
    el: '#app'
  });

  bot.on('names', onNames);
  bot.on('join', onJoin);
  bot.on('message', onMessage);

  if(!bot.initialized) {
    bot.initialize();
  }
});

//When closing, we must unbind all our events
//to prevent an overload of handlers being bound on
//each page refresh.
window.onbeforeunload = () => {
  bot.off('names', onNames);
  bot.off('join', onJoin);
  bot.off('message', onMessage);
};
