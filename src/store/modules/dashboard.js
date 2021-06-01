import { get } from '@/server/http.js';
export default {
  namespaced: true,
  state: {
    projectId: '',
    dashboardList: [],
    curDashboardObj: {},
    worksheetTypes: {
      // chart types
      '02': 'bar',
      '01': 'table',
      '03': 'bar-rotated',
      '04': 'bar-line',
      '05': 'line',
      '06': 'pie',
      '07': 'bubble',
      '08': 'map',
      '09': 'scatter',
      10: 'area',
      11: 'funnel',
    },
    actionList: [],
    featureList:[],
    dashboardCss: {},
    authorityCode: null,
    validAction: {}
  },
  mutations: {
    setValidAction(state, object) {
      state.validAction = object;
    },
    setProjectId(state, id) {
      state.projectId = id;
    },
    setDashboardList(state, list) {
      state.dashboardList = list;
    },
    setCuDashboardObj(state, obj) {
      state.curDashboardObj = obj;
    },
    setActionList(state, list) {
      state.actionList = list;
    },
    setFeatureList(state,list){
      state.featureList=list;
    },
    setDashboardCss(state,obj){
      state.dashboardCss=obj;
    },
    setAuthorityCode (state, str) {
      state.authorityCode = str;
    }
  },
  actions: {
    async fetchDashboardList({ commit, state }) {
      let params = {
        project_id: state.projectId,
        offset: 0,
        limit: 500,
      };
      let res = await get('dashboardList', params);
      if (res && res.code === 0) {
        commit('setDashboardList', res.dashboard_list);
        if (res.dashboard_list.length > 0) {
          commit('setCuDashboardObj', res.dashboard_list[0]);
        }
      }
    },
    async fetchActionList({ commit, state }) {
      let params = {
        project_id: state.projectId,
        dashboard_id: state.curDashboardObj.dashboard_id,
        offset: 0,
        limit: 500,
      };
      let res = await get('actionList', params);
      if (res && res.code === 0) {
        commit('setActionList', res.action_lst || []);
      }
    },

    async fetchFeatureList({ commit, state }) {
      let catParams = {
        project_id: state.projectId,
        feature_type: 'CAT',
        offset: 0,
        limit: 1000,
      };

      let catRes = await get('featureList', catParams);
      if (catRes && catRes.code === 0 ) {
        commit('setFeatureList', catRes.feature_list || []);
      }
    },
  },
};
