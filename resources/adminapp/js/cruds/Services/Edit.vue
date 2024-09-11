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
                <strong>{{ $t('cruds.service.title_singular') }}</strong>
							</h4>
						</div>
						<div class="card-body">
              <back-button></back-button>
						</div>
						<div class="card-body">
              <bootstrap-alert />
							<div class="row">
								<div class="col-md-6">
									<!-- Customer -->
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
									<!-- Address -->
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
									<!-- Latest Service -->
									<div
                    class="form-group bmd-form-group"
                    :class="{
                      'is-filled': entry.latest_service,
                      'is-focused': activeField == 'latest_service'
                    }"
                  >
                    <label class="required">Service Terakhir</label>
                    <datetime-picker
                      class="form-control"
                      type="text"
                      picker="date"
                      :value="entry.latest_service"
                      @input="updateLatestService"
                      @focus="focusField('latest_service')"
                      @blur="clearFocus"
                      required
                    >
                    </datetime-picker>
                  </div>
								</div>

								<div class="col-md-6">
									<!-- Service -->
									<div
                    class="form-group bmd-form-group"
                    :class="{
                      'is-filled': entry.service,
                      'is-focused': activeField == 'service'
                    }"
                  >
                    <label class="bmd-label-floating">Service</label>
                    <input
                      class="form-control"
                      type="text"
                      :value="entry.service"
                      @input="updateService"
                      @focus="focusField('service')"
                      @blur="clearFocus"
                    />
                  </div>
									<!-- Upcoming Service -->
									<div
                    class="form-group bmd-form-group"
                    :class="{
                      'is-filled': entry.upcoming_service,
                      'is-focused': activeField == 'upcoming_service'
                    }"
                  >
                    <label class="bmd-label-floating required">{{
                      $t('cruds.order.fields.upcoming')
                    }}</label>
                    <datetime-picker
                      class="form-control"
                      type="text"
                      picker="date"
                      :value="entry.upcoming_service"
                      @input="updateUpcomingService"
                      @focus="focusField('upcoming_service')"
                      @blur="clearFocus"
                      required
                    >
                    </datetime-picker>
                  </div>
									<!-- Status -->
									<div
										class="form-group bmd-form-group"
										:class="{
											'is-filled': entry.status,
											'is-focused': activeField == 'status'
										}"
									>
										<label class="">Status Service</label>
										<v-select
											name="status"
											:key="'status-field'"
											:value="entry.status"
											:options="[
												{ value: '0', label: 'Belum' },
												{ value: '1', label: 'Selesai' }
											]"
											:reduce="entry => entry.value"
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

	export default {
		components: {
			// 
		},
		data() {
			return {
				status: '',
				activeField: ''				
			}
		},
		computed: {
			...mapGetters('ServicesSingle', ['entry', 'loading'])
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
			...mapActions('ServicesSingle', [
				'fetchEditData',
				'updateData',
				'resetState',
				'setUpcomingService',
				'setCustomer',
				'setAddress',
				'setService',
				'setLatestService',
				'setStatus'
			]),
			updateUpcomingService(e) {
				this.setUpcomingService(e.target.value)
			},
			updateCustomer(e) {
				this.setCustomer(e.target.value)
			},
			updateAddress(e) {
				this.setAddress(e.target.value)
			},
			updateService(e) {
				this.setService(e.target.value)
			},
			updateLatestService(e) {
				this.setLatestService(e.target.value)
			},
			updateStatus(e) {
				this.setStatus(e.target.value)
			},
			submitForm() {
				this.updateData()
					.then(() => {
						this.$router.push({ name: 'services.index' })
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