<template>
  <div class="dc-loading" v-if="show">
    <div class="container1">
      <div class="circle circle1"></div>
      <div class="circle circle2"></div>
      <div class="circle circle3"></div>
      <div class="circle circle4"></div>
    </div>
    <div class="container2">
      <div class="circle circle1"></div>
      <div class="circle circle2"></div>
      <div class="circle circle3"></div>
      <div class="circle circle4"></div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      show: false,
    };
  },
};
</script>
<style lang="scss" scoped>
.dc-loading {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: 4;
  .container1,
  .container2 {
    width: 0.4rem;
    height: 0.4rem;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .circle {
      width: 16px;
      height: 16px;
      background-color: #a4a4a4;
      border-radius: 50%;
      /* 设置小球动画 */
      animation: loading 1.2s both infinite;
      position: absolute;
      // animation-play-state: paused;
    }
    /* 设置小球的相对位置 */
    .circle1 {
      top: 0;
      left: 0;
    }

    .circle2 {
      top: 0;
      right: 0;
    }

    .circle3 {
      bottom: 0;
      right: 0;
    }

    .circle4 {
      bottom: 0;
      left: 0;
    }
  }
  /* 设置延时 */
  .container1 .circle1 {
    animation-delay: 0s;
  }

  .container2 .circle1 {
    animation-delay: 0.2s;
  }

  .container1 .circle2 {
    animation-delay: 0.3s;
  }

  .container2 .circle2 {
    animation-delay: 0.4s;
  }

  .container1 .circle3 {
    animation-delay: 0.5s;
  }

  .container2 .circle3 {
    animation-delay: 0.6s;
  }

  .container1 .circle4 {
    animation-delay: 0.7s;
  }

  .container2 .circle4 {
    animation-delay: 0.8s;
  }
  .container2 {
    transform: translate(-50%, -50%) rotate(45deg);
  }
}
@keyframes loading {
  0% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
  80% {
    transform: scale(0);
  }

  100% {
    transform: scale(0);
  }
}
</style>
