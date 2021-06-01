<template>
  <div class="tooltip-bar">
    <ul>
      <li class="flex" @click.stop="$emit('largeChart')">
        <div class="icon-large-box">
          <span class="iconfont icon-db_stretch"></span>
        </div>
        <div class="large-btn">放大画布</div>
      </li>
    </ul>
  </div>
</template>
<style lang="scss" scoped>
.tooltip-bar {
  position: absolute;
  width: 1rem;
  line-height: 0.36rem;
  top: 0.36rem;
  border-radius: 0.04rem;
  background: #f5f9fe;
  box-shadow: 0px 2px 4px 0px #ebebeb;
  left: -1.2rem;
  transform: translateX(50%);
  z-index: 6;
  .icon-large-box {
    width: 0.36rem;
    height: 0.36rem;
    display: inline-block;
    text-align: center;
  }
}
</style>
