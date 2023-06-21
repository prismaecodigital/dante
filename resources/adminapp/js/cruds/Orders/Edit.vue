<template>
  <div class="container-fluid">
    <form @submit.prevent="submitForm">
      <div class="row">
        <div class="col-md-12">
          <div class="card">
            <div class="card-header card-header-primary card-header-icon">
              <div class="card-icon">
                <i class="material-icons">edit</i>
              </div>
              <h4 class="card-title">
                {{ $t('global.edit') }}
                <strong>{{ $t('cruds.order.title_singular') }}</strong>
              </h4>
            </div>
            <div class="card-body">
              <back-button></back-button>
            </div>
            <div class="card-body">
              <bootstrap-alert />
              <div class="row">
                <div class="col-md-12">
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
                    <label class="bmd-label-floating">{{
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
                  <div class="form-group">
                    <label>{{ $t('cruds.order.fields.photodata') }}</label>
                    <attachment
                      :route="getRoute('orders')"
                      :collection-name="'order_photodata'"
                      :media="entry.photodata"
                      :model-id="$route.params.id"
                      :max-file-size="5"
                      :accept="'image/*'"
                      @file-uploaded="insertPhotodataFile"
                      @file-removed="removePhotodataFile"
                    />
                  </div>
                  <div class="form-group">
                    <label>{{ $t('cruds.order.fields.photobefore') }}</label>
                    <attachment
                      :route="getRoute('orders')"
                      :collection-name="'order_photobefore'"
                      :media="entry.photobefore"
                      :model-id="$route.params.id"
                      :max-file-size="5"
                      :accept="'image/*'"
                      @file-uploaded="insertPhotobeforeFile"
                      @file-removed="removePhotobeforeFile"
                    />
                  </div>
                  <div class="form-group">
                    <label>{{ $t('cruds.order.fields.photoafter') }}</label>
                    <attachment
                      :route="getRoute('orders')"
                      :collection-name="'order_photoafter'"
                      :media="entry.photoafter"
                      :model-id="$route.params.id"
                      :max-file-size="5"
                      :accept="'image/*'"
                      @file-uploaded="insertPhotoafterFile"
                      @file-removed="removePhotoafterFile"
                    />
                  </div>
                </div>
              </div>
            </div>
          <div class="card-body">
            <bootstrap-alert />
            <table class="table table-bordered" name="inputItem">
              <thead>
                <th>Jenis Pekerjaan</th>
                <th>Lokasi</th>
                <th>Jumlah</th>
                <th>Satuan</th>
                <th>Harga</th>                
                <th>Ket</th>
              </thead>
              <tbody>
                <tr v-for="(item, k) in entry.items" :key="k">
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

<script>
import { mapGetters, mapActions } from 'vuex'
import Attachment from '@components/Attachments/Attachment'

export default {
  components: {
    Attachment
  },
  data() {
    return {
      status: '',
      activeField: ''
    }
  },
  computed: {
    ...mapGetters('OrdersSingle', ['entry', 'loading'])
  },
  beforeDestroy() {
    this.resetState()
  },
  watch: {
    '$route.params.id': {
      immediate: true,
      handler() {
        this.resetState()
        this.fetchEditData(this.$route.params.id)
      }
    }
  },
  methods: {
    ...mapActions('OrdersSingle', [
      'fetchEditData',
      'updateData',
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
      'setItems',
      'setItemJenisPekerjaan',
      'setItemLokasi',
      'setItemQty',
      'setItemSatuan',
      'setItemPrice',
      'setItemKet',
    ]),
    updateDate(e) {
      this.setDate(e.target.value)
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
    getRoute(name) {
      return `${axios.defaults.baseURL}${name}/media`
    },
    submitForm() {
      this.updateData()
        .then(() => {
          this.$router.push({ name: 'orders.index' })
          this.$eventHub.$emit('update-success')
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
    }
  }
}
</script>