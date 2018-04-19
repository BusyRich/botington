<template>
  <label class="switch toggle">
    <input type="checkbox" @click="toggled" :checked="value">
    <span :class="'slider round' + (color ? ' ' + color : '')"></span>
  </label>
</template>

<script>
module.exports = {
  props: {
    value: {
      type: Boolean,
      required: true
    },
    size: {
      type: Number,
      required: false
    },
    color: {
      type: String,
      required: false
    }
  },
  mounted() {
    if(this.size && this.size > 0) {
      this.$el.setAttribute('style', 
        `width:${this.size}px;height:${this.size * 0.65}px;`);
    }
  },
  methods: {
    toggled() {
      this.$emit('toggled', this);
    },
    set(checked) {
      this.$el.querySelector('input').checked = checked;
    }
  }
};
</script>

<style lang="scss">
@import 'UI/scss/_globals';
$width: 42px;

.switch {
  position: relative;
  display: inline-block;
  width: $width;
  height: $width * 0.65;

  input {
    display: none;

    &:checked + .slider {
      background-color: $colors-green;

      &.purple {
        background-color: $colors-purple;
      }

      &.blue {
        background-color: $colors-blue;
      }

      &.black {
        background-color: $colors-dark;
      }
    }

    &:checked + .slider:before {
      transform: translateX(58%);
    }
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: $colors-light;
    transition: 0.4s;
  
    &:before {
      position: absolute;
      content: "";
      height: 75%;
      width: 49%;
      left: 12%;
      bottom: 11%;
      background-color: white;
      transition: 0.4s;
    }

    &.round {
      border-radius: 500px;

      &:before {
        border-radius: 50%;
      }
    }
  }
}


</style>