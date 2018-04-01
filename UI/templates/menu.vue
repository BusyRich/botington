<template>
  <div id="menu">
    <ul>
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
      }]
    };
  }
}
</script>
