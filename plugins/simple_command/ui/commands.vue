<template>
  <plugin v-model="plugin">
    <h2>{{ config.dependencies.toString() }}</h2>
    <div v-for="cmd in commands" :key="cmd.name" :id="cmd.name">
      <input type="text" class="cmd-name" :value="cmd.name" @change="commandUpdated(cmd.name)"/>
      <input type="text" class="cmd-text" :value="cmd.text" @change="commandUpdated(cmd.name)"/>
      <input type="number" class="cmd-cost" :value="cmd.cost" @change="commandUpdated(cmd.name)"/>
      <a @click="removeCommand(cmd.name)"><i  class="far fa-trash-alt"></i></a>
    </div>
    <div id="newCommand">
      <input type="text" class="cmd-name" @change="commandUpdated('new')"/>
      <input type="text" class="cmd-text" @change="commandUpdated('new')"/>
      <input type="number" class="cmd-cost" @change="commandUpdated('new')"/>
    </div>
  </plugin>
</template>

<script>
module.exports = {
  mixins: [uiHelpers.mixins.plugin],
  created() {
    for(cmd in this.plugin.commands) {
      this.addCommand(this.plugin.commands[cmd]);
    }

    this.newFields = {
      name: '#newCommand .cmd-name',
      text: '#newCommand .cmd-text',
      cost: '#newCommand .cmd-cost'
    }
  },
  data() {
    return {
      name: "simple-command",
      commands: [],
      newFields: {}
    };
  },
  methods: {
    addCommand(initValues = {name:'',text:'',cost:''}) {
      if(!initValues.name) {
        return;
      }

      this.commands.push({
        name: initValues.name,
        text: initValues.text,
        cost: initValues.cost,
        index: this.commands.length,
        fields: {
          name: `#${initValues.name} .cmd-name`,
          text: `#${initValues.name} .cmd-text`,
          cost: `#${initValues.name} .cmd-cost`,
        }
      });
    },
    clearNew() {
      $(this.newFields.name).val('');
      $(this.newFields.text).val('');
      $(this.newFields.cost).val('');
    },
    getValues(name) {
      if(name === 'new') {
        return {
          name: $(this.newFields.name).val(),
          text: $(this.newFields.text).val(),
          cost: $(this.newFields.cost).val()
        };
      }

      let cmd = _.find(this.commands, {name:name});

      return {
        name: $(cmd.fields.name).val(),
        text: $(cmd.fields.text).val(),
        cost: $(cmd.fields.cost).val()
      };
    },
    commandUpdated(name) {
      let values = this.getValues(name);

      if(values.name && values.text) {
        if(values.cost) {
          values.cost = parseInt(values.cost);
        }

        this.plugin.saveCommand(
          (name === 'new' ? values.name : name), 
          values,
          error => {
            if(!error && name === 'new') {
              this.addCommand(values);
              this.clearNew();
            }
          });
      } else {
        console.log('not enough information');
      }
    },
    removeEntry(name) {
      let cmd = _.find(this.commands, {name:name});
      this.commands.splice(cmd.index, 1);

      for(let c = cmd.index; c < this.commands.length; c++) {
        this.commands[c].index = c;
      }
    },
    removeCommand(name) {
      this.plugin.removeCommand(name, error => {
        if(!error) {
          this.removeEntry(name);
        }
      });
    }
  }
};
</script>