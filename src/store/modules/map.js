const state = {
  loadMap: false,
  polygonList: [],
  polylineList: [],
  markerList: []
}

const mutations = {
  LOAD_MAP_VIEW: (state, view) => {
    state.loadMap = view
  },
  SET_MARK_LIST: (state, view) => {
    state.markerList = view
  },
  SET_POLYGON_LIST: (state, view) => {
    state.polygonList = view
  },
  SET_POLYLINE_LIST: (state, view) => {
    state.polylineList = view
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
  setPolylineList({ commit }, view) {
    commit('SET_POLYLINE_LIST', view)
  },
  setPolygonList({ commit }, view) {
    commit('SET_POLYGON_LIST', view)
  },
  setMarkerList({ commit }, view) {
    commit('SET_MARK_LIST', view)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
