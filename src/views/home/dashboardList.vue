<template>
  <transition class="fade">
    <div class="dashboard-list-wrap" @click.stop="hideListProcess">
      <div class="dashboard-list-box">
        <ul class="dashboard-list-item-box">
          <li
            v-for="(i, index) in list"
            :key="index"
            class="flex"
            @click="chooseDashboard(i)"
          >
            <div class="icon-circle-box">
              <span
                class="icon-circle"
                :class="i.dashboard_id === activeId ? 'active' : ''"
              ></span>
            </div>
            <div class="title-box">
              {{ i.dashboard_title }}
              <!-- <div class="title">{{ i.dashboard_title }}</div>
              <div class="type">{{ i.type ? 'PC' : '移动端' }}</div> -->
            </div>
          </li>
        </ul>
        <div class="collpase-btn" @click="hideList">
          收起列表
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import { mapState, mapMutations } from 'vuex';

export default {
  computed: {
    ...mapState('dashboard', ['dashboardList', 'curDashboardObj']),
    list() {
      return this.dashboardList || [];
    },
    activeId() {
      return this.curDashboardObj.dashboard_id;
    },
  },
  methods: {
    ...mapMutations('dashboard', ['setCuDashboardObj']),
    chooseDashboard(i) {
      this.setCuDashboardObj(i);
      this.hideList();
    },
    hideList() {
      this.$emit('hide');
    },
    hideListProcess(e) {
      if (document.querySelector('.dashboard-list-box').contains(e.target)) {
        return;
      }
      this.hideList();
    },
  },
};
</script>
<style lang="scss" scoped>
.dashboard-list-wrap {
  position: absolute;
  top: 0.8rem;
  left: 0;
  right: 0;
  width: 100%;
  height: calc(100% - 0.8rem);
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 6;
  .dashboard-list-box {
    // height: 75%;
    width: 100%;
    // -webkit-overflow-scrolling: touch;
    // overscroll-behavior: contain;
    background-color: #fff;
    ul {
      max-height: calc(100% - .4rem);
      max-height: 60vh;
      overflow: auto;
      list-style: none;
      padding: 0 0.1rem;
      li {
        border-bottom: 1px solid #dedede;
        padding: 0.08rem;
        .icon-circle-box {
          width: 0.3rem;
          height: 0.3rem;
          line-height: 0.3rem;
          .icon-circle {
            display: inline-block;
            width: 0.08rem;
            height: 0.08rem;
            border-radius: 50%;
            background-color: #cccccc;
          }
          .icon-circle.active {
            background-color: #4dd865;
          }
        }
        .title-box {
          // border-bottom: 1px solid #dedede;
          flex: 1;
          line-height: 0.36rem;
          @include ellipsis;
          .type {
            line-height: 1;
            color: #888888;
            font-size: 0.12rem;
            margin-bottom: 0.06rem;
          }
          .title {
            @include ellipsis;
          }
        }
      }
    }
    .collpase-btn {
      display: flex;
      align-items: center;
      line-height: .4rem;
      background-color: #fbfcff;
      text-align: center;
      height: 10%;
      justify-content: center;
      color: #4284f5;
    }
  }
}
</style>
