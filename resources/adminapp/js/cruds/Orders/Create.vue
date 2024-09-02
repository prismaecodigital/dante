<template>
  <div class="container-fluid">
    <form @submit.prevent="submitForm">
      <div class="row">
        <div class="col-md-12">
          <div class="card">
            <div class="card-header card-header-primary card-header-icon">
              <div class="card-icon">
                <i class="material-icons">add</i>
              </div>
              <h4 class="card-title">
                {{ $t('global.create') }}
                <strong>{{ $t('cruds.order.title') }}</strong>
              </h4>
            </div>
            <div class="card-body">
              <back-button></back-button>
            </div>
            <div class="card-body">
              <bootstrap-alert />
              <div class="row">
                <div class="col-md-6">
                  <div
                    class="form-group bmd-form-group"
                    :class="{
                      'is-filled': entry.date,
                      'is-focused': activeField == 'date'
                    }"
                  >
                    <label class="bmd-label-floating required">{{
                      $t('cruds.order.fields.date')
                    }}</label>
                    <datetime-picker
                      class="form-control"
                      type="text"
                      picker="date"
                      :value="entry.date"
                      @input="updateDate"
                      @focus="focusField('date')"
                      @blur="clearFocus"
                      required
                    >
                    </datetime-picker>
                  </div>
                  <div
                    class="form-group bmd-form-group"
                    :class="{
                      'is-filled': entry.jenis_order,
                      'is-focused': activeField == 'jenis_order'
                    }"
                  >
                    <label class="">{{
                      $t('cruds.order.fields.jenis_order')
                    }}</label>
                    <v-select
                      name="jenis_order"
                      :key="'jenis_order-field'"
                      :value="entry.jenis_order"
                      :options="lists.jenis_order"
                      :reduce="entry => entry.value"
                      @input="updateJenisOrder"
                      @search.focus="focusField('jenis_order')"
                      @search.blur="clearFocus"
                    />
                  </div>
                  <div
                    class="form-group bmd-form-group"
                    :class="{
                      'is-filled': entry.customer,
                      'is-focused': activeField == 'customer'
                    }"
                  >
                    <label class="bmd-label-floating">{{
                      $t('cruds.order.fields.customer')
                    }}</label>
                    <input
                      class="form-control"
                      type="text"
                      :value="entry.customer"
                      @input="updateCustomer"
                      @focus="focusField('customer')"
                      @blur="clearFocus"
                    />
                  </div>

                  <div v-if="entry.jenis_order === '02'" id="photodata" class="form-group">
                    <label>{{ $t('cruds.order.fields.photodata') }}</label>
                    <attachment
                      :route="getRoute('orders')"
                      :collection-name="'order_photodata'"
                      :media="entry.photodata"
                      :max-file-size="5"
                      :component="'pictures'"
                      :accept="'image/*'"
                      @file-uploaded="insertPhotodataFile"
                      @file-removed="removePhotodataFile"
                    />
                  </div>
                  <div v-if="entry.jenis_order === '01'" id="photobefore" class="form-group">
                    <label>{{ $t('cruds.order.fields.photobefore') }}</label>
                    <attachment
                      :route="getRoute('orders')"
                      :collection-name="'order_photobefore'"
                      :media="entry.photobefore"
                      :max-file-size="5"
                      :component="'pictures'"
                      :accept="'image/*'"
                      @file-uploaded="insertPhotobeforeFile"
                      @file-removed="removePhotobeforeFile"
                    />
                  </div>
                  <div v-if="entry.jenis_order === '01'" id="photoafter" class="form-group">
                    <label>{{ $t('cruds.order.fields.photoafter') }}</label>
                    <attachment
                      :route="getRoute('orders')"
                      :collection-name="'order_photoafter'"
                      :media="entry.photoafter"
                      :max-file-size="5"
                      :component="'pictures'"
                      :accept="'image/*'"
                      @file-uploaded="insertPhotoafterFile"
                      @file-removed="removePhotoafterFile"
                    />
                  </div>
                </div>
                <div class="col-md-6">
                  <div
                    class="form-group bmd-form-group"
                    :class="{
                      'is-filled': entry.address,
                      'is-focused': activeField == 'address'
                    }"
                  >
                    <label class="bmd-label-floating">{{
                      $t('cruds.order.fields.address')
                    }}</label>
                    <input
                      class="form-control"
                      type="text"
                      :value="entry.address"
                      @input="updateAddress"
                      @focus="focusField('address')"
                      @blur="clearFocus"
                    />
                  </div>
                  <div
                    class="form-group bmd-form-group"
                    :class="{
                      'is-filled': entry.complaint,
                      'is-focused': activeField == 'complaint'
                    }"
                  >
                    <label class="">{{
                      $t('cruds.order.fields.complaint')
                    }}</label>
                    <input
                      class="form-control"
                      type="text"
                      :value="entry.complaint"
                      @input="updateComplaint"
                      @focus="focusField('complaint')"
                      @blur="clearFocus"
                    />
                  </div>
                  <div
                    class="form-group bmd-form-group"
                    :class="{
                      'is-filled': entry.notes,
                      'is-focused': activeField == 'notes'
                    }"
                  >
                    <label class="bmd-label-floating">{{
                      $t('cruds.order.fields.notes')
                    }}</label>
                    <input
                      class="form-control"
                      type="text"
                      :value="entry.notes"
                      @input="updateNotes"
                      @focus="focusField('notes')"
                      @blur="clearFocus"
                    />
                  </div>                  
                </div>
              </div>
            </div>
            <div class="card-header card-header-primary card-header-icon">
              <h4 class="card-title">
                <strong>Item</strong>
              </h4>
            </div>
            <br>
            <div class="card-body">
              <bootstrap-alert />
              <table class="table table-bordered" name="inputItem">
                <thead>
                  <th></th>
                  <th>Jenis Pekerjaan</th>
                  <th>Lokasi</th>
                  <th>Qty</th>
                  <th>Satuan</th>
                  <th>Harga</th>
                  <th>Ket</th>
                </thead>
                <tbody>
                  <tr v-for="(item, k) in entry.items" :key="k">
                    <td scope="row" class="trashIconContainer">
                        <i class="fa fa-trash-o" @click="deleteRow(k, item)"></i>
                    </td>
                    <td>
                        <input class="form-control wrapText" type="text" :value="item.jenis_pekerjaan" @input="updateItemJenisPekerjaan(k, $event)"/>
                    </td>
                    <td>
                        <input class="form-control wrapText" type="text" :value="item.lokasi" @input="updateItemLokasi(k, $event)"/>
                    </td>
                    <td>
                        <input class="form-control wrapText" type="number" :value="item.qty" @input="updateItemQty(k, $event)"/>
                    </td>
                    <td>
                        <input class="form-control wrapText" type="text" :value="item.satuan" @input="updateItemSatuan(k, $event)"/>
                    </td>
                    <td>
                        <input class="form-control wrapText" type="number" :value="item.price" @input="updateItemPrice(k, $event)"/>
                    </td>
                    <td>
                        <input class="form-control wrapText" type="text" :value="item.ket" @input="updateItemKet(k, $event)"/>
                    </td>
                  </tr>
                </tbody>
              </table>
              <button type='button' class="btn btn-info" @click="addNewRow">
                  <i class="fa fa-plus-circle"></i>
                  Add Item
              </button>
            </div>
            <div v-if="entry.jenis_order === '01'" id="data-header" class="card-header card-header-primary card-header-icon">
              <h4 class="card-title">
                <strong>Data AC Before After</strong>
              </h4>
            </div>
            <br>
            <div v-if="entry.jenis_order === '01'" id="data-body" class="card-body">
              <bootstrap-alert />
              <table class="table table-bordered" name="inputItem">
                <thead>
                  <th></th>
                  <th>Lokasi</th>
                  <th>Ampere Sebelum</th>
                  <th>Ampere Sesudah</th>
                  <th>Voltase Sebelum</th>
                  <th>Voltase Susudah</th>
                  <th>Refrigen Sebelum</th>
                  <th>Refrigen Sesudah</th>
                </thead>
                <tbody>
                  <tr v-for="(dataAc, k) in entry.datas" :key="k">
                    <td scope="row" class="trashIconContainer">
                        <i class="fa fa-trash-o" @click="deleteRowData(k, dataAc)"></i>
                    </td>
                    <td>
                        <input class="form-control wrapText" type="text" :value="dataAc.lokasi" @input="updateDataLokasi(k, $event)" />
                    </td>
                    <td>
                        <input class="form-control wrapText" type="text" :value="dataAc.ampere_sebelum" @input="updateDataAmpereSebelum(k, $event)" />
                    </td>
                    <td>
                        <input class="form-control wrapText" type="text" :value="dataAc.ampere_sesudah" @input="updateDataAmpereSesudah(k, $event)" />
                    </td>
                    <td>
                        <input class="form-control wrapText" type="text" :value="dataAc.voltase_sebelum" @input="updateDataVoltaseSebelum(k, $event)" />
                    </td>
                    <td>
                        <input class="form-control wrapText" type="text" :value="dataAc.voltase_sesudah" @input="updateDataVoltaseSesudah(k, $event)" />
                    </td>
                    <td>
                        <input class="form-control wrapText" type="text" :value="dataAc.refrigen_sebelum" @input="updateDataRefrigenSebelum(k, $event)"/>
                    </td>
                    <td>
                        <input class="form-control wrapText" type="text" :value="dataAc.refrigen_sesudah" @input="updateDataRefrigenSesudah(k, $event)"/>
                    </td>
                  </tr>
                </tbody>
              </table>
              <button type='button' class="btn btn-info" @click="addRowData">
                  <i class="fa fa-plus-circle"></i>
                  Add Item
              </button>
              <div class="row mt-3">
                <div class="col-md-6">
                  <div
                    class="form-group bmd-form-group"
                    :class="{
                      'is-filled': entry.upcoming,
                      'is-focused': activeField == 'upcoming'
                    }"
                  >
                    <label class="bmd-label-floating required">{{
                      $t('cruds.order.fields.upcoming')
                    }}</label>
                    <datetime-picker
                      class="form-control"
                      type="text"
                      picker="date"
                      :value="entry.upcoming"
                      @input="updateUpcoming"
                      @focus="focusField('upcoming')"
                      @blur="clearFocus"
                      required
                    >
                    </datetime-picker>
                  </div>
                </div>
                <div class="col-md-6">
                  <div
                    class="form-group bmd-form-group"
                    :class="{
                      'is-filled': entry.job,
                      'is-focused': activeField == 'job'
                    }"
                  >
                    <label class="bmd-label-floating">{{
                      $t('cruds.order.fields.job')
                    }}</label>
                    <input
                      class="form-control"
                      type="text"
                      :value="entry.job"
                      @input="updateJob"
                      @focus="focusField('job')"
                      @blur="clearFocus"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="card-footer">
              <vue-button-spinner
                class="btn-primary"
                :status="status"
                :isLoading="loading"
                :disabled="loading"
              >
                {{ $t('global.save') }}
              </vue-button-spinner>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
