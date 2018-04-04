const eWindow = require('electron').remote.getCurrentWindow();

window.bot = eWindow.bot;
window.eBus = new Vue();
window.tabs = [{
  name: 'chat',
  icon: 'comment-alt',
  label: 'Chat Monitor',
  element: '#monitor',
},{
  name: 'plugins',
  icon: 'plug',
  label: 'Plugins',
  element: '#plugins'
}];

window.switchTab = function(tabName) {
  let scrollTo = null;
  
  for(let t = 0; t < tabs.length; t++) {
    if(tabs[t].name === tabName) {
      scrollTo = $(tabs[t].element).offset().top;
      break;
    }
  }

  if(scrollTo && scrollTo != 0) {
    $('#content').scrollTop(scrollTo);
  }
};

import menu from './templates/menu.vue';
Vue.component('side-menu', menu);

import pluginList from './templates/plugins.vue';
Vue.component('plugins', pluginList);

import chat from './templates/chat.vue';
Vue.component('chat-messages', chat);

import chatterList from './templates/chatterList.vue';
Vue.component('chatter-list', chatterList);

//Making these seperate functions is required
//so we can unbind them from the bot later
const onNames = data => eBus.$emit('names', data),
      onJoin = data => eBus.$emit('join', data),
      onMessage = data => eBus.$emit('message', data);

const onReady = () => {
  eBus.$emit('ready');

  window.vm = new Vue({
    el: '#app'
  });
};

$(document).ready(() => {
  bot.on('names', onNames);
  bot.on('join', onJoin);
  bot.on('message', onMessage);
  bot.on('ready', onReady);

  if(!bot.initialized) {
    bot.initialize();
  } else {
    onReady();
  }
});

//When closing, we must unbind all our events
//to prevent an overload of handlers being bound on
//each page refresh.
window.onbeforeunload = () => {
  bot.off('names', onNames);
  bot.off('join', onJoin);
  bot.off('message', onMessage);
  bot.off('ready', onReady);
};
