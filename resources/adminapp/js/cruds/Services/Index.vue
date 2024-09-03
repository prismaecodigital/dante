<template>
	<div class="container-fluid">
		<div class="row">
			<div class="col-md-12">
				<div class="card">
					<div class="card-header card-header-primary card-header-icon">
						<div class="card-icon">
							<i class="material-icons">assignment</i>
						</div>
						<h4 class="card-title">
              <strong>{{ $t('cruds.service.title') }}</strong>
            </h4>
					</div>
					<div class="card-body">
						<router-link
              class="btn btn-primary"
              v-if="$can(xprops.permission_prefix + 'create')"
              :to="{ name: xprops.route + '.create' }"
            >
              <i class="material-icons">
                add
              </i>
              {{ $t('global.add') }}
            </router-link>
            <button
              type="button"
              class="btn btn-default"
              @click="fetchIndexData"
              :disabled="loading"
              :class="{ disabled: loading }"
            >
              <i class="material-icons" :class="{'fa-spin': loading }">
                refresh
              </i>
              {{ $t('global.refresh') }}
            </button>
					</div>
					<div class="card-body">
            <div class="row">
              <div class="col-md-12">
                <div class="table-overlay" v-show="loading">
                  <div class="table-overlay-container">
                    <material-spinner></material-spinner>
                    <span>Loading...</span>
                  </div>
                </div>
                <datatable
                  :columns="columns"
                  :data="data"
                  :total="total"
                  :query="query"
                  :xprops="xprops"
                  :HeaderSettings="false"
                  :pageSizeOptions="[10, 25, 50, 100]"
                >
                  <div class="row">
                    <div class="col-12">
                      <button
                        type="button"
                        class="btn btn-warning"
                        @click="updateStatus(0)"
                        :disabled="loading"
                        :class="{ disabled: loading }"
                      >
                        Belum
                      </button>

                      <button
                        type="button"
                        class="btn btn-success"
                        @click="updateStatus(1)"
                        :disabled="loading"
                        :class="{ disabled: loading }"
                      >
                        Selesai
                      </button>
                    </div>
                  </div>
                  <global-search :query="query" class="pull-left" />
                  <header-settings :columns="columns" class="pull-right" />
                </datatable>
              </div>
            </div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import TranslatedHeader from '@components/Datatables/TranslatedHeader'
  import HeaderSettings from '@components/Datatables/HeaderSettings'
  import GlobalSearch from '@components/Datatables/GlobalSearch'
  import ServiceActions from '@components/Datatables/ServiceActions'

  export default {
    components: {
      GlobalSearch,
      HeaderSettings
    },
    data() {
      return {
        columns: [
          {
            title: 'cruds.order.fields.upcoming',
            field: 'upcoming_service',
            thComp: TranslatedHeader,
            sortable: true, 
          },
          {
            title: 'cruds.order.fields.customer',
            field: 'customer',
            thComp: TranslatedHeader,
            sortable: true, 
          },
          {
            title: 'cruds.order.fields.job',
            field: 'service',
            thComp: TranslatedHeader,
            sortable: true, 
          },
          {
            title: 'cruds.order.fields.date',
            field: 'latest_service',
            thComp: TranslatedHeader,
            sortable: true, 
          },
          {
            title: 'global.status',
            field: 'status',
            thComp: TranslatedHeader,
            sortable: true,
            tdComp: {
              props: ['row'],
              template: '<span>{{ row.status === "1" ? "Selesai" : "Belum" }}</span>'
            },
          },
          {
            title: 'global.actions',
            thComp: TranslatedHeader,
            tdComp: ServiceActions,
            visible: true,
            thClass: 'text-right',
            tdClass: 'text-right td-actions',
          }
        ],
        query: { sort: 'upcoming_service', order: 'asc', limit: 100, s: '', status: '0' },
        xprops: {
          module: 'ServicesIndex',
          route: 'services',
          permission_prefix: 'service_'
        }
      }
    },
    beforeDestroy() {
      this.resetState()
    },
    computed: {
      ...mapGetters('ServicesIndex', ['data', 'total', 'loading'])
    },
    watch: {
      query: {
        handler(query) {
          this.setQuery(query)
          this.fetchIndexData()
        },
        deep:true
      }
    },
    methods: {
      ...mapActions('ServicesIndex', [
        'fetchIndexData',
        'setQuery',
        'resetState'
      ]),
      updateStatus(status) {
        this.query.status = status;
      }
    }
  }
</script>