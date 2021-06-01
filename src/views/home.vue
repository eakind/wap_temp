<template>
  <!--  @touchstart="touchStart($event)"
    @touchmove="touchMove($event)"
    @touchend="touchEnd($event)" -->
  <div class="home-container" :style="dashboardStyle">
    <bg-color></bg-color>
    <div class="down-tips" v-if="scrollObj.state === 2" :style="tipsStyle">
      {{ scrollObj.tips }}
    </div>
    <div class="home-content">
      <div
        class="head-box flex"
        @click.stop="logoutShowProcess"
        :class="[showLogout ? 'show-logout' : '', chartZoomClass]"
      >
        <img src="../assets/logo-bi.png" class="icon-logo" />
        <div class="title" :style="setFontColor">{{ projectName }}</div>
      </div>
      <div class="list-entry flex" @click.stop="showDashboardList" :class="[chartZoomClass]">
        <span class="iconfont icon-db_menuBurger" :style="setFontColor"></span>
        <div class="sub-title" :style="[setFontColor]">{{ curDashboardObj.dashboard_title }}</div>
      </div>
      <dashboard
        :layout-list="mobileLayout"
        :dashboard-id="cssObj.dashboard_id"
        :bg-color="dashboardStyle.background"
        :request-flag="requestFlag"
        @chartZoom="chartZoomHandle"
      ></dashboard>
    </div>
    <dashboard-list
      id="dashboardList"
      v-if="showListFlag"
      @hide="hide"
      :top="top"
    ></dashboard-list>
    <logout v-if="showLogout" :userName="userName" @hide="logoutHide"></logout>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import { get } from '@/server/http.js';
import { retStyleObj } from '@/utils/index';

