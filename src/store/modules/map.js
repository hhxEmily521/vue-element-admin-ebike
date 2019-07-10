const state = {
  loadMap: false,
  polygonList: []
}

const mutations = {
  LOAD_MAP_VIEW: (state, view) => {
    state.loadMap = view
  },
  SET_POLYGON_LIST: (state, view) => {
    state.polygonList = view
  },
  UPDATE_VISITED_VIEW: (state, view) => {
    for (let v of state.visitedViews) {
      if (v.path === view.path) {
        v = Object.assign(v, view)
        break
      }
    }
  }
}

const actions = {
  updateVisitedView({ commit }, view) {
    commit('UPDATE_VISITED_VIEW', view)
  },
  setPolygonList({ commit }, view) {
    commit('SET_POLYGON_LIST', view)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
