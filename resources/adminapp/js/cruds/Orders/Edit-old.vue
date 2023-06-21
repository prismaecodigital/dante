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
                      'has-items': entry.date,
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
                      'has-items': entry.customer,
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
                      'has-items': entry.address,
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
                      'has-items': entry.complaint,
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
                    <label>{{ $t('cruds.order.fields.photo') }}</label>
                    <attachment
                      :route="getRoute('orders')"
                      :collection-name="'order_photo'"
                      :media="entry.photo"
                      :model-id="$route.params.id"
                      :max-file-size="5"
                      @file-uploaded="insertPhotoFile"
                      @file-removed="removePhotoFile"
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
      'insertPhotoFile',
      'removePhotoFile'
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