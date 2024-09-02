const set = key => (state, val) => {
  state[key] = val;
}

function initialState() {
  return {
    data: [],
    total: 0,
    query: {},
    loading: false,
  }
}

const route = 'services';

const getters = {
  data: state => state.data,
  total: state => state.total,
  loading: state => state.loading
}

const actions = {
  fetchIndexData({ commit, state }) {
    commit('setLoading', true);

    axios
      .get(route, { params: state.query })
      .then(response => {
        console.log(response);
        // commit('setData', response.data.data)
        // commit('setTotal', response.data.total)
      })
      .catch(error => {
        message = error.response.data.message || error.message
      })
      .finally(() => {
        commit('setLoading', false)
      })
  },
  destroyData({ commit, state, dispatch }, id) {
    axios
      .delete(route +'/'+id)
      .then(response => {
        dispatch('fetchIndexData')
      })
      .catch(error => {
        message = error.response.data.message || error.message
      })
  },
  setQuery({ commit }, value) {
    commit('setQuery', _.cloneDeep(value))
  },
  resetState({ commit }) {
    commit('resetState')
  }
}

const mutations = {
  setData: set('data'),
  setTotal: set('total'),
  setQuery(state, query) {
    (query.offset + query.limit) / query.limit,
    state.query = query
  },
  setLoading: set('loading'),
  resetState(state) {
    Object.assign(state, initialState())
  }
}

export default {
  namespaced: true,
  state: initialState,
  getters,
  actions,
  mutations
}