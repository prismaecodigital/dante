<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header card-header-primary card-header-icon">
            <div class="card-icon">
              <i class="material-icons">remove_red_eye</i>
            </div>
            <h4 class="card-title">
              {{ $t('global.view') }}
              <strong>{{ $t('cruds.order.title_singular') }}</strong>
            </h4>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-lg-3">
                <back-button></back-button>
              </div>
              <div class="col-lg-3">
                <a class="btn btn-primary" :href="`/report/${entry.id}`" target="_blank">Cetak Laporan</a>
              </div>
            </div>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-12">
                <div class="table-responsive">
                  <div class="table">
                    <tbody>
                      <tr>
                        <td class="text-primary">
                          {{ $t('cruds.order.fields.code') }}
                        </td>
                        <td>
                          {{ entry.code }}
                        </td>
                      </tr>
                      <tr>
                        <td class="text-primary">
                          {{ $t('cruds.order.fields.jenis_order') }}
                        </td>
                        <td>
                          <datatable-enum :row="entry" field="jenis_order">
                          </datatable-enum>
                        </td>
                      </tr>
                      <tr>
                        <td class="text-primary">
                          {{ $t('cruds.order.fields.date') }}
                        </td>
                        <td>
                          {{ entry.date }}
                        </td>
                      </tr>
                      <tr>
                        <td class="text-primary">
                          {{ $t('cruds.order.fields.customer') }}
                        </td>
                        <td>
                          {{ entry.customer }}
                        </td>
                      </tr>
                      <tr>
                        <td class="text-primary">
                          {{ $t('cruds.order.fields.address') }}
                        </td>
                        <td>
                          {{ entry.address }}
                        </td>
                      </tr>
                      <tr>
                        <td class="text-primary">
                          {{ $t('cruds.order.fields.complaint') }}
                        </td>
                        <td>
                          {{ entry.complaint }}
                        </td>
                      </tr>
                      <tr>
                        <td class="text-primary">
                          {{ $t('cruds.order.fields.notes') }}
                        </td>
                        <td>
                          {{ entry.notes }}
                        </td>
                      </tr>
                      <tr>
                        <td class="text-primary">
                          {{ $t('cruds.order.fields.photodata') }}
                        </td>
                        <td>
                          <datatable-attachments :row="entry" :field="'photodata'">
                          </datatable-attachments>
                        </td>
                      </tr>
                      <tr>
                        <td class="text-primary">
                          {{ $t('cruds.order.fields.photobefore') }}
                        </td>
                        <td>
                          <datatable-attachments
                            :row="entry"
                            :field="'photobefore'"
                          >
                          </datatable-attachments>
                        </td>
                      </tr>
                      <tr>
                        <td class="text-primary">
                          {{ $t('cruds.order.fields.photoafter') }}
                        </td>
                        <td>
                          <datatable-attachments
                            :row="entry"
                            :field="'photoafter'"
                          >
                          </datatable-attachments>
                        </td>
                      </tr>
                    </tbody>
                  </div>
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
                <th>Harga</th>
                <th>Total Harga</th>
                <th>Ket</th>
              </thead>
              <tbody>
                <tr v-for="(item, k) in entry.items" :key="k">
                  <td>
                      <input disabled class="form-control wrapText" type="text" :value="item.jenis_pekerjaan"/>
                  </td>
                  <td>
                      <input disabled class="form-control wrapText" type="text" :value="item.lokasi"/>
                  </td>
                  <td>
                      <input disabled class="form-control wrapText" type="text" :value="item.qty"/>
                  </td>
                  <td>
                      <input disabled class="form-control wrapText" type="text" :value="item.price"/>
                  </td>
                  <td>
                      <input disabled class="form-control wrapText" type="text" :value="item.price * item.qty"/>
                  </td>
                  <td>
                      <input disabled class="form-control wrapText" type="text" :value="item.ket"/>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import DatatableEnum from '@components/Datatables/DatatableEnum'
import DatatableAttachments from '@components/Datatables/DatatableAttachments'
import DatatablePictures from '@components/Datatables/DatatablePictures'

export default {
  components: {
    DatatableEnum,
    DatatablePictures,
    DatatableAttachments
  },
  data() {
    return {}
  },
  beforeDestroy() {
    this.resetState()
  },
  computed: {
    ...mapGetters('OrdersSingle', ['entry'])
  },
  watch: {
    '$route.params.id': {
      immediate: true,
      handler() {
        this.resetState()
        this.fetchShowData(this.$route.params.id)
      }
    }
  },
  methods: {
    ...mapActions('OrdersSingle', ['fetchShowData', 'resetState'])
  }
}
</script>