<style scoped>
.trashIconContainer:hover {
  cursor: pointer;
  color: red;
}
</style>

<script>
import { mapGetters, mapActions } from 'vuex'
import BootstrapAlert from '../../components/BootstrapAlert.vue'
import Attachment from '@components/Attachments/Attachment'

export default {
  components: { BootstrapAlert, Attachment },
  data() {
    return {
      status: '',
      activeField: ''
    }
  },
  computed: {
    ...mapGetters('OrdersSingle', ['entry', 'loading', 'lists']),
  },
  mounted() {
    this.fetchCreateData()
  },
  beforeDestroy() {
    this.resetState()
  },
  methods: {
    ...mapActions('OrdersSingle', [
      'storeData',
      'resetState',
      'setDate',
      'setCustomer',
      'setAddress',
      'setComplaint',
      'insertPhotodataFile',
      'removePhotodataFile',
      'insertPhotobeforeFile',
      'removePhotobeforeFile',
      'insertPhotoafterFile',
      'removePhotoafterFile',
      'setUpcoming',
      'setJob',
      'setItems',
      'setItemJenisPekerjaan',
      'setItemLokasi',
      'setItemQty',
      'setItemSatuan',
      'setItemPrice',
      'setItemKet',
      'addItem',
      'setJenisOrder',
      'setNotes',
      'deleteItem',
      'addData',
      'deleteData',
      'setDataAmpereSebelum',
      'setDataAmpereSesudah',
      'setDataVoltaseSebelum',
      'setDataVoltaseSesudah',
      'setDataRefrigenSebelum',
      'setDataRefrigenSesudah',
      'setDataLokasi',
      'fetchCreateData'
    ]),
    updateDate(e) {
      this.setDate(e.target.value)
    },
    updateJenisOrder(value) {
      this.setJenisOrder(value)
    },
    updateNotes(e) {
      this.setNotes(e.target.value)
    },
    updateCustomer(e) {
      this.setCustomer(e.target.value)
    },
    updateAddress(e) {
      this.setAddress(e.target.value)
    },
    updateComplaint(e) {
      this.setComplaint(e.target.value)
    },
    updateUpcoming(e) {
      this.setUpcoming(e.target.value)
    },
    updateJob(e) {
      this.setJob(e.target.value)
    },
    getRoute(name) {
      return `${axios.defaults.baseURL}${name}/media`
    },
    submitForm() {
      this.storeData()
        .then(() => {
          this.$router.push({ name: 'orders.index' })
          this.$eventHub.$emit('create-success')
        })
        .catch(error => {
          this.status = 'failed'
          _.delay(() => {
            this.status = ''
          }, 3000)
        })
    },
    focusField(name) {
      this.activeField = name
    },
    clearFocus() {
      this.activeField = ''
    },
    updateItemJenisPekerjaan(index, event, val) {
      val = event.target.value
      this.setItemJenisPekerjaan({index, val});
    },
    updateItemLokasi(index, event, val) {
      val = event.target.value
      this.setItemLokasi({index, val});
    },
    updateItemQty(index, event, val) {
      val = event.target.value
      this.setItemQty({index, val})
    },
    updateItemSatuan(index, event, val) {
      val = event.target.value
      this.setItemSatuan({index, val})
    },
    updateItemPrice(index, event, val) {
      val = event.target.value
      this.setItemPrice({index, val})
    },
    updateItemKet(index, event, val) {
      val = event.target.value
      this.setItemKet({index, val})
    },
    updateDataAmpereSebelum(index, event, val) {
      val = event.target.value
      this.setDataAmpereSebelum({index, val})
    },
    updateDataAmpereSesudah(index, event, val) {
      val = event.target.value
      this.setDataAmpereSesudah({index, val})
    },
    updateDataVoltaseSebelum(index, event, val) {
      val = event.target.value
      this.setDataVoltaseSebelum({index, val})
    },
    updateDataVoltaseSesudah(index, event, val) {
      val = event.target.value
      this.setDataVoltaseSesudah({index, val})
    },
    updateDataRefrigenSebelum(index, event, val) {
      val = event.target.value
      this.setDataRefrigenSebelum({index, val})
    },
    updateDataRefrigenSesudah(index, event, val) {
      val = event.target.value
      this.setDataRefrigenSesudah({index, val})
    },
    updateDataLokasi(index, event, val) {
      val = event.target.value
      this.setDataLokasi({index, val})
    },
    addRowData() {
      this.addData()
    },
    deleteRowData(index, item) {
      this.$swal({
        title: 'Hapus Item ini ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        showCloseButton: true,
      }).then(result => {
        if(result.isConfirmed) {
          this.deleteData(index)
        }
      })      
    },
    addNewRow() {
        this.addItem()
    },
    deleteRow(index, item) {
      this.$swal({
        title: 'Hapus Item ini ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        showCloseButton: true,
      }).then(result => {
        if(result.isConfirmed) {
          this.deleteItem(index)
        }
      })
    },
    
  }
}
</script>