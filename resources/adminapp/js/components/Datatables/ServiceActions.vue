<template>
  <div class="dt-action-container">
		<router-link
      class="btn btn-round btn-info"
      v-if="$can(xprops.permission_prefix + 'edit')"
      :to="{ name: xprops.route + '.edit', params: { id: row.id } }"
    >
      Ubah
    </router-link>
		
		<a
      href="#"
      class="btn btn-round btn-success"
      v-if="!+row.status"
      @click.prevent="approveData(row.id)"
      type="button"
    >
			Selesai
    </a>

		<a
      href="#"
      class="btn btn-round btn-danger"
      v-if="$can(xprops.permission_prefix + 'delete')"
      @click.prevent="destroyData(row.id)"
      type="button"
    >
      Hapus
    </a>
	</div>
</template>

<style scoped>
.btn {
  padding: 5px 10px !important;
}
</style>

<script>
	export default {
		props: ['row', 'xprops'],
		data() { return {} },
		created() { },
		methods: {
			approveData(id) {
				this.$swal({
					title: 'Servis Selesai dilakukan?',
					icon: 'warning',
					showCancelButton: true,
					confirmButtonColor: '#3085d6',
					cancelButtonColor: '#d33',
					confirmButtonText: 'Sudah',
					showCloseButton: true,
					cancelButtonText: 'Belum',
				}).then(result => {
					if (result.value) {
						this.$store
							.dispatch(this.xprops.module + '/servisSuccess', id)
							.then(result => {
								this.$eventHub.$emit('servis-success')
							})
					}
				});
			},
			destroyData(id) {
				this.$swal({
					title: 'Are you sure?',
					text: "You won't be able to revert this!",
					type: 'warning',
					showCancelButton: true,
					confirmButtonText: 'Delete',
					confirmButtonColor: '#dd4b39',
					focusCancel: true,
					reverseButtons: true
				}).then(result => {
					if (result.value) {
						this.$store
							.dispatch(this.xprops.module + '/destroyData', id)
							.then(result => {
								this.$eventHub.$emit('delete-success')
							})
					}
				});
			},
		},
	};
</script>

