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

					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import TranslatedHeader from '@components/Datatables/TranslatedHeader'
  import HeaderSettings from '@components/Datatables/HeaderSettings'
  import GlobalSearch from '@components/Datatables/GlobalSearch'
  import DatatableActions from '@components/Datatables/DatatableActions'

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
        ],
        query: { sort: 'upcoming_service', order: 'desc', limit: 100, s: '' },
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
    }
  }
</script>