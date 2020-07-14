<template>
  <div id="case_data" role="tablist">
    <b-form @submit.prevent="send()">
      <b-card
        v-for="section in fieldsConfig"
        :key="section.name"
        :tag="section.type"
        no-body
        class="border-0 mb-4"
      >
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-button
            block
            v-b-toggle="section.name"
            :variant="section.name === '3' && fieldsModels['31'] === true ? 'success' : section.name === '3' && fieldsModels['31'] === false ? 'danger' : 'secondary'"
            class="position-relative d-flex justify-content-between align-items-center p-0"
            style="min-height: 32px"
          >
            <p style="z-index:1" class="text-left mb-0 pl-3" v-text="section.title"></p>
            <b-progress
              v-if="progress[section.name] && section.name !== '3'"
              :value="progress[section.name].count"
              :max="progress[section.name].max"
              :variant="
                (progress[section.name].count / progress[section.name].max * 100) > 85 ? 'success':
                (progress[section.name].count / progress[section.name].max) > 1 || (progress[section.name].count / progress[section.name].max) <= 85 ? 'warning' :
                'secondary'
              "
              :class="[
                {'bg-success': section.name === '3' && fieldsModels['31'] === true},
                {'bg-danger': section.name === '3' && fieldsModels['31'] === false},
                'bg-secondary',
                'position-absolute',
                'w-100',
                'h-100'
              ]"
            ></b-progress>
            <p
              class="mb-0 pr-3 py-1"
              style="z-index:1"
            >
              <span
                v-if="progress[section.name] && progress[section.name] != '3'"
                v-text="`${(progress[section.name].count / progress[section.name].max * 100).toFixed(0)} %`"
              ></span>
              <span class="when-closed">
                <b-icon icon="chevron-down" class="ml-3"></b-icon>
              </span>
              <span class="when-open">
                <b-icon icon="chevron-up" class="ml-3"></b-icon>
              </span>
            </p>
          </b-button>
        </b-card-header>
        <b-collapse
          :id="section.name"
          accordion="my-accordion"
          role="tabpanel"
        >
          <b-card-body>
            <b-row>
              <b-col
                v-for="field in section.children"
                :key="field.name"
                class="mb-3"
                cols="12"
                :md="field.children ? '12' : field.name === 'title' || field.name === 'birth_date' ? '4' :
                  field.name === 'fname' || field.name === 'birth_place' ? '8' :
                  field.name === 'address' ? '12' :
                  '6'"
              >
                <div v-if="field.children">
                  <h5 class="text-left font-weight-bold" v-text="field.title"></h5>
                  <b-row>
                    <b-col
                      v-for="subfield in field.children"
                      :class="[{'text-left': subfield.type === 'checkbox'}, 'mb-3']"
                      :key="subfield.name"
                      cols="12"
                      md="6"
                    >
                      <template v-if="subfield.type === 'date'">
                        <label class="d-block text-left text-secondary" :for="subfield.name" v-text="subfield.title"></label>
                        <b-form-datepicker
                          v-model="fieldsModels[subfield.name]"
                          locale="en"
                        ></b-form-datepicker>
                      </template>
                      <template v-else-if="subfield.type === 'yes_no'">
                        <b-row no-gutters>
                          <b-col class="text-left text-secondary mb-3" cols="6">
                            <span>{{ subfield.title }}</span>
                          </b-col>
                          <b-col class="mb-3" cols="6">
                            <b-form-radio-group
                              :id="`field-${subfield.name}`"
                              v-model="fieldsModels[subfield.name]"
                              :options="options"
                            ></b-form-radio-group>
                          </b-col>
                        </b-row>
                      </template>
                      <template v-else-if="subfield.type === 'file'">
                        <label class="d-block text-left text-secondary" :for="subfield.name" v-text="subfield.title"></label>
                        <b-form-file
                          :id="`field-${subfield.name}`"
                          placeholder="Choose a file or drop it here..."
                          drop-placeholder="Drop file here..."
                          @change="handleFile(subfield.name)"
                          :disabled="!!fieldsModels[subfield.name]"
                          class="text-left"
                        >
                        </b-form-file>
                        <div v-if="fieldsModels[subfield.name] && fieldsModels[subfield.name].name" class="d-flex justify-content-between align-items-center mt-2">
                          <a
                            target="_blank"
                            :href="fieldsModels[subfield.name].href"
                          >
                            <i v-b-tooltip.hover :title="fieldsModels[subfield.name].name" class="d-sm-none">{{fieldsModels[subfield.name].name.substring(0, 18) + '...' + fieldsModels[subfield.name].name.substring(fieldsModels[subfield.name].name.length - 4, fieldsModels[subfield.name].name.length)}}</i>
                            <i v-b-tooltip.hover :title="fieldsModels[subfield.name].name" class="d-none d-sm-inline-block d-md-none">{{fieldsModels[subfield.name].name.length &gt; 24 ? fieldsModels[subfield.name].name.substring(0, 24) + '...' + fieldsModels[subfield.name].name.substring(fieldsModels[subfield.name].name.length - 4, fieldsModels[subfield.name].name.length) : fieldsModels[subfield.name].name}}</i>
                            <i v-b-tooltip.hover :title="fieldsModels[subfield.name].name" class="d-none d-md-inline-block d-lg-none">{{fieldsModels[subfield.name].name.length &gt; 14 ? fieldsModels[subfield.name].name.substring(0, 14) + '...' + fieldsModels[subfield.name].name.substring(fieldsModels[subfield.name].name.length - 4, fieldsModels[subfield.name].name.length) : fieldsModels[subfield.name].name}}</i>
                            <i v-b-tooltip.hover :title="fieldsModels[subfield.name].name" class="d-none d-lg-inline-block d-xl-none">{{fieldsModels[subfield.name].name.length &gt; 32 ? fieldsModels[subfield.name].name.substring(0, 32) + '...' + fieldsModels[subfield.name].name.substring(fieldsModels[subfield.name].name.length - 4, fieldsModels[subfield.name].name.length) : fieldsModels[subfield.name].name}}</i>
                            <i v-b-tooltip.hover :title="fieldsModels[subfield.name].name" class="d-none d-xl-inline-block">{{fieldsModels[subfield.name].name.length &lt; 28 ? fieldsModels[subfield.name].name.substring(0, 28) + '...' + fieldsModels[subfield.name].name.substring(fieldsModels[subfield.name].name.length - 4, fieldsModels[subfield.name].name.length) : fieldsModels[subfield.name].name}}</i>
                            <!-- <i v-if="fieldsModels[subfield.name] && fieldsModels[subfield.name].size">
                              ({{(fieldsModels[subfield.name].size &lt; 1048576 ? fieldsModels[subfield.name].size / 1024 : fieldsModels[subfield.name].size / 1048576).toFixed(2)}} {{fieldsModels[subfield.name].size &lt; 1048576 ? 'KB' : 'MB'}})
                            </i> -->
                          </a>
                          <!-- <b-button
                            variant="danger"
                            class="ml-2"
                            @click="deleteFile(subfield.name)"
                            size="sm"
                            v-b-tooltip.hover
                            title="Delete file"
                          >
                            <b-icon icon="x"></b-icon>
                          </b-button> -->
                          <b-button
                            variant="danger"
                            class="ml-2"
                            @click="deleteModal(subfield.name)"
                            size="sm"
                            v-b-tooltip.hover
                            title="Delete file"
                          >
                            <b-icon icon="x"></b-icon>
                          </b-button>
                        </div>
                      </template>
                      <template v-else-if="subfield.type === 'file_multiple'">
                        <label class="d-block text-left text-secondary" :for="subfield.name" v-text="subfield.title"></label>
                        <b-form-file
                          :id="`field-${subfield.name}`"
                          placeholder="Choose a file or drop it here..."
                          drop-placeholder="Drop file here..."
                          @change="handleFiles(subfield.name)"
                          class="text-left"
                          multiple
                        >
                        </b-form-file>
                        <div v-if="fieldsModels[subfield.name]">
                          <p class="d-flex justify-content-between align-items-center mt-2" v-for="file in fieldsModels[subfield.name]" :key="file.href">
                            <a
                              v-if="file.name"
                              target="_blank"
                              :href="file.href"
                            >
                              <i v-b-tooltip.hover :title="file.name" class="d-sm-none">{{file.name.substring(0, 18) + '...' + file.name.substring(file.name.length - 4, file.name.length)}}</i>
                              <i v-b-tooltip.hover :title="file.name" class="d-none d-sm-inline-block d-md-none">{{file.name.length &gt; 24 ? file.name.substring(0, 24) + '...' + file.name.substring(file.name.length - 4, file.name.length) : file.name}}</i>
                              <i v-b-tooltip.hover :title="file.name" class="d-none d-md-inline-block d-lg-none">{{file.name.length &gt; 14 ? file.name.substring(0, 14) + '...' + file.name.substring(file.name.length - 4, file.name.length) : file.name}}</i>
                              <i v-b-tooltip.hover :title="file.name" class="d-none d-lg-inline-block d-xl-none">{{file.name.length &gt; 32 ? file.name.substring(0, 32) + '...' + file.name.substring(file.name.length - 4, file.name.length) : file.name}}</i>
                              <i v-b-tooltip.hover :title="file.name" class="d-none d-xl-inline-block">{{file.name.length &lt; 28 ? file.name.substring(0, 28) + '...' + file.name.substring(file.name.length - 4, file.name.length) : file.name}}</i>
                              <!-- <i v-if="fieldsModels[subfield.name] && fieldsModels[subfield.name].size">
                                ({{(fieldsModels[subfield.name].size &lt; 1048576 ? fieldsModels[subfield.name].size / 1024 : fieldsModels[subfield.name].size / 1048576).toFixed(2)}} {{fieldsModels[field.name].size &lt; 1048576 ? 'KB' : 'MB'}})
                              </i> -->
                            </a>
                            <b-button
                              variant="danger"
                              class="ml-2"
                              @click="deleteModal(file)"
                              size="sm"
                              v-b-tooltip.hover
                              title="Delete file"
                            >
                              <b-icon icon="x"></b-icon>
                            </b-button>
                          </p>
                        </div>
                      </template>
                      <template v-else-if="subfield.type === 'bigtext'">
                        <label class="d-block text-left text-secondary" :for="subfield.name" v-text="subfield.title"></label>
                        <b-form-textarea
                          :id="`field-${subfield.name}`"
                          v-model="fieldsModels[subfield.name]"
                          rows="3"
                          max-rows="6"
                        ></b-form-textarea>
                      </template>
                      <template v-else-if="subfield.type === 'checkbox'">
                        <label class="d-block text-left text-secondary" :for="subfield.name" v-text="subfield.title"></label>
                        <b-form-checkbox-group v-model="fieldsModels[subfield.name]">
                          <b-form-checkbox v-for="option in apiOptions[subfield.name]" :key="option.id" :value="option.title">
                            {{ option.title }}
                          </b-form-checkbox>
                        </b-form-checkbox-group>
                      </template>
                      <template v-else-if="subfield.type === 'select'">
                        <label class="d-block text-left text-secondary" :for="subfield.name" v-text="subfield.title"></label>
                        <b-form-select
                          text-field="title"
                          value-field="title"
                          :options="apiOptions[subfield.name]"
                          v-model="fieldsModels[subfield.name]"
                        >
                          <template v-slot:first>
                            <b-form-select-option :value="null">-- Please select an option --</b-form-select-option>
                          </template>
                        </b-form-select>
                      </template>
                      <template v-else>
                        <label class="d-block text-left text-secondary" :for="subfield.name" v-text="subfield.title"></label>
                        <b-form-input
                          :id="subfield.name"
                          :type="subfield.type"
                          v-model="fieldsModels[subfield.name]"
                        />
                      </template>
                    </b-col>
                  </b-row>
                </div>
                <div v-else>
                  <template v-if="field.type === 'date'">
                    <label class="d-block text-left text-secondary" :for="field.name" v-text="field.title"></label>
                    <b-form-datepicker
                      v-model="fieldsModels[field.name]"
                      locale="en"
                    ></b-form-datepicker>
                  </template>
                  <template v-else-if="field.type === 'yes_no'">
                    <b-row no-gutters>
                      <b-col class="text-left text-secondary mb-3" cols="6">
                        <span>{{ field.title }}</span>
                      </b-col>
                      <b-col class="mb-3" cols="6">
                        <b-form-radio-group
                          :id="`field-${field.name}`"
                          v-model="fieldsModels[field.name]"
                          :options="options"
                        ></b-form-radio-group>
                      </b-col>
                    </b-row>
                  </template>
                  <template v-else-if="field.type === 'file'">
                    <label class="d-block text-left text-secondary" :for="field.name" v-text="field.title"></label>
                    <b-form-file
                      :id="`field-${field.name}`"
                      placeholder="Choose a file or drop it here..."
                      drop-placeholder="Drop file here..."
                      @change="handleFile(field.name)"
                      :disabled="!!fieldsModels[field.name]"
                      class="text-left"
                    >
                    </b-form-file>
                    <div v-if="fieldsModels[field.name] && fieldsModels[field.name].name" class="d-flex justify-content-between align-items-center mt-2">
                      <a
                        target="_blank"
                        :href="fieldsModels[field.name].href"
                      >
                        <i v-b-tooltip.hover :title="fieldsModels[field.name].name" class="d-sm-none">{{fieldsModels[field.name].name.substring(0, 18) + '...' + fieldsModels[field.name].name.substring(fieldsModels[field.name].name.length - 4, fieldsModels[field.name].name.length)}}</i>
                        <i v-b-tooltip.hover :title="fieldsModels[field.name].name" class="d-none d-sm-inline-block d-md-none">{{fieldsModels[field.name].name.length &gt; 24 ? fieldsModels[field.name].name.substring(0, 24) + '...' + fieldsModels[field.name].name.substring(fieldsModels[field.name].name.length - 4, fieldsModels[field.name].name.length) : fieldsModels[field.name].name}}</i>
                        <i v-b-tooltip.hover :title="fieldsModels[field.name].name" class="d-none d-md-inline-block d-lg-none">{{fieldsModels[field.name].name.length &gt; 14 ? fieldsModels[field.name].name.substring(0, 14) + '...' + fieldsModels[field.name].name.substring(fieldsModels[field.name].name.length - 4, fieldsModels[field.name].name.length) : fieldsModels[field.name].name}}</i>
                        <i v-b-tooltip.hover :title="fieldsModels[field.name].name" class="d-none d-lg-inline-block d-xl-none">{{fieldsModels[field.name].name.length &gt; 32 ? fieldsModels[field.name].name.substring(0, 32) + '...' + fieldsModels[field.name].name.substring(fieldsModels[field.name].name.length - 4, fieldsModels[field.name].name.length) : fieldsModels[field.name].name}}</i>
                        <i v-b-tooltip.hover :title="fieldsModels[field.name].name" class="d-none d-xl-inline-block">{{fieldsModels[field.name].name.length &lt; 28 ? fieldsModels[field.name].name.substring(0, 28) + '...' + fieldsModels[field.name].name.substring(fieldsModels[field.name].name.length - 4, fieldsModels[field.name].name.length) : fieldsModels[field.name].name}}</i>
                        <!-- <i v-if="fieldsModels[field.name] && fieldsModels[field.name].size">
                          ({{(fieldsModels[field.name].size &lt; 1048576 ? fieldsModels[field.name].size / 1024 : fieldsModels[field.name].size / 1048576).toFixed(2)}} {{fieldsModels[field.name].size &lt; 1048576 ? 'KB' : 'MB'}})
                        </i> -->
                      </a>
                      <b-button
                        variant="danger"
                        class="ml-2"
                        @click="deleteModal(fieldsModels[field.name])"
                        size="sm"
                        v-b-tooltip.hover
                        title="Delete file"
                      >
                        <b-icon icon="x"></b-icon>
                      </b-button>
                    </div>
                  </template>
                  <template v-else-if="field.type === 'file_multiple'">
                    <label class="d-block text-left text-secondary" :for="field.name" v-text="field.title"></label>
                    <b-form-file
                      :id="`field-${field.name}`"
                      placeholder="Choose a file or drop it here..."
                      drop-placeholder="Drop file here..."
                      @change="handleFiles(field.name)"
                      class="text-left"
                      multiple
                    >
                    </b-form-file>
                    <div v-if="fieldsModels[field.name]">
                      <p class="d-flex justify-content-between align-items-center mt-2" v-for="file in fieldsModels[field.name]" :key="file.href">
                        <a
                          v-if="file"
                          target="_blank"
                          :href="file.href"
                        >
                          <i v-b-tooltip.hover :title="file.name" class="d-sm-none">{{file.name.substring(0, 18) + '...' + file.name.substring(file.name.length - 4, file.name.length)}}</i>
                          <i v-b-tooltip.hover :title="file.name" class="d-none d-sm-inline-block d-md-none">{{file.name.length &gt; 24 ? file.name.substring(0, 24) + '...' + file.name.substring(file.name.length - 4, file.name.length) : file.name}}</i>
                          <i v-b-tooltip.hover :title="file.name" class="d-none d-md-inline-block d-lg-none">{{file.name.length &gt; 14 ? file.name.substring(0, 14) + '...' + file.name.substring(file.name.length - 4, file.name.length) : file.name}}</i>
                          <i v-b-tooltip.hover :title="file.name" class="d-none d-lg-inline-block d-xl-none">{{file.name.length &gt; 32 ? file.name.substring(0, 32) + '...' + file.name.substring(file.name.length - 4, file.name.length) : file.name}}</i>
                          <i v-b-tooltip.hover :title="file.name" class="d-none d-xl-inline-block">{{file.name.length &lt; 28 ? file.name.substring(0, 28) + '...' + file.name.substring(file.name.length - 4, file.name.length) : file.name}}</i>
                          <!-- <i v-if="fieldsModels[field.name] && fieldsModels[field.name].size">
                            ({{(fieldsModels[field.name].size &lt; 1048576 ? fieldsModels[field.name].size / 1024 : fieldsModels[field.name].size / 1048576).toFixed(2)}} {{fieldsModels[field.name].size &lt; 1048576 ? 'KB' : 'MB'}})
                          </i> -->
                        </a>
                        <b-button
                          variant="danger"
                          class="ml-2"
                          @click="deleteModal(file)"
                          size="sm"
                          v-b-tooltip.hover
                          title="Delete file"
                        >
                          <b-icon icon="x"></b-icon>
                        </b-button>
                      </p>
                    </div>
                  </template>
                  <template v-else-if="field.type === 'bigtext'">
                    <label class="d-block text-left text-secondary" :for="field.name" v-text="field.title"></label>
                    <b-form-textarea
                      v-model="fieldsModels[field.name]"
                      rows="3"
                      max-rows="6"
                    ></b-form-textarea>
                  </template>
                  <template v-else-if="field.type === 'checkbox'">
                    <label class="d-block text-left text-secondary" :for="field.name" v-text="field.title"></label>
                    <b-form-checkbox-group v-model="fieldsModels[field.name]">
                      <b-form-checkbox v-for="option in apiOptions[field.name]" :key="option.id" :value="option.title">
                        {{ option.title }}
                      </b-form-checkbox>
                    </b-form-checkbox-group>
                  </template>
                  <template v-else-if="field.type === 'select'">
                    <label class="d-block text-left text-secondary" :for="field.name" v-text="field.title"></label>
                    <b-form-select
                      text-field="title"
                      value-field="title"
                      :options="apiOptions[field.name]"
                      v-model="fieldsModels[field.name]"
                    >
                      <template v-slot:first>
                        <b-form-select-option :value="null">-- Please select an option --</b-form-select-option>
                      </template>
                    </b-form-select>
                  </template>
                  <template v-else>
                    <label class="d-block text-left text-secondary" :for="field.name" v-text="field.title"></label>
                    <b-form-input
                      :type="field.type"
                      v-model="fieldsModels[field.name]"
                    />
                    {{fieldsModels[field.name]}}
                  </template>
                </div>
              </b-col>
            </b-row>
          </b-card-body>
        </b-collapse>
      </b-card>
      <b-button
        type="submit"
        :variant="sent ? 'success' : sendingError ? 'danger' : 'secondary'"
        size="lg"
        class="mt-4"
        v-show="!loading"
        :disabled="sending || sent || sendingError"
      >
        <span v-if="sending">
          <b-spinner label="Saving data..."></b-spinner>
        </span>
        <span v-else-if="sent">
          <b-icon icon="check" font-scale="2"></b-icon>
        </span>
        <span v-else-if="sendingError">
          <b-icon icon="x-circle-fill" font-scale="2"></b-icon>
        </span>
        <span v-else>
          Save
        </span>
      </b-button>
      <p class="text-danger" v-text="errorMessage" />
    </b-form>
    <b-modal v-model="isDeleteModal" centered>
      <h4 class="text-center text-danger">Are you sure you want to delete the file?</h4>
      <template v-slot:modal-footer>
        <b-button variant="secondary" @click="isDeleteModal = !isDeleteModal">
          Cancel
        </b-button>
        <b-button variant="danger" @click="[deleteFiles(fileToDelete), fileToDelete={}, isDeleteModal = !isDeleteModal]">
          Yes
        </b-button>
        {{fileToDelete}}
      </template>
    </b-modal>
    <b-modal v-model="isUploadModal" centered>
      <h4 class="text-center text-danger">Files to upload</h4>
      <ul>
        <li v-for="file in filesToUpload" :key="file.name">
          {{file.name}}
        </li>
      </ul>
      <template v-slot:modal-footer>
        <b-button variant="secondary" @click="[filesToUpload = [], loading = false, isUploadModal = !isUploadModal]">
          Cancel
        </b-button>
        <b-button variant="primary" @click="[uploadFiles(fieldToUpload, filesToUpload), filesToUpload = [], isUploadModal = !isUploadModal]">
          Yes
        </b-button>
      </template>
    </b-modal>
    <div v-if="loading" class="loading">
      <b-spinner style="width: 4rem; height: 4rem; margin-top: 80px" variant="secondary"></b-spinner>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  data: () => ({
    fieldsConfig: {},
    fieldsModels: {},
    options: [
      { text: "Yes", value: true },
      { text: "No", value: false },
      { text: "", value: '' }
    ],
    apiOptions: {},
    urlParams: {},
    loading: true,
    sending: false,
    sent: false,
    sendingError: false,
    errorMessage: '',
    progress: {},
    parsedData: {},
    files: {},
    dataToSend: {},
    isDeleteModal: false,
    isUploadModal: false,
    fileToDelete: '',
    filesToUpload: [],
    fieldToUpload: '',
    fileToDeleteParams: {}
  }),
  methods: {
    init () {
      // const url = (window.location != window.parent.location)
      //   ? document.referrer
      //   : document.location.href
      const url = 'https://job-server.net/js/case_data/?sid=wconen&applicant_id=25877'
      this.getParams(url)
      this.getFields(`/casedata?a=init&sid=wconen&applicant_id=${this.urlParams.applicant_id}`)
    },
    getParams (applicantUrl) {
      var params = {}
      var parser = document.createElement('a')
      parser.href = applicantUrl
      var query = parser.search.substring(1)
      var vars = query.split('&')
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=')
        params[pair[0]] = decodeURIComponent(pair[1])
      }
      this.urlParams = params;
    },
    getFields(url) {
      this.$axios({
        url: url,
        method: "GET",
        headers: {
          Authorization: "Basic " + window.btoa("test:pkotest9000"),
          "Content-Type": "application/json"
        }
      }).then(res => {
        this.fieldsConfig = res.data.fields;
        for (let item in this.fieldsConfig) {
          this.parsedData[this.fieldsConfig[item].name] = {}
          if (this.fieldsConfig[item].children) {
            for (let child in this.fieldsConfig[item].children) {
              if (this.fieldsConfig[item].children[child].options) {
                this.apiOptions[this.fieldsConfig[item].children[child].name] = this.fieldsConfig[item].children[child].options
              }
              if (this.fieldsConfig[item].children[child].children) {
                for (let subchild in this.fieldsConfig[item].children[child].children) {
                  if (this.fieldsConfig[item].children[child].children[subchild].options) {
                    this.apiOptions[this.fieldsConfig[item].children[child].children[subchild].name] = this.fieldsConfig[item].children[child].children[subchild].options
                  }
                  this.fieldsModels[this.fieldsConfig[item].children[child].children[subchild].name] = null
                  this.parsedData[this.fieldsConfig[item].name][this.fieldsConfig[item].children[child].children[subchild].name] = null
                }
              } else {
                this.fieldsModels[this.fieldsConfig[item].children[child].name] = null
                this.parsedData[this.fieldsConfig[item].name][this.fieldsConfig[item].children[child].name] = null
              }
            }
          } else {
            this.fieldsModels[this.fieldsConfig[item].name] = null
            this.parsedData[this.fieldsConfig[item].name] = null
          }
        }
        this.get(`/casedata?a=get&sid=wconen&applicant_id=${this.urlParams.applicant_id}`)
      });
    },
    get(url) {
      this.$axios({
        url: url,
        method: "GET",
        headers: {
          Authorization: "Basic " + window.btoa("test:pkotest9000"),
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          for (let source in this.fieldsModels) {
            if (source in res.data) {
              this.fieldsModels[source] = res.data[source]
            } else {
              this.fieldsModels[source] = null
            }
            for (let section in this.parsedData) {
              let count = 0
              this.progress[section] = {}
              for (let prop in this.parsedData[section]) {
                if (prop === source) {
                  this.parsedData[section][prop] = res.data[source]
                }
                if (this.parsedData[section][prop] || this.parsedData[section][prop] === false) count ++
              }
              this.progress[section].count = count
              this.progress[section].max = Object.keys(this.parsedData[section]).length
            }
          }
          this.$forceUpdate()
          this.loading = false
        })
        .catch(err => console.log(err))
    },
    send() {
      this.sending = true
      const bodyFormData = new FormData()
      for (let item in this.fieldsModels) {
        if ((this.fieldsModels[item] || this.fieldsModels[item] === false || this.fieldsModels[item] === '') && !this.fieldsModels[item].href) {
          this.dataToSend[item] = this.fieldsModels[item]
        }
      }
      bodyFormData.set("data", JSON.stringify(this.dataToSend))
      this.$axios({
        url: `/casedata?a=save&sid=wconen&applicant_id=${this.urlParams.applicant_id}`,
        method: "POST",
        headers: {
          Authorization: "Basic " + window.btoa("test:pkotest9000"),
          "Content-Type": "multipart/form-data"
        },
        data: bodyFormData
      }).then(() => {
        this.sending = false
        this.sent = true
        this.get(`/casedata?a=get&sid=wconen&applicant_id=${this.urlParams.applicant_id}`)
        setTimeout(() => {
          this.sent = false
        }, 3000)
      }).catch(err => {
        this.sendingError = true
        this.errorMessage = err
        setTimeout(() => {
          this.sendingError = false
        }, 3000)
      })
    },
    handleFile(name) {
      this.loading = true;
      return new Promise(resolve => {
        let element = document.querySelector(`#field-${name}`)
        let file = element.files[0]
        if (file) {
          this.files[name] = { name: file.name, size: file.size, seen: false }
          const fr = new FileReader()
          fr.onload = function(event) {
            resolve(event.target.result)
          }
          fr.readAsDataURL(file)
        } else {
          this.loading = false
        }
        element.value = ''
      }).then(res => {
        let content = res.split(',')
        this.fieldsModels[name] = content[1]
        this.uploadFile(name, this.fieldsModels[name])
      })
    },
    handleFiles(name) {
      this.loading = true;
      let element = document.querySelector(`#field-${name}`)
      let files = element.files
      if (files) {
        files.forEach(el => {
          this.files[name] = { name: el.name, size: el.size, seen: false }
          return new Promise (resolve => {
            const fr = new FileReader()
            fr.onload = function(event) {
              resolve(event.target.result)
            }
            fr.readAsDataURL(el)
          }).then(res => {
            const content = res.split(',')
            this.filesToUpload.push({name: el.name, data: content[1]})
          })
        })
      }
      element.value = ''
      this.uploadModal(name)
    },
    uploadFile(field, file) {
      this.loading = true;
      this.sending = true
      const fileData = new FormData()
      fileData.set("data", JSON.stringify({[field]: { name: this.files[field].name, data: file }}))
      this.$axios({
        url: `/casedata?a=save&sid=wconen&applicant_id=${this.urlParams.applicant_id}`,
        method: "POST",
        headers: {
          Authorization: "Basic " + window.btoa("test:pkotest9000"),
          "Content-Type": "multipart/form-data"
        },
        data: fileData
      }).then(() => {
        this.sending = false
        this.sent = true
        
        this.$axios({
            url: `/casedata?a=get&sid=wconen&applicant_id=${this.urlParams.applicant_id}`,
            method: "GET",
            headers: {
              Authorization: "Basic " + window.btoa("test:pkotest9000"),
              "Content-Type": "application/json"
            }
          })
            .then(res => {
              for (let source in res.data) {
                if (res.data[source] && res.data[source].href) {
                  this.fieldsModels[source] = res.data[source]
                }
              }
              this.loading = false
            })
            .catch(err => console.log(err))
        setTimeout(() => {
          this.sent = false
        }, 3000)
      }).catch(err => {
        this.sendingError = true
        this.errorMessage = err
        setTimeout(() => {
          this.sendingError = false
        }, 3000)
      })
    },
    uploadFiles(field, files) {
      this.loading = true;
      this.sending = true
      files.forEach(el => {
        const fileData = new FormData()
        fileData.set("data", JSON.stringify({[field]: { name: el.name, data: el.data }}))
        this.$axios({
          url: `/casedata?a=save&sid=wconen&applicant_id=${this.urlParams.applicant_id}`,
          method: "POST",
          headers: {
            Authorization: "Basic " + window.btoa("test:pkotest9000"),
            "Content-Type": "multipart/form-data"
          },
          data: fileData
        }).then(() => {
          this.sending = false
          this.sent = true

          this.$axios({
            url: `/casedata?a=get&sid=wconen&applicant_id=${this.urlParams.applicant_id}`,
            method: "GET",
            headers: {
              Authorization: "Basic " + window.btoa("test:pkotest9000"),
              "Content-Type": "application/json"
            }
          })
            .then(res => {
              for (let source in this.fieldsModels) {
                if (res.data[source] && Array.isArray(res.data[source])) {
                  this.fieldsModels[source] = res.data[source]
                }
              }
              this.loading = false
            })
            .catch(err => console.log(err))
          setTimeout(() => {
            this.sent = false
          }, 2000)
        }).catch(err => {
          this.sendingError = true
          this.errorMessage = err
          setTimeout(() => {
            this.sendingError = false
          }, 2000)
        })
      })
    },
    uploadModal(field) {
      this.fieldToUpload = field
      this.isUploadModal = true
    },
    deleteModal(field) {
      this.fileToDelete = field
      this.isDeleteModal = true
    },
    deleteFiles(field) {
      var params = {}
      var parser = document.createElement('a')
      parser.href = field.href
      var query = parser.search.substring(1)
      var vars = query.split('&')
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=')
        params[pair[0]] = decodeURIComponent(pair[1])
      }
      this.loading = true;
      this.sending = true
      this.$axios({
        url: `/casedata?a=delete_file&sid=wconen&id=${params.id}`,
        method: "POST",
        headers: {
          Authorization: "Basic " + window.btoa("test:pkotest9000"),
          "Content-Type": "application/json"
        }
      }).then(() => {
        this.sending = false
        this.sent = true

        this.$axios({
            url: `/casedata?a=get&sid=wconen&applicant_id=${this.urlParams.applicant_id}`,
            method: "GET",
            headers: {
              Authorization: "Basic " + window.btoa("test:pkotest9000"),
              "Content-Type": "application/json"
            }
          })
            .then(res => {
              for (let source in res.data) {
                this.fieldsModels[source] = res.data[source]
                for (let item in this.fieldsModels) {
                  // this.$forceUpdate()
                  if (Array.isArray(this.fieldsModels[item]) && !res.data[item]) {
                    this.fieldsModels[item] = null
                  }
                }
              }
              console.log(this.fieldsModels)
              this.loading = false
            })
            .catch(err => console.log(err))
        setTimeout(() => {
          this.sent = false
        }, 3000)
      }).catch(err => {
        this.sendingError = true
        this.errorMessage = err
        setTimeout(() => {
          this.sendingError = false
        }, 3000)
      })
    }
  },
  created() {
    this.init()
  }
};
</script>

<style>
#case_data {
  position: relative;
  background-color: #fff;
  margin: 0 auto;
  padding: 15px;
  font-family: Arial, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#case_data .loading {
  position: absolute;
  display: flex;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.6);
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
}
.collapsed .when-open,
.not-collapsed .when-closed {
  display: none;
}
.bv-no-focus-ring {
  display: flex;
}
.file-name {
  word-break: break-all;
}
.input-group-append .btn-secondary {
  background-color: #e9ecef;
  color: #495057;
  border-color: #ced4da;
}
.custom-file label {
  white-space: nowrap;
  overflow: hidden;
}
</style>
