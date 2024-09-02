function initialState() {
    return {
      entry: {
        id: null,
        code: '',
        date: '',
        date_front_end: '',
        customer: '',
        address: '',
        jenis_order: null,
        notes: '',
        complaint: '',
        photodata: [],
        photobefore: [],
        photoafter: [],
        upcoming: '',
        job: '',
        created_at: '',
        updated_at: '',
        deleted_at: '',
        items: [{
          jenis_pekerjaan : '',
          lokasi : '',
          qty : '',
          satuan : '',
          price : '',
          ket : '',
        }],
        datas: [{
          lokasi: '',
          ampere_sebelum: '',
          ampere_sesudah: '',
          voltase_sebelum: '',
          voltase_sesudah: '',
          refrigen_sebelum: '',
          refrigen_sesudah: ''
        }]
      },
      lists: {
        jenis_order: []
      },
      loading: false,
      jsonData: [{
      }],
      mergedData: [],
    }
  }
  
  const route = 'orders'
  
  const getters = {
    entry: state => state.entry,
    loading: state => state.loading,
    jsonData: state => state.jsonData,
    lists: state => state.lists,
    mergedData: state => state.mergedData,
  }
  
  const actions = {
    storeData({ commit, state, dispatch }) {
      commit('setLoading', true)
      dispatch('Alert/resetState', null, { root: true })
  
      return new Promise((resolve, reject) => {
        let params = objectToFormData(state.entry, {
          indices: true,
          booleansAsIntegers: true
        })
        axios
          .post(route, params)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            let message = error.response.data.message || error.message
            let errors = error.response.data.errors
  
            dispatch(
              'Alert/setAlert',
              { message: message, errors: errors, color: 'danger' },
              { root: true }
            )
  
            reject(error)
          })
          .finally(() => {
            commit('setLoading', false)
          })
      })
    },
    updateData({ commit, state, dispatch }) {
      commit('setLoading', true)
      dispatch('Alert/resetState', null, { root: true })
  
      return new Promise((resolve, reject) => {
        let params = objectToFormData(state.entry, {
          indices: true,
          booleansAsIntegers: true
        })
        params.set('_method', 'PUT')
        axios
          .post(`${route}/${state.entry.id}`, params)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            let message = error.response.data.message || error.message
            let errors = error.response.data.errors
  
            dispatch(
              'Alert/setAlert',
              { message: message, errors: errors, color: 'danger' },
              { root: true }
            )
  
            reject(error)
          })
          .finally(() => {
            commit('setLoading', false)
          })
      })
    },
    setCode({ commit }, value) {
      commit('setCode', value)
    },
    setDate({ commit }, value) {
      commit('setDate', value)
    },
    setCustomer({ commit }, value) {
      commit('setCustomer', value)
    },
    setAddress({ commit }, value) {
      commit('setAddress', value)
    },
    setComplaint({ commit }, value) {
      commit('setComplaint', value)
    },
    insertPhotodataFile({ commit }, file) {
      commit('insertPhotodataFile', file)
    },
    removePhotodataFile({ commit }, file) {
      commit('removePhotodataFile', file)
    },
    insertPhotobeforeFile({ commit }, file) {
      commit('insertPhotobeforeFile', file)
    },
    removePhotobeforeFile({ commit }, file) {
      commit('removePhotobeforeFile', file)
    },
    insertPhotoafterFile({ commit }, file) {
      commit('insertPhotoafterFile', file)
    },
    removePhotoafterFile({ commit }, file) {
      commit('removePhotoafterFile', file)
    },
    setUpcoming({ commit }, value) {
      commit('setUpcoming', value);
    },
    setJob({ commit }, value) {
      commit('setJob', value);
    },
    setCreatedAt({ commit }, value) {
      commit('setCreatedAt', value)
    },
    setUpdatedAt({ commit }, value) {
      commit('setUpdatedAt', value)
    },
    setDeletedAt({ commit }, value) {
      commit('setDeletedAt', value)
    },
    setJenisOrder({ commit }, value) {
      commit('setJenisOrder', value)
    },
    setNotes({ commit }, value) {
      commit('setNotes', value)
    },
    addItem({commit}) {
      commit('addItem')
    },
    exportData({commit}) {
      commit('exportData')
    },
    deleteItem({commit}, index) {
      commit('deleteItem', index)
    },
    addData({commit}) {
      commit('addData')
    },
    deleteData({commit}, index) {
      commit('deleteData', index)
    },
    setItems({commit}, value) {
      commit('setItems', value)
    },
    setItemJenisPekerjaan({ commit }, {index, val}) {
      commit('setItemJenisPekerjaan', {index, val})
    },
    setItemLokasi({ commit }, {index, val}) {
      commit('setItemLokasi', {index, val})
    },
    setItemSatuan({ commit }, {index, val}) {
      commit('setItemSatuan', {index, val})
    },
    setItemQty({ commit }, {index, val}) {
      commit('setItemQty', {index, val})
    },
    setItemPrice({ commit }, {index, val}) {
      commit('setItemPrice', {index, val})
    },
    setItemKet({ commit }, {index, val}) {
      commit('setItemKet', {index, val})
    },
    setDatas({ commit }, value) {
      commit('setDatas')
    },
    setDataLokasi({commit}, {index,val}) {
      commit('setDataLokasi', {index, val})
    },
    setDataAmpereSebelum({commit}, {index,val}) {
      commit('setDataAmpereSebelum', {index, val})
    },
    setDataAmpereSesudah({commit}, {index,val}) {
      commit('setDataAmpereSesudah', {index, val})
    },
    setDataVoltaseSebelum({commit}, {index,val}) {
      commit('setDataVoltaseSebelum', {index, val})
    },
    setDataVoltaseSesudah({commit}, {index,val}) {
      commit('setDataVoltaseSesudah', {index, val})
    },
    setDataRefrigenSebelum({commit}, {index,val}) {
      commit('setDataRefrigenSebelum', {index, val})
    },
    setDataRefrigenSesudah({commit}, {index,val}) {
      commit('setDataRefrigenSesudah', {index, val})
    },
    fetchCreateData({ commit }) {
      axios.get(`${route}/create`).then(response => {
        commit('setLists', response.data.meta)
      })
    },
    fetchEditData({ commit, dispatch }, id) {
      axios.get(`${route}/${id}/edit`).then(response => {
        commit('setEntry', response.data.data)
        commit('setLists', response.data.meta)
      })
    },
    fetchShowData({ commit, dispatch }, id) {
      axios.get(`${route}/${id}`).then(response => {
        commit('setEntry', response.data.data)
      })
    },
    resetState({ commit }) {
      commit('resetState')
    }
  }
  
  const mutations = {
    setEntry(state, entry) {
      state.entry = entry
    },
    // setDate(state, value) {
    //   state.entry.date = moment(value).format('DD-MM-YYYY')
    //   state.entry.date_front_end = value
    // },
    setDate(state, value) {
      state.entry.date = value
    },
    setCode(state, value) {
      state.entry.code = value
    },
    setCustomer(state, value) {
      state.entry.customer = value
    },
    setAddress(state, value) {
      state.entry.address = value
    },
    setComplaint(state, value) {
      state.entry.complaint = value
    },
    insertPhotodataFile(state, file) {
      console.log(file.uuid)
      state.entry.photodata.push(file)
    },
    removePhotodataFile(state, file) {
      state.entry.photodata = state.entry.photodata.filter(item => {
        return item.file_name !== file.file_name
      })
    },
    insertPhotobeforeFile(state, file) {
      state.entry.photobefore.push(file)
    },
    removePhotobeforeFile(state, file) {
      state.entry.photobefore = state.entry.photobefore.filter(item => {
        return item.id !== file.id
      })
    },
    insertPhotoafterFile(state, file) {
      state.entry.photoafter.push(file)
    },
    removePhotoafterFile(state, file) {
      state.entry.photoafter = state.entry.photoafter.filter(item => {
        return item.id !== file.id
      })
    },
    setUpcoming(state, value) {
      state.entry.upcoming = value
    },
    setJob(state, value) {
      state.entry.job = value
    },
    setCreatedAt(state, value) {
      state.entry.created_at = value
    },
    setUpdatedAt(state, value) {
      state.entry.updated_at = value
    },
    setDeletedAt(state, value) {
      state.entry.deleted_at = value
    },
    setJenisOrder(state, value) {
      state.entry.jenis_order = value
    },
    setNotes(state, value) {
      state.entry.notes = value
    },
    setLists(state, lists) {
      state.lists = lists
    },
    addItem(state) {
      state.entry.items.push({
        jenis_pekerjaan : '',
        lokasi : '',
        qty : '',
        satuan : '',
        price : '',
        ket : '',
      });
    },
    deleteItem(state, index) {
      state.entry.items.splice(index, 1)
    },
    addData(state) {
      state.entry.datas.push({
        ampere_sebelum: '',
        ampere_sesudah: '',
        voltase_sebelum: '',
        voltase_sesudah: '',
        refrigen_sebelum: '',
        refrigen_sesudah: ''
      });
    },
    deleteData(state, index) {
      state.entry.datas.splice(index, 1)
    },
    setItems(state, value) {
      state.entry.items = value
    },
    setItemJenisPekerjaan(state, {index,val}) {
      state.entry.items[index].jenis_pekerjaan = val
    },
    setItemLokasi(state, {index,val}) {
      state.entry.items[index].lokasi = val
    },
    setItemSatuan(state, {index,val}) {
      state.entry.items[index].satuan = val
    },
    setItemQty(state, {index,val}) {
      state.entry.items[index].qty = val
    },
    setItemPrice(state, {index,val}) {
      state.entry.items[index].price = val
    },
    setItemKet(state, {index,val}) {
      state.entry.items[index].ket = val
    },
    setDatas(state, value) {
      state.entry.datas = value
    },
    setDataLokasi(state, {index, val}) {
      state.entry.datas[index].lokasi = val
    },
    setDataAmpereSebelum(state, {index, val}) {
      state.entry.datas[index].ampere_sebelum = val
    },
    setDataAmpereSesudah(state, {index, val}) {
      state.entry.datas[index].ampere_sesudah = val
    },
    setDataVoltaseSebelum(state, {index, val}) {
      state.entry.datas[index].voltase_sebelum = val
    },
    setDataVoltaseSesudah(state, {index, val}) {
      state.entry.datas[index].voltase_sesudah = val
    },
    setDataRefrigenSebelum(state, {index, val}) {
      state.entry.datas[index].refrigen_sebelum = val
    },
    setDataRefrigenSesudah(state, {index, val}) {
      state.entry.datas[index].refrigen_sesudah = val
    },
    setLoading(state, loading) {
      state.loading = loading
    },
    resetState(state) {
      state = Object.assign(state, initialState())
    },
  }
  
  export default {
    namespaced: true,
    state: initialState,
    getters,
    actions,
    mutations
  }