import dashboard from './dashboard.vue';
import dashboardList from './home/dashboardList.vue';
import logout from './home/logout.vue';
import bgColor from '@/components/bgColor/bgColor.vue';
export default {
  components: {
    dashboard,
    dashboardList,
    logout,
    bgColor
    // scroll,
  },
  data() {
    return {
      offset: 0,
      limit: 500,
      projectName: '',
      showListFlag: false,
      showLogout: false,
      cssObj: {},
      // layoutList: [],
      mobileLayout: [],
      dashboardStyle: {},
      scrollObj: {
        startY: 0,
        touch: false,
        state: 0,
        top: 0,
        tips: '下拉刷新,请稍后...',
        paddingTop: 0,
      },
      timer: null,
      requestFlag: true,
      top: '',
      userName: '',
      chartZoomClass: ''
      // dashboardTitleStyle:{}
    };
  },
  computed: {
    ...mapState('dashboard', ['projectId', 'dashboardList', 'curDashboardObj', 'dashboardCss']),
    tipsStyle() {
      return {
        height: this.scrollObj.top / 100 + 'rem',
        paddingTop: this.scrollObj.paddingTop / 100 + 'rem',
        // lineHeight: this.scrollObj.top / 100 + 'rem',
      };
    },
    setFontColor () {
      let bgColor = this.dashboardCss.bgColor;
      if (!bgColor) return {};
      let background = bgColor.background;
      if (!background || !background.color) return {};
      return {
        color: `${background.color}!important`
      };
    }
  },
  watch: {
    'curDashboardObj.dashboard_id': {
      handler(val) {
        if (val) {
          this.getWorksheetList(val);
          this.fetchActionList();
        }
      },
      immediate: true,
      deep: true
    },
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      let curLocation = window.location.href;
      let projectId = '';
      if (curLocation.indexOf('aiManager') >=0) {
        projectId = curLocation.split('aiManager=')[1];
        localStorage.setItem('projectId', projectId);
        vm.setProjectId(projectId);
      }
    });
  },
  mounted() {
    window.addEventListener('orientationchange', this.orientationProcess);
    this.getProjectName();
    this.fetchDashboardList(); // dashboard_title
    this.fetchFeatureList();
    this.getUserInfo();
  },
  methods: {
    ...mapMutations('dashboard', ['setDashboardCss', 'setAuthorityCode', 'setProjectId']),
    ...mapActions('dashboard', [
      'fetchDashboardList',
      'fetchActionList',
      'fetchFeatureList',
    ]),
    flattenList(list) {
      list = list || [];
      for (let i = 0; i < list.length; i++) {
        if (list[i].type && list[i].type !== 'filter') {
          let obj = JSON.parse(JSON.stringify(list[i]));
          this.mobileLayout.push(obj);
        }
        if (list[i].children.length > 0) {
          this.flattenList(list[i].children);
        }
      }
    },
    scrollDefault(e) {
      if (document.querySelector('.dashboard-list-item-box').contains(e.target)) {
        return;
      }
      e.preventDefault();
    },
    logoutShowProcess() {
      this.showLogout = true;
      this.showListFlag = false;
      document.body.style.overflow = 'hidden';
      document.addEventListener('touchmove', this.scrollDefault, {
        passive: false,
      });
    },
    logoutHide() {
      this.showLogout = false;
      document.body.style.overflow = '';
      document.removeEventListener('touchmove', this.scrollDefault, {
        passive: false,
      });
    },
    hide() {
      this.showListFlag = false;
      document.body.style.overflow = '';
      document.removeEventListener('touchmove', this.scrollDefault, {
        passive: false,
      });
    },
    showDashboardList() {
      let appDom = document.body;
      this.showListFlag = !this.showListFlag;
      appDom.style.overflow = this.showListFlag ? 'hidden' : '';

      document.addEventListener('touchmove', this.scrollDefault, {
        passive: false,
      });
    },
    async getProjectName() {
      let res = await get('projectDetail', {
        project_id: this.projectId,
      });
      if (res && res.code === 0) {
        this.projectName = res.project_name;
      }
    },
    async getUserInfo () {
      let params = {};
      let res = await get('userInfo', params);
      if (res.code === 0) {
        this.userName = res.user_name;
      }
    },
    async getWorksheetList(id) {
      let params = {
        project_id: this.projectId,
        dashboard_id: id,
      };
      let res = await get('dashboardDetail', params);
      if (res && res.code === 0) {
        this.cssObj = res.css;
        let {
          dashboard: { bgColor = null, border = null, padding = null },

          // title: { bgColor: titleBgColor=null ,  border:titleBorder = null,colorStyle=null,fontSize,fontStyle,padding:titlePadding }
        } = this.cssObj;
        this.setDashboardCss(this.cssObj.dashboard);
        // this.dashboardTitleStyle= retStyleObj({ bgColor:titleBgColor, border:titleBorder, padding:titlePadding, fontSize,fontStyle,fontColor:colorStyle});
        this.dashboardStyle = retStyleObj({ bgColor, border, padding });
        this.mobileLayout = [];
        setTimeout(() => {
          this.flattenList(this.cssObj.layoutList);
        }, 0);  
      }
    },
    touchStart(e) {
      this.scrollObj.startY = e.touches[0].pageY;
      if (this.scrollObj.state === 3 || this.scrollObj.state === 0) {
        this.scrollObj.state = 1;
        this.scrollObj.touch = true;
      }
    },
    touchMove(e) {
      if (!this.scrollObj.touch) return; // 获取移动的距离
      var diff = e.targetTouches[0].pageY - this.scrollObj.startY; //判断是向上拉还是向下拉

      if (diff > 0 && document.body.scrollTop === 0) {
        // e.preventDefault && e.preventDefault();
      } else {
        return;
      }

      let top = diff * 0.25;
      if (top >= 40) {
        this.scrollObj.state = 2; //释放刷新
        this.scrollObj.top = top > 100 ? 100 : top;
        this.scrollObj.paddingTop = 20;
      } else {
        this.scrollObj.state = 1; // 开始滑动
      }
    },
    touchEnd() {
      this.scrollObj.touch = false;
      if (this.scrollObj.state === 4) {
        return;
      }
      if (
        this.scrollObj.top >= 40 &&
        document.body.scrollTop === 0 &&
        this.scrollObj.state === 2
      ) {
        if (this.timer) {
          return;
        }
        this.timer = setTimeout(() => {
          this.refresh();
          clearTimeout(this.timer);
          this.timer = null;
        }, 1000);
      } else {
        this.scrollObj.state = 0;
        this.scrollObj.top = 0;
      }
    },
    refresh() {
      this.$showLoading();
      this.getWorksheetList(this.curDashboardObj.dashboard_id);
      this.scrollObj.state = 3;
    },

    orientationProcess() {
      this.requestFlag = false;
      this.$showLoading();
      this.mobileLayout.forEach((i, idx) => {
        this.$set(this.mobileLayout[idx], 'flag', !this.mobileLayout[idx].flag);
      });
      this.requestFlag = true;
    },

    chartZoomHandle (val) {
      if (val === 'large') {
        this.chartZoomClass = 'hide-title';
      } else {
        this.chartZoomClass = '';
      }
    }
  },
};
</script>
<style lang="scss" scoped>
.home-container {
  width: 100%;
  height: 100%;
  position: relative;
  .home-content {
    height: 100%;
    width: 100%;
    overflow: hidden;
    position: absolute;
  }
  .flex {
    display: flex;
    align-items: center;
  }
  .head-box {
    height: 0.44rem;
    padding: 0.16rem;
    box-shadow: 0px 2px 4px 0px #424242;
    .icon-logo {
      width: 0.4rem;
      height: 0.4rem;
    }
    .title {
      font-size: 0.16rem;
    }
  }
  .head-box.show-logout {
    background: #424242;
    box-shadow: 0px 2px 4px 0px #424242;
    .title {
      color: #fff;
    }
  }
  .list-entry {
    height: 0.36rem;
    padding: 0.16rem;
    // border-bottom: 1px solid #dedede;
    .iconfont {
      display: block;
      width: 0.36rem;
      height: 0.36rem;
      color: #a4a4a4;
      text-align: center;
      line-height: 0.36rem;
    }
    .sub-title {
      flex: 1;
      font-size: 0.14rem;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
  /* 刷新 */

  .down-tips {
    width: 100%;
    // height: 0.64rem;
    text-align: center;
    // line-height: 0.64rem;
    background: #e7eaf0;
    color: #a4a4a4;
    transition: height 500ms;
  }

  .hide-title {
    display: none;
  }
}
</style>
