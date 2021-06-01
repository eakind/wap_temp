<template>
  <div class="authority">
    <div class="authority-bg">
      <img src="@/assets/login_mobile.png" width="100%" height="100%" alt="">
    </div>
    <div class="m-box">
      <div class="logo-box">
        <div class="left">
          <img src="@/assets/logo_m.png" alt="" width="100%" height="100%">
        </div>
        <div class="right">{{title}}</div>
      </div>
      <div class="tip-box">
        <div v-for="(item, idx) in tipList" :key="idx">
          {{tipList[idx]}}
        </div>
        <div class="retrun-btn" @click="returnHandler">退出登录</div>
      </div>
    </div>
    <div class="m_botom">
      <div>© 2021 Datacube Research Center Limited. </div>
      <div>All Rights Reserved</div>
    </div>
  </div>
</template>
<script>
import { get } from '@/server/http.js';
export default {
  data () {
    return {
      title: '数立方统一登录平台',
       tipList: ['暂无权限浏览此项目。', '请联系项目管理员授权', '如有疑问，请咨询：', 'TechSupport@datacube.hk']
    };
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      let curLocation = window.location.href;
      if (curLocation.indexOf('code') >=0 ) {
        let code = curLocation.split('code=')[1];
        console.log(code);
        if (Number(code) === 10203 || Number(code) === 10402) {
          vm.tipList = ['暂无权限浏览此项目。', '请联系项目管理员授权', '如有疑问，请咨询：', 'TechSupport@datacube.hk'];
        } else if (Number(code) === 10401) {
          vm.tipList = ['项目不存在。', '无法查询到您请求的项目，请退出登录后重新尝试或返回项目列表。', '如有疑问，请咨询：', 'TechSupport@datacube.hk'];
        }
      }
    });
  },
  methods: {
    async returnHandler () {
      localStorage.removeItem('dcBIUserToken');
      let res = await get('logout', {});
      if (res.code === 302 || res.code === 0) {
        localStorage.clear();
        window.location = res.location;
      }
      // window.location.href = '/dist-dcee/#/?aiManager=' + localStorage.getItem('projectId');
    }
  }
};
</script>
<style lang='scss' scoped>
.authority {
  height: 100%;
  width: 100%;
  font-size: 14px;
  color: #fff;
  .login-bg {
    height: 100%;
    width: 100%;
    z-index: -1;
    position: absolute;
  }
  .m-box {
    height: calc(100% - 100px);
    width: 100%;
    z-index: 1;
    overflow-y: auto;
    position: absolute;
    top: 0;
    left: 0;
    .logo-box {
      display: flex;
      align-items: center;
      margin-left: r(30);
      margin-top: r(82);
      .left {
        width: r(130);
        height: r(50);
      }
      .right {
        margin-left: 24px;
        font-size: r(16);
      }
    }
    .tip-box {
      margin-left: r(30);
      margin-right: r(30);
      font-size: r(16);
      >div:nth-child(1) {
        margin-top: r(24);
      }
      >div:nth-child(2) {
        margin-top: r(24);
      }
      >div:nth-child(3) {
        margin-top: r(40);
        font-size: r(14);
      }
      >div:nth-child(4) {
        margin-top: r(10);
      }
      .retrun-btn {
        margin-top: r(48);
        width: 100%;
        text-align: center;
        height: r(48);
        line-height: r(48);
        background: #4284F5;
        border-radius: r(4);
        cursor: pointer;
      }
    }
    .m-form {
      margin: r(20) r(28) 0;
    }
  }
  .m_botom {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: r(84);
    background: rgba($color: #424242, $alpha: 0.5);
    text-align: center;
    font-size: r(12);
    >div:first-child {
      margin-top: r(12);
    }
  }
}
</style>
