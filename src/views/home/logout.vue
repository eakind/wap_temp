<template>
  <div class="logout" @click.stop="hideProcess">
    <div class="content">
      <div class="icon-box">
        <span class="iconfont icon-db10_useropen"></span>
      </div>
      <div class="name">{{ userName }}</div>
      <div class="logout-btn" @click="logout">
        退出登录
      </div>
    </div>
  </div>
</template>
<script>
import { get } from '@/server/http.js';
export default {
  data() {
    return {
    };
  },
  props: {
    userName: {
      type: String,
      default: ''
    }
  },
  created() {
  },
  methods: {
    hideProcess(e) {
      if (document.querySelector('.logout .content').contains(e.target)) {
        return;
      }
      this.$emit('hide');
    },
    async logout(){
      localStorage.removeItem('dcBIUserToken');
      // localStorage.clear();
      let res = await get('logout', {});
      if (res.code === 302 || res.code === 0) {
        let loginItem = localStorage.getItem('dcAUUserLoginForm');
        localStorage.clear();
        localStorage.setItem('dcAUUserLoginForm', loginItem);
        window.location = res.location;
      }
    }
  },
};
</script>
<style lang="scss" scoped>
.logout {
  position: fixed;
  top: 0.44rem;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  .content {
    width: 100%;
    height: 1.6rem;
    background: #424242;
    padding: 0.08rem 0.15rem;

    .icon-box {
      width: 0.64rem;
      height: 0.64rem;
      background: linear-gradient(180deg, #424242 0%, #424242 100%);
      filter: blur(2px);
      box-shadow: inset 0px -2px 4px 0px #000000;
      border-radius: 50%;
      margin: auto;
      .iconfont {
        display: inline-block;
        width: 100%;
        height: 100%;
        text-align: center;
      }
      .icon-db10_useropen:before {
        color: #66a6ff;
        font-size: 0.42rem;
        vertical-align: middle;
      }
    }
    .name {
      color: #ffffff;
      line-height: 0.25rem;
      text-align: center;
      margin-top: 0.08rem;
    }
    .logout-btn {
      line-height: 0.5rem;
      color: #ffffff;
      text-align: center;
      margin-top: 0.08rem;
      box-shadow: inset 0px 1px 0px 0px #ffffff;
    }
  }
}
</style>
