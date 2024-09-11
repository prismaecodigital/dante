import { objectToFormData } from "object-to-formdata";

function initialState() {
  return {
    entry: {
      id: null,
      upcoming_service: '',
      customer: '',
      address: '',
      service: '',
      latest_service: '',
      status: '',
    },
    loading: false,
  };
}

const route = 'services';

const getters = {
  entry: state => state.entry,
  loading: state => state.loading,
};

const actions = {
  updateData({ commit, state, dispatch }) {
    commit('setLoading', true);
    dispatch('Alert/resetState', null, { root: true });

    return new Promise((resolve, reject) => {
      let params = objectToFormData(state.entry, {
        indices: true,
        booleansAsIntegers: true
      });
      params.set('_method', 'PUT');
        axios
        .post(`${route}/${state.entry.id}`, params)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          let message = error.response.data.message || error.message;
          let errors = error.response.data.errors;

        dispatch(
          'Alert/setAlert',
          { message: message, errors: errors, color: 'danger' },
          { root: true }
        );

        reject(error);
      })
      .finally(() => {
        commit('setLoading', false);
      });
    });
  },
  setUpcomingService({ commit }, value) {
    commit('setUpcomingService', value);
  },
  setCustomer({ commit }, value) {
    commit('setCustomer', value);
  },
  setAddress({ commit }, value) {
    commit('setAddress', value);
  },
  setService({ commit }, value) {
    commit('setService', value);
  },
  setLatestService({ commit }, value) {
    commit('setLatestService', value);
  },
  setStatus({ commit }, value) {
    commit('setStatus', value);
  },
  fetchEditData({ commit, dispatch }, id) {
    axios.get(`${route}/${id}/edit`).then(response => {
      commit('setEntry', response.data.data);
    });
  },
  resetState({ commit }) {
    commit('resetState');
  }
};

const mutations = {
  setEntry(state, entry) {
    state.entry = entry;
  },
  setUpcomingService(state, value) {
    state.entry.upcoming_service = value;
  },
  setCustomer(state, value) {
    state.entry.customer = value;
  },
  setAddress(state, value) {
    state.entry.address = value;
  },
  setService(state, value) {
    state.entry.service = value;
  },
  setLatestService(state, value) {
    state.entry.latest_service = value;
  },
  setStatus(state, value) {
    state.entry.status = value;
  },
  setLoading(state, loading) {
    state.loading = loading;
  },
  resetState(state) {
    state = Object.assign(state, initialState());
  },
};

export default {
  namespaced: true,
  state: initialState,
  getters,
  actions,
  mutations
};