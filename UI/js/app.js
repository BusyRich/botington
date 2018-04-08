window.eWindow = require('electron').remote.getCurrentWindow();
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

  //tab names can be either id selectors or
  //and actual name of the tab object to reference
  //This allows use to use this for the side menu and
  //just raw HTML elements we want to scroll to
  if(tabName.indexOf('#') === 0) {
    scrollTo = $(tabName).offset();
  } else {
    for(let t = 0; t < tabs.length; t++) {
      if(tabs[t].name === tabName) {
        scrollTo = $(tabs[t].element).offset();
        break;
      }
    }
  }

  if(scrollTo && scrollTo.top != 0) {
    let content = $('#content');
    content.animateScroll(content.scrollTop() + scrollTo.top, 200);
  }
};

//These are the main Vue components used in the UI
import menu from './templates/menu.vue';
Vue.component('side-menu', menu);

import pluginList from './templates/plugins.vue';
Vue.component('plugins', pluginList);

import chat from './templates/chat.vue';
Vue.component('chat-messages', chat);

import chatterList from './templates/chatterList.vue';
Vue.component('chatter-list', chatterList);

let fs = require('fs'),
    helpersFolder = __dirname + '/templates/ui-helpers',
    uiHelpers = fs.readdirSync(helpersFolder);

for(let h = 0; h < uiHelpers.length; h++) {
  Vue.component(uiHelpers[h].slice(0, -4), 
    require(helpersFolder + '/' + uiHelpers[h]));
}

//Making these seperate functions is required
//so we can unbind them from the bot later
const onNames = data => eBus.$emit('names', data),
      onJoin = data => eBus.$emit('join', data),
      onMessage = data => eBus.$emit('message', data);

const onReady = () => {
  //Loads in the plugin Vue components
  for(let p in bot.plugins) {
    let pluginUI = bot.plugins[p].config.ui;

    if(pluginUI) {
      if(pluginUI.component && pluginUI.tag) {
        //We have to add the tag used by the vue component
        $('#content').append('<' + pluginUI.tag +'/>');
        Vue.component(pluginUI.tag, require(pluginUI.component));
      }
    }
  }

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
