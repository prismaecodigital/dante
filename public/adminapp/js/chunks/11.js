(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{"6w+1":function(t,e,s){"use strict";s.r(e);var a=s("VTBJ"),i=(s("FNk8"),s("L2JU")),r={components:{},data:function(){return{status:"",activeField:""}},computed:Object(a.a)({},Object(i.c)("ServicesSingle",["entry","loading"])),beforeDestroy:function(){this.resetState()},watch:{"$route.params.id":{immediate:!0,handler:function(){this.resetState(),this.fetchEditData(this.$route.params.id)}}},methods:Object(a.a)(Object(a.a)({},Object(i.b)("ServicesSingle",["fetchEditData","updateData","resetState","setUpcomingService","setCustomer","setAddress","setService","setLatestService","setStatus"])),{},{updateUpcomingService:function(t){this.setUpcomingService(t.target.value)},updateCustomer:function(t){this.setCustomer(t.target.value)},updateAddress:function(t){this.setAddress(t.target.value)},updateService:function(t){this.setService(t.target.value)},updateLatestService:function(t){this.setLatestService(t.target.value)},updateStatus:function(t){this.setStatus(t.target.value)},submitForm:function(){var t=this;this.updateData().then((function(){t.$router.push({name:"services.index"}),t.$eventHub.$emit("update-success")})).catch((function(e){t.status="failed",_.delay((function(){t.status=""}),3e3)}))},focusField:function(t){this.activeField=t},clearFocus:function(){this.activeField=""}})},c=s("KHd+"),u=Object(c.a)(r,(function(){var t=this,e=t._self._c;return e("div",{staticClass:"container-fluid"},[e("form",{on:{submit:function(e){return e.preventDefault(),t.submitForm.apply(null,arguments)}}},[e("div",{staticClass:"row"},[e("div",{staticClass:"col-md-12"},[e("div",{staticClass:"card"},[e("div",{staticClass:"card-header card-header-primary card-header-icon"},[t._m(0),t._v(" "),e("h4",{staticClass:"card-title"},[t._v("\n\t\t\t\t\t\t\t\t"+t._s(t.$t("global.edit"))+"\n                "),e("strong",[t._v(t._s(t.$t("cruds.service.title_singular")))])])]),t._v(" "),e("div",{staticClass:"card-body"},[e("back-button")],1),t._v(" "),e("div",{staticClass:"card-body"},[e("bootstrap-alert"),t._v(" "),e("div",{staticClass:"row"},[e("div",{staticClass:"col-md-6"},[e("div",{staticClass:"form-group bmd-form-group",class:{"is-filled":t.entry.customer,"is-focused":"customer"==t.activeField}},[e("label",{staticClass:"bmd-label-floating"},[t._v(t._s(t.$t("cruds.order.fields.customer")))]),t._v(" "),e("input",{staticClass:"form-control",attrs:{type:"text"},domProps:{value:t.entry.customer},on:{input:t.updateCustomer,focus:function(e){return t.focusField("customer")},blur:t.clearFocus}})]),t._v(" "),e("div",{staticClass:"form-group bmd-form-group",class:{"is-filled":t.entry.address,"is-focused":"address"==t.activeField}},[e("label",{staticClass:"bmd-label-floating"},[t._v(t._s(t.$t("cruds.order.fields.address")))]),t._v(" "),e("input",{staticClass:"form-control",attrs:{type:"text"},domProps:{value:t.entry.address},on:{input:t.updateAddress,focus:function(e){return t.focusField("address")},blur:t.clearFocus}})]),t._v(" "),e("div",{staticClass:"form-group bmd-form-group",class:{"is-filled":t.entry.latest_service,"is-focused":"latest_service"==t.activeField}},[e("label",{staticClass:"required"},[t._v("Service Terakhir")]),t._v(" "),e("datetime-picker",{staticClass:"form-control",attrs:{type:"text",picker:"date",value:t.entry.latest_service,required:""},on:{input:t.updateLatestService,focus:function(e){return t.focusField("latest_service")},blur:t.clearFocus}})],1)]),t._v(" "),e("div",{staticClass:"col-md-6"},[e("div",{staticClass:"form-group bmd-form-group",class:{"is-filled":t.entry.service,"is-focused":"service"==t.activeField}},[e("label",{staticClass:"bmd-label-floating"},[t._v("Service")]),t._v(" "),e("input",{staticClass:"form-control",attrs:{type:"text"},domProps:{value:t.entry.service},on:{input:t.updateService,focus:function(e){return t.focusField("service")},blur:t.clearFocus}})]),t._v(" "),e("div",{staticClass:"form-group bmd-form-group",class:{"is-filled":t.entry.upcoming_service,"is-focused":"upcoming_service"==t.activeField}},[e("label",{staticClass:"bmd-label-floating required"},[t._v(t._s(t.$t("cruds.order.fields.upcoming")))]),t._v(" "),e("datetime-picker",{staticClass:"form-control",attrs:{type:"text",picker:"date",value:t.entry.upcoming_service,required:""},on:{input:t.updateUpcomingService,focus:function(e){return t.focusField("upcoming_service")},blur:t.clearFocus}})],1),t._v(" "),e("div",{staticClass:"form-group bmd-form-group",class:{"is-filled":t.entry.status,"is-focused":"status"==t.activeField}},[e("label",{},[t._v("Status Service")]),t._v(" "),e("v-select",{key:"status-field",attrs:{name:"status",value:t.entry.status,options:[{value:"0",label:"Belum"},{value:"1",label:"Selesai"}],reduce:function(t){return t.value}}})],1)])])],1),t._v(" "),e("div",{staticClass:"card-footer"},[e("vue-button-spinner",{staticClass:"btn-primary",attrs:{status:t.status,isLoading:t.loading,disabled:t.loading}},[t._v("\n                "+t._s(t.$t("global.save"))+"\n              ")])],1)])])])])])}),[function(){var t=this._self._c;return t("div",{staticClass:"card-icon"},[t("i",{staticClass:"material-icons"},[this._v("edit")])])}],!1,null,null,null);e.default=u.exports}}]);