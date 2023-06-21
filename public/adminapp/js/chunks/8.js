(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[8],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/adminapp/js/cruds/Orders/Edit.vue?vue&type=script&lang=js&":
/*!**************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/adminapp/js/cruds/Orders/Edit.vue?vue&type=script&lang=js& ***!
  \**************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var C_Users_62895_laravel9_dante_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/objectSpread2.js */ "./node_modules/@babel/runtime/helpers/esm/objectSpread2.js");
/* harmony import */ var core_js_modules_es_array_push_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.array.push.js */ "./node_modules/core-js/modules/es.array.push.js");
/* harmony import */ var core_js_modules_es_array_push_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_push_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _components_Attachments_Attachment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @components/Attachments/Attachment */ "./resources/adminapp/js/components/Attachments/Attachment.vue");




/* harmony default export */ __webpack_exports__["default"] = ({
  components: {
    Attachment: _components_Attachments_Attachment__WEBPACK_IMPORTED_MODULE_3__["default"]
  },
  data: function data() {
    return {
      status: '',
      activeField: ''
    };
  },
  computed: Object(C_Users_62895_laravel9_dante_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_0__["default"])({}, Object(vuex__WEBPACK_IMPORTED_MODULE_2__["mapGetters"])('OrdersSingle', ['entry', 'loading'])),
  beforeDestroy: function beforeDestroy() {
    this.resetState();
  },
  watch: {
    '$route.params.id': {
      immediate: true,
      handler: function handler() {
        this.resetState();
        this.fetchEditData(this.$route.params.id);
      }
    }
  },
  methods: Object(C_Users_62895_laravel9_dante_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_0__["default"])(Object(C_Users_62895_laravel9_dante_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_0__["default"])({}, Object(vuex__WEBPACK_IMPORTED_MODULE_2__["mapActions"])('OrdersSingle', ['fetchEditData', 'updateData', 'resetState', 'setDate', 'setCustomer', 'setAddress', 'setComplaint', 'insertPhotodataFile', 'removePhotodataFile', 'insertPhotobeforeFile', 'removePhotobeforeFile', 'insertPhotoafterFile', 'removePhotoafterFile', 'setItems', 'setItemJenisPekerjaan', 'setItemLokasi', 'setItemQty', 'setItemSatuan', 'setItemPrice', 'setItemKet'])), {}, {
    updateDate: function updateDate(e) {
      this.setDate(e.target.value);
    },
    updateCustomer: function updateCustomer(e) {
      this.setCustomer(e.target.value);
    },
    updateAddress: function updateAddress(e) {
      this.setAddress(e.target.value);
    },
    updateComplaint: function updateComplaint(e) {
      this.setComplaint(e.target.value);
    },
    updateItemJenisPekerjaan: function updateItemJenisPekerjaan(index, event, val) {
      val = event.target.value;
      this.setItemJenisPekerjaan({
        index: index,
        val: val
      });
    },
    updateItemLokasi: function updateItemLokasi(index, event, val) {
      val = event.target.value;
      this.setItemLokasi({
        index: index,
        val: val
      });
    },
    updateItemQty: function updateItemQty(index, event, val) {
      val = event.target.value;
      this.setItemQty({
        index: index,
        val: val
      });
    },
    updateItemSatuan: function updateItemSatuan(index, event, val) {
      val = event.target.value;
      this.setItemSatuan({
        index: index,
        val: val
      });
    },
    updateItemPrice: function updateItemPrice(index, event, val) {
      val = event.target.value;
      this.setItemPrice({
        index: index,
        val: val
      });
    },
    updateItemKet: function updateItemKet(index, event, val) {
      val = event.target.value;
      this.setItemKet({
        index: index,
        val: val
      });
    },
    getRoute: function getRoute(name) {
      return "".concat(axios.defaults.baseURL).concat(name, "/media");
    },
    submitForm: function submitForm() {
      var _this = this;
      this.updateData().then(function () {
        _this.$router.push({
          name: 'orders.index'
        });
        _this.$eventHub.$emit('update-success');
      })["catch"](function (error) {
        _this.status = 'failed';
        _.delay(function () {
          _this.status = '';
        }, 3000);
      });
    },
    focusField: function focusField(name) {
      this.activeField = name;
    },
    clearFocus: function clearFocus() {
      this.activeField = '';
    }
  })
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/adminapp/js/cruds/Orders/Edit.vue?vue&type=template&id=b869a3ee&":
/*!************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/adminapp/js/cruds/Orders/Edit.vue?vue&type=template&id=b869a3ee& ***!
  \************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "container-fluid"
  }, [_c("form", {
    on: {
      submit: function submit($event) {
        $event.preventDefault();
        return _vm.submitForm.apply(null, arguments);
      }
    }
  }, [_c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-md-12"
  }, [_c("div", {
    staticClass: "card"
  }, [_c("div", {
    staticClass: "card-header card-header-primary card-header-icon"
  }, [_vm._m(0), _vm._v(" "), _c("h4", {
    staticClass: "card-title"
  }, [_vm._v("\n              " + _vm._s(_vm.$t("global.edit")) + "\n              "), _c("strong", [_vm._v(_vm._s(_vm.$t("cruds.order.title_singular")))])])]), _vm._v(" "), _c("div", {
    staticClass: "card-body"
  }, [_c("back-button")], 1), _vm._v(" "), _c("div", {
    staticClass: "card-body"
  }, [_c("bootstrap-alert"), _vm._v(" "), _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-md-12"
  }, [_c("div", {
    staticClass: "form-group bmd-form-group",
    "class": {
      "is-filled": _vm.entry.date,
      "is-focused": _vm.activeField == "date"
    }
  }, [_c("label", {
    staticClass: "bmd-label-floating required"
  }, [_vm._v(_vm._s(_vm.$t("cruds.order.fields.date")))]), _vm._v(" "), _c("datetime-picker", {
    staticClass: "form-control",
    attrs: {
      type: "text",
      picker: "date",
      value: _vm.entry.date,
      required: ""
    },
    on: {
      input: _vm.updateDate,
      focus: function focus($event) {
        return _vm.focusField("date");
      },
      blur: _vm.clearFocus
    }
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "form-group bmd-form-group",
    "class": {
      "is-filled": _vm.entry.customer,
      "is-focused": _vm.activeField == "customer"
    }
  }, [_c("label", {
    staticClass: "bmd-label-floating"
  }, [_vm._v(_vm._s(_vm.$t("cruds.order.fields.customer")))]), _vm._v(" "), _c("input", {
    staticClass: "form-control",
    attrs: {
      type: "text"
    },
    domProps: {
      value: _vm.entry.customer
    },
    on: {
      input: _vm.updateCustomer,
      focus: function focus($event) {
        return _vm.focusField("customer");
      },
      blur: _vm.clearFocus
    }
  })]), _vm._v(" "), _c("div", {
    staticClass: "form-group bmd-form-group",
    "class": {
      "is-filled": _vm.entry.address,
      "is-focused": _vm.activeField == "address"
    }
  }, [_c("label", {
    staticClass: "bmd-label-floating"
  }, [_vm._v(_vm._s(_vm.$t("cruds.order.fields.address")))]), _vm._v(" "), _c("input", {
    staticClass: "form-control",
    attrs: {
      type: "text"
    },
    domProps: {
      value: _vm.entry.address
    },
    on: {
      input: _vm.updateAddress,
      focus: function focus($event) {
        return _vm.focusField("address");
      },
      blur: _vm.clearFocus
    }
  })]), _vm._v(" "), _c("div", {
    staticClass: "form-group bmd-form-group",
    "class": {
      "is-filled": _vm.entry.complaint,
      "is-focused": _vm.activeField == "complaint"
    }
  }, [_c("label", {
    staticClass: "bmd-label-floating"
  }, [_vm._v(_vm._s(_vm.$t("cruds.order.fields.complaint")))]), _vm._v(" "), _c("input", {
    staticClass: "form-control",
    attrs: {
      type: "text"
    },
    domProps: {
      value: _vm.entry.complaint
    },
    on: {
      input: _vm.updateComplaint,
      focus: function focus($event) {
        return _vm.focusField("complaint");
      },
      blur: _vm.clearFocus
    }
  })]), _vm._v(" "), _c("div", {
    staticClass: "form-group"
  }, [_c("label", [_vm._v(_vm._s(_vm.$t("cruds.order.fields.photodata")))]), _vm._v(" "), _c("attachment", {
    attrs: {
      route: _vm.getRoute("orders"),
      "collection-name": "order_photodata",
      media: _vm.entry.photodata,
      "model-id": _vm.$route.params.id,
      "max-file-size": 5,
      accept: "image/*"
    },
    on: {
      "file-uploaded": _vm.insertPhotodataFile,
      "file-removed": _vm.removePhotodataFile
    }
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "form-group"
  }, [_c("label", [_vm._v(_vm._s(_vm.$t("cruds.order.fields.photobefore")))]), _vm._v(" "), _c("attachment", {
    attrs: {
      route: _vm.getRoute("orders"),
      "collection-name": "order_photobefore",
      media: _vm.entry.photobefore,
      "model-id": _vm.$route.params.id,
      "max-file-size": 5,
      accept: "image/*"
    },
    on: {
      "file-uploaded": _vm.insertPhotobeforeFile,
      "file-removed": _vm.removePhotobeforeFile
    }
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "form-group"
  }, [_c("label", [_vm._v(_vm._s(_vm.$t("cruds.order.fields.photoafter")))]), _vm._v(" "), _c("attachment", {
    attrs: {
      route: _vm.getRoute("orders"),
      "collection-name": "order_photoafter",
      media: _vm.entry.photoafter,
      "model-id": _vm.$route.params.id,
      "max-file-size": 5,
      accept: "image/*"
    },
    on: {
      "file-uploaded": _vm.insertPhotoafterFile,
      "file-removed": _vm.removePhotoafterFile
    }
  })], 1)])])], 1), _vm._v(" "), _c("div", {
    staticClass: "card-body"
  }, [_c("bootstrap-alert"), _vm._v(" "), _c("table", {
    staticClass: "table table-bordered",
    attrs: {
      name: "inputItem"
    }
  }, [_vm._m(1), _vm._v(" "), _c("tbody", _vm._l(_vm.entry.items, function (item, k) {
    return _c("tr", {
      key: k
    }, [_c("td", [_c("input", {
      staticClass: "form-control wrapText",
      attrs: {
        type: "text"
      },
      domProps: {
        value: item.jenis_pekerjaan
      },
      on: {
        input: function input($event) {
          return _vm.updateItemJenisPekerjaan(k, $event);
        }
      }
    })]), _vm._v(" "), _c("td", [_c("input", {
      staticClass: "form-control wrapText",
      attrs: {
        type: "text"
      },
      domProps: {
        value: item.lokasi
      },
      on: {
        input: function input($event) {
          return _vm.updateItemLokasi(k, $event);
        }
      }
    })]), _vm._v(" "), _c("td", [_c("input", {
      staticClass: "form-control wrapText",
      attrs: {
        type: "number"
      },
      domProps: {
        value: item.qty
      },
      on: {
        input: function input($event) {
          return _vm.updateItemQty(k, $event);
        }
      }
    })]), _vm._v(" "), _c("td", [_c("input", {
      staticClass: "form-control wrapText",
      attrs: {
        type: "text"
      },
      domProps: {
        value: item.satuan
      },
      on: {
        input: function input($event) {
          return _vm.updateItemSatuan(k, $event);
        }
      }
    })]), _vm._v(" "), _c("td", [_c("input", {
      staticClass: "form-control wrapText",
      attrs: {
        type: "number"
      },
      domProps: {
        value: item.price
      },
      on: {
        input: function input($event) {
          return _vm.updateItemPrice(k, $event);
        }
      }
    })]), _vm._v(" "), _c("td", [_c("input", {
      staticClass: "form-control wrapText",
      attrs: {
        type: "text"
      },
      domProps: {
        value: item.ket
      },
      on: {
        input: function input($event) {
          return _vm.updateItemKet(k, $event);
        }
      }
    })])]);
  }), 0)])], 1), _vm._v(" "), _c("div", {
    staticClass: "card-footer"
  }, [_c("vue-button-spinner", {
    staticClass: "btn-primary",
    attrs: {
      status: _vm.status,
      isLoading: _vm.loading,
      disabled: _vm.loading
    }
  }, [_vm._v("\n              " + _vm._s(_vm.$t("global.save")) + "\n            ")])], 1)])])])])]);
};
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "card-icon"
  }, [_c("i", {
    staticClass: "material-icons"
  }, [_vm._v("edit")])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("thead", [_c("th", [_vm._v("Jenis Pekerjaan")]), _vm._v(" "), _c("th", [_vm._v("Lokasi")]), _vm._v(" "), _c("th", [_vm._v("Jumlah")]), _vm._v(" "), _c("th", [_vm._v("Satuan")]), _vm._v(" "), _c("th", [_vm._v("Harga")]), _vm._v(" "), _c("th", [_vm._v("Ket")])]);
}];
render._withStripped = true;


/***/ }),

