window._ = require('lodash');
window.moment = require('moment');
window.Botington = {};
window.eWindow = require('electron').remote.getCurrentWindow();
window.bot = eWindow.bot;
window.eBus = new Vue();
window.tabs = [];
Botington.ui = {
  components: {},
  mixins: {
    plugin: require(__dirname + '/js/plugin.mixin')
  },
  tabs: [{
    name: 'chat',
    icon: 'fas fa-comment-alt',
    label: 'Chat Monitor',
    element: '#monitor',
  },{
    name: 'plugins',
    icon: 'fas fa-plug',
    label: 'Plugins',
    element: '#plugins'
  }]
};

Botington.ui.switchTab = function(tabName) {
  let scrollTo = null;

  //tab names can be either id selectors or
  //and actual name of the tab object to reference
  //This allows use to use this for the side menu and
  //just raw HTML elements we want to scroll to
  if(tabName.indexOf('#') === 0) {
    scrollTo = $(tabName).offset();
  } else {
    for(let t = 0; t < Botington.ui.tabs.length; t++) {
      if(Botington.ui.tabs[t].name === tabName) {
        scrollTo = $(Botington.ui.tabs[t].element).offset();
        break;
      }
    }
  }

  if(scrollTo && scrollTo.top != 0) {
    let content = $('#content');
    content.animateScroll(content.scrollTop() + scrollTo.top, 200);
  }
};

//These are the main Vue components used in the base UI
import nav from './templates/nav.vue';
Vue.component('side-nav', nav);

import pluginList from './templates/plugins.vue';
Vue.component('plugins', pluginList);

import chat from './templates/chat.vue';
Vue.component('chat-messages', chat);

import chatterList from './templates/chatterList.vue';
Vue.component('chatter-list', chatterList);

let fs = require('fs'),
    helpersFolder = __dirname + '/templates/ui-helpers',
    helperFiles = fs.readdirSync(helpersFolder);

//Load in the UI helper components, for use by plugin vues
for(let h = 0; h < helperFiles.length; h++) {
  let name = helperFiles[h].slice(0, -4);

  Botington.ui.components[name] = require(helpersFolder + '/' + helperFiles[h]);
  Vue.component(name, Botington.ui.components[name]);
}

//Making these seperate functions is required
//so we can unbind them from the bot later
const onNames = data => eBus.$emit('names', data),
      onJoin = data => eBus.$emit('join', data),
      onPart = data => eBus.$emit('part', data),
      onMessage = data => eBus.$emit('message', data);

const onReady = () => {
  //Loads in the plugin Vue components
  for(let p in bot.plugins) {
    let plugin = bot.plugins[p],
        pluginUI = plugin.config.ui;

    if(pluginUI) {
      if(plugin.enabled && pluginUI.component && pluginUI.tag) {
        //We have to add the tag used by the vue component
        $('#content').append('<' + pluginUI.tag +'/>');
        Vue.component(pluginUI.tag, require(pluginUI.component));
      }
    }

    if(bot.plugins[p].addNav === true) {
      Botington.ui.tabs.push({
        name: plugin.name,
        icon: plugin.config.icon,
        label: plugin.displayName,
        element: `#${pluginUI.container}`,
      });
    }
  }

  window.vm = new Vue({
    el: '#app'
  });

  Botington.ui.nav = vm.$refs.sideNav;
};

$(document).ready(() => {
  bot.on('names', onNames);
  bot.on('join', onJoin);
  bot.on('part', onPart);
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
  bot.off('leave', onPart);
  bot.off('message', onMessage);
  bot.off('ready', onReady);
};
