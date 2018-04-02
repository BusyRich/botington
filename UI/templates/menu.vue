<template>
  <div id="menu">
    <ul>
      <li>
        <img id="botingtonLogo" src="img/logo.svg"/>
      </li>
      <li v-for="item in items" :key="item.name">
        <a href="#">
          <span class="icon"><i :class="'fas fa-' + item.icon"></i></span>
          <span class="label">{{ item.label }}</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [{
        name: 'chat',
        icon: 'comment-alt',
        label: 'Chat Monitor'
      },{
        name: 'plugins',
        icon: 'plug',
        label: 'Plugins'
      }]
    };
  }
}
</script>

<style lang="scss" scoped>
  #menu {
    position: fixed;
    top: 0;
    left: 0;
    width: 48px;
    font-size: 24px;
    background-color: #eaeaea;

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
          background-color: #eaeaea;
          transition: color 0.5s, background-color 0.5s;
        }
        
        .label {
          left: -100px;
          display: inline-block;
          width: fit-content;
          font-size: 16px;
          padding: 0 10px;
          color: #eaeaea;
          white-space: nowrap;
          border: 1px solid #3F3F3F;
          background-color: #3F3F3F;
          border-radius: 0 8px 8px 0;
          transition: left 0.5s;
        }
        
        &:hover {
          .icon {
            color: #eaeaea;
            background-color: #3F3F3F;
          }

          .label {
            left: 48px;
          }
        }
      }
    }
  }
</style>

