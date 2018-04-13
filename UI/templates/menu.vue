<template>
  <div id="menu">
    <ul>
      <li>
        <img id="botingtonLogo" src="img/logo.svg"/>
      </li>
      <li v-for="tab in tabs" :key="tab.name">
        <a :onclick="'switchTab(\'' + tab.name + '\')'">
          <span class="icon"><i :class="tab.icon"></i></span>
          <span class="label">{{ tab.label }}</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
module.exports = {
  created() {
    for(let t = 0; t < tabs.length; t++) {
      this.addTab(tabs[t]);
    }
  },
  data() {
    return {
      tabs: {}
    };
  },
  methods: {
    addTab(tab) {
      this.tabs[tab.name] = tab;
    }
  }
}
</script>

<style lang="scss">
@import 'UI/scss/_globals';

#menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 48px;
  font-size: 24px;
  background-color: $colors-light;
  z-index: 1;

  #botingtonLogo {
    width: 40px;
    margin: 4px;
  }

  li {
    height: 48px;

    a {
      position: relative;
      display: inline-block;
      width: 48px;
      height: 48px;
      line-height: 48px;
      font-size: 24px;
      color: inherit;
      text-decoration: none;
      cursor: pointer;
      
      span {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }
      
      .icon {
        text-align: center;
        z-index: 1;
        background-color: $colors-light;
        transition: color 0.5s, background-color 0.5s;
      }
      
      .label {
        left: -40em;
        display: inline-block;
        width: fit-content;
        font-size: 16px;
        padding: 0 10px;
        color: $colors-light;
        white-space: nowrap;
        border: 1px solid $colors-dark;
        background-color: $colors-dark;
        border-radius: 0 8px 8px 0;
        transition: left 0.5s;
      }
      
      &:hover {
        .icon {
          color: $colors-light;
          background-color: $colors-dark;
        }

        .label {
          left: 48px;
        }
      }
    }
  }
}
</style>