/***/ "./resources/adminapp/js/cruds/Orders/Edit.vue":
/*!*****************************************************!*\
  !*** ./resources/adminapp/js/cruds/Orders/Edit.vue ***!
  \*****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Edit_vue_vue_type_template_id_b869a3ee___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Edit.vue?vue&type=template&id=b869a3ee& */ "./resources/adminapp/js/cruds/Orders/Edit.vue?vue&type=template&id=b869a3ee&");
/* harmony import */ var _Edit_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Edit.vue?vue&type=script&lang=js& */ "./resources/adminapp/js/cruds/Orders/Edit.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _Edit_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _Edit_vue_vue_type_template_id_b869a3ee___WEBPACK_IMPORTED_MODULE_0__["render"],
  _Edit_vue_vue_type_template_id_b869a3ee___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/adminapp/js/cruds/Orders/Edit.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/adminapp/js/cruds/Orders/Edit.vue?vue&type=script&lang=js&":
/*!******************************************************************************!*\
  !*** ./resources/adminapp/js/cruds/Orders/Edit.vue?vue&type=script&lang=js& ***!
  \******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./Edit.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/adminapp/js/cruds/Orders/Edit.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/adminapp/js/cruds/Orders/Edit.vue?vue&type=template&id=b869a3ee&":
/*!************************************************************************************!*\
  !*** ./resources/adminapp/js/cruds/Orders/Edit.vue?vue&type=template&id=b869a3ee& ***!
  \************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_template_id_b869a3ee___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../node_modules/vue-loader/lib??vue-loader-options!./Edit.vue?vue&type=template&id=b869a3ee& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/adminapp/js/cruds/Orders/Edit.vue?vue&type=template&id=b869a3ee&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_template_id_b869a3ee___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_template_id_b869a3ee___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);