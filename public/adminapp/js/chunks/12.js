(window.webpackJsonp=window.webpackJsonp||[]).push([[12],{GCgq:function(e,t,s){"use strict";s.r(t);var a=s("VTBJ"),i=(s("FNk8"),s("L2JU")),l={data:function(){return{status:"",activeField:"",depts:[]}},computed:Object(a.a)({},Object(i.c)("UsersSingle",["entry","loading","lists"])),beforeDestroy:function(){this.resetState()},watch:{"$route.params.id":{immediate:!0,handler:function(){this.resetState(),this.fetchEditData(this.$route.params.id)}}},methods:Object(a.a)(Object(a.a)({},Object(i.b)("UsersSingle",["fetchEditData","updateData","resetState","setName","setEmail","setPassword","setRoles","setBu","setDept"])),{},{updateName:function(e){this.setName(e.target.value)},updateEmail:function(e){this.setEmail(e.target.value)},updatePassword:function(e){this.setPassword(e.target.value)},updateRoles:function(e){this.setRoles(e)},submitForm:function(){var e=this;this.updateData().then((function(){e.$router.push({name:"users.index"}),e.$eventHub.$emit("update-success")})).catch((function(t){e.status="failed",_.delay((function(){e.status=""}),3e3)}))},focusField:function(e){this.activeField=e},clearFocus:function(){this.activeField=""},updateBu:function(e){var t=this;this.setDept([]);var s=e.map((function(e){return e.id}));this.setBu(e),null!=e[0]?axios.get("/budept-all",{params:{bu:s}}).then((function(e){t.depts=e.data})).catch((function(e){console.log(e)})):this.depts=[],console.log("ok")},updateDept:function(e){this.setDept(e)}})},o=s("KHd+"),r=Object(o.a)(l,(function(){var e=this,t=e._self._c;return t("div",{staticClass:"container-fluid"},[t("form",{on:{submit:function(t){return t.preventDefault(),e.submitForm.apply(null,arguments)}}},[t("div",{staticClass:"row"},[t("div",{staticClass:"col-md-12"},[t("div",{staticClass:"card"},[t("div",{staticClass:"card-header card-header-primary card-header-icon"},[e._m(0),e._v(" "),t("h4",{staticClass:"card-title"},[e._v("\n              "+e._s(e.$t("global.edit"))+"\n              "),t("strong",[e._v(e._s(e.$t("cruds.user.title_singular")))])])]),e._v(" "),t("div",{staticClass:"card-body"},[t("back-button")],1),e._v(" "),t("div",{staticClass:"card-body"},[t("bootstrap-alert"),e._v(" "),t("div",{staticClass:"row"},[t("div",{staticClass:"col-md-12"},[t("div",{staticClass:"form-group bmd-form-group",class:{"is-filled":e.entry.name,"is-focused":"name"==e.activeField}},[t("label",{staticClass:"bmd-label-floating required"},[e._v(e._s(e.$t("cruds.user.fields.name")))]),e._v(" "),t("input",{staticClass:"form-control",attrs:{type:"text",required:""},domProps:{value:e.entry.name},on:{input:e.updateName,focus:function(t){return e.focusField("name")},blur:e.clearFocus}})]),e._v(" "),t("div",{staticClass:"form-group bmd-form-group",class:{"is-filled":e.entry.email,"is-focused":"email"==e.activeField}},[t("label",{staticClass:"bmd-label-floating required"},[e._v(e._s(e.$t("cruds.user.fields.email")))]),e._v(" "),t("input",{staticClass:"form-control",attrs:{type:"text",required:""},domProps:{value:e.entry.email},on:{input:e.updateEmail,focus:function(t){return e.focusField("email")},blur:e.clearFocus}})]),e._v(" "),t("div",{staticClass:"form-group bmd-form-group",class:{"is-filled":e.entry.password,"is-focused":"password"==e.activeField}},[t("label",{staticClass:"bmd-label-floating"},[e._v(e._s(e.$t("cruds.user.fields.password")))]),e._v(" "),t("input",{staticClass:"form-control",attrs:{type:"password"},domProps:{value:e.entry.password},on:{input:e.updatePassword,focus:function(t){return e.focusField("password")},blur:e.clearFocus}})]),e._v(" "),t("div",{staticClass:"form-group bmd-form-group",class:{"is-filled":0!==e.entry.roles.length,"is-focused":"roles"==e.activeField}},[t("label",{staticClass:"required"},[e._v(e._s(e.$t("cruds.user.fields.roles")))]),e._v(" "),t("v-select",{key:"roles-field",attrs:{name:"roles",label:"title",value:e.entry.roles,options:e.lists.roles,closeOnSelect:!1,multiple:""},on:{input:e.updateRoles,search:[function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"focus",void 0,t.key,void 0)?null:e.focusField("roles")},function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"blur",void 0,t.key,void 0)?null:e.clearFocus.apply(null,arguments)}]}})],1),e._v(" "),t("div",{staticClass:"form-group bmd-form-group",class:{"is-filled":0!==e.entry.dept.length,"is-focused":"bu"==e.activeField}},[t("label",{},[e._v(e._s(e.$t("cruds.user.fields.bu")))]),e._v(" "),t("v-select",{key:"bu-field",attrs:{name:"bu",label:"name",value:e.entry.bu,options:e.lists.bu,closeOnSelect:!1,multiple:""},on:{input:e.updateBu,search:[function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"focus",void 0,t.key,void 0)?null:e.focusField("dept")},function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"blur",void 0,t.key,void 0)?null:e.clearFocus.apply(null,arguments)}]}})],1),e._v(" "),t("div",{staticClass:"form-group bmd-form-group",class:{"is-filled":0!==e.entry.dept.length,"is-focused":"dept"==e.activeField}},[t("label",{},[e._v(e._s(e.$t("cruds.user.fields.dept")))]),e._v(" "),t("v-select",{key:"dept-field",attrs:{name:"dept",label:"name",value:e.entry.dept,options:e.depts,closeOnSelect:!1,multiple:""},on:{input:e.updateDept,search:[function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"focus",void 0,t.key,void 0)?null:e.focusField("dept")},function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"blur",void 0,t.key,void 0)?null:e.clearFocus.apply(null,arguments)}]}})],1)])])],1),e._v(" "),t("div",{staticClass:"card-footer"},[t("vue-button-spinner",{staticClass:"btn-primary",attrs:{status:e.status,isLoading:e.loading,disabled:e.loading}},[e._v("\n              "+e._s(e.$t("global.save"))+"\n            ")])],1)])])])])])}),[function(){var e=this._self._c;return e("div",{staticClass:"card-icon"},[e("i",{staticClass:"material-icons"},[this._v("edit")])])}],!1,null,null,null);t.default=r.exports}}]);