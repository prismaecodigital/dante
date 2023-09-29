<template>
  <div>
    <vue-dropzone
      :id="uid"
      :ref="uid"
      :options="options"
      :use-custom-slot="true"
      @vdropzone-file-added="addTmpFile"
      @vdropzone-upload-progress="uploadProgress"
      @vdropzone-success="success"
      @vdropzone-error="error"
      @vdropzone-thumbnail="updateDataUrl"
    >
      <div class="dropzone-container" v-show="!hasFiles">
        <div class="file-selector">
          <button type="button" class="btn btn-azure">
            Browse
          </button>
        </div>
      </div>

      <div class="file-preview-container" v-show="hasFiles">
        <button type="button" class="btn btn-azure">
          Browse
        </button>
        <component
          :is="previewComponent"
          :key="childKey"
          :tmp-attachments="tmpAttachments"
          :attachments="media"
          @tmp-file-removed="handleTmpFileRemoved"
          @file-removed="fileRemoved"
        ></component>
      </div>
    </vue-dropzone>
  </div>
</template>

<script>
import vue2Dropzone from 'vue2-dropzone'
import AttachmentList from './AttachmentList'
import AttachmentPictures from './AttachmentPictures'

export default {
  components: {
    vueDropzone: vue2Dropzone,
    AttachmentList,
    AttachmentPictures
  },
  props: {
    accept: {
      type: String,
      default: null
    },
    component: {
      type: String,
      default: 'list',
      validator: value => {
        return ['list', 'pictures'].indexOf(value) !== -1
      }
    },
    route: {
      type: String,
      required: true
    },
    maxFiles: {
      type: Number,
      default: null
    },
    maxFileSize: {
      type: Number,
      default: 2
    },
    collectionName: {
      type: String,
      required: true
    },
    media: {
      type: Array,
      default: function () {
        return []
      }
    },
    modelId: {
      type: [String, Number],
      default: 0
    }
  },
  data() {
    return {
      hasFiles: false,
      childKey: 1,
      tmpAttachments: [],
      options: {
        url: this.route,
        maxFiles: this.maxFiles,
        maxFilesize: this.maxFileSize,
        acceptedFiles: this.accept,
        thumbnailWidth: 120,
        addRemoveLinks: true,
        timeout: 0,
        params: {
          size: this.maxFileSize,
          collection_name: this.collectionName,
          model_id: this.modelId
        },
        previewsContainer: '.attachment-list-container',
        previewTemplate: '<div class="d-none"></div>',
        headers: {
          'X-XSRF-TOKEN': this.$getCookie('XSRF-TOKEN')
        }
      }
    }
  },
  computed: {
    uid: function () {
      return `dropzone-${this._uid}`
    },
    previewComponent: function () {
      return `attachment-${this.component}`
    }
  },
  watch: {
    tmpAttachments: {
      handler: function () {
        this.hasFiles = this.media.length + this.tmpAttachments.length
      },
      deep: true
    },
    media: {
      handler: function () {
        this.hasFiles = this.media.length + this.tmpAttachments.length
        if (this.maxFiles === null) {
          return
        }
        let dz = this.$refs[this.uid]
        let fo = this.media.filter(item => item.wasRecentlyCreated !== true)
        dz.dropzone.options.maxFiles = this.maxFiles - fo.length
      },
      deep: true
    }
  },
  methods: {
    addTmpFile(file) {
      let attachment = {}
      attachment.uuid = file.upload.uuid
      attachment.id = null
      attachment.file_name = file.name
      attachment.size = file.size
      attachment.progress = null
      attachment.errorMsg = null
      attachment.o = file
      attachment.preview_thumbnail = null
      this.tmpAttachments.push(attachment)
    },
    uploadProgress(file, progress, bytesSent) {
      this.tmpAttachments.map(attachment => {
        if (attachment.uuid === file.upload.uuid) {
          attachment.progress = `${Math.floor(progress)}`
        }
      })
    },
    success(file, response) {
      let model = response
      model.wasRecentlyCreated = true

      this.fileUploaded(model)
    },
    error(file, message, xhr) {
      this.tmpAttachments.map(attachment => {
        if (attachment.uuid === file.upload.uuid) {
          attachment.errorMsg = message
        }
      })
    },
    handleTmpFileRemoved(file) {
      console.log(file)
      if (_.includes(['canceled', 'error'], file.o.status)) {
        this.removeTmpFile(file)
        return
      }

      if (file.o.status === 'uploading') {
        this.$refs[this.uid].removeFile(file.o)

        return
      }

      if (file.o.status === 'success') {
        this.removeTmpFile(file)
        this.fileRemoved(file)
        this.$refs[this.uid].removeFile(file.o)

        return
      }

      if (file.o.status === 'queued') {
        this.cancelQueuedFile(file)
        this.$refs[this.uid].removeFile(file.o)

        return
      }
    },
    removeTmpFile(file) {
      this.tmpAttachments = this.tmpAttachments.filter(attachment => {
        return attachment.uuid !== file.o.upload.uuid
      })
    },
    cancelQueuedFile(file) {
      this.tmpAttachments.map(attachment => {
        if (attachment.uuid === file.o.upload.uuid) {
          attachment.o.status = 'canceled'
          attachment.errorMsg = 'Upload canceled.'
        }
      })
    },
    updateDataUrl(file, dataURL) {
      this.tmpAttachments.map(attachment => {
        if (attachment.uuid === file.upload.uuid) {
          attachment.preview_thumbnail = dataURL
        }
      })
    },
    fileRemoved(file) {
      this.$emit('file-removed', file)
    },
    fileUploaded(file) {
      this.$emit('file-uploaded', file)
    }
  }
}
</script>

<style scoped>
.separator {
  position: relative;
  width: 130px;
  margin: 0 auto 16px;
}

.separator:before {
  position: absolute;
  content: '';
  height: 1px;
  width: 100px;
  background: #d8d8d8;
  top: 50%;
  left: 0;
  transform: translate(-50%, -50%);
}

.separator:after {
  position: absolute;
  content: '';
  height: 1px;
  width: 100px;
  background: #d8d8d8;
  top: 50%;
  left: 130px;
  transform: translate(-50%, -50%);
}

.file-preview-container {
  text-align: left;
}

.dropzone-container {
  margin: 2em 0;
}
</style>