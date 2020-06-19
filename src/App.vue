<template>
  <div id="case_data" role="tablist">
    <!-- <div style="height: 55px; left: 0; right: 0; top: 0; z-index: 1" class="position-fixed d-flex align-items-center bg-white px-3">
      <b-progress :value="count" :max="max" show-progress height="2rem" class="w-100"></b-progress>
    </div> -->
    <b-form @submit.prevent="send()">
      <b-card
        v-for="(section, index) in fieldsConfig"
        :key="section.name"
        :tag="section.type"
        no-body
        class="mb-3"
      >
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-button block v-b-toggle="section.name" variant="secondary" class="text-left">{{ section.title }}</b-button>
        </b-card-header>
        <b-collapse
          :id="section.name"
          accordion="my-accordion"
          :visible="index === 0"
          role="tabpanel"
        >
          <b-card-body>
            <b-row>
              <b-col
                v-for="field in section.children"
                :key="field.name"
                class="mb-3"
                cols="12"
                :sm="field.name === 'title' || field.name === 'birth_date' ? '4' :
                  field.name === 'fname' || field.name === 'birth_place' ? '8' :
                  field.name === 'address' ? '12' :
                  '6'"
              >
                <template v-if="field.type === 'date'">
                  <b-form-datepicker
                    v-model="fieldsModels[field.name]"
                    :placeholder="field.title"
                    locale="en"
                  ></b-form-datepicker>
                </template>
                <template v-else-if="field.type === 'yes_no'">
                  <b-row no-gutters>
                    <b-col class="mb-3" cols="6">
                      <span>{{ field.title }}</span>
                    </b-col>
                    <b-col class="mb-3" cols="6">
                      <b-form-radio-group
                        :id="field.name"
                        v-model="fieldsModels[field.name]"
                        :options="options"
                      ></b-form-radio-group>
                    </b-col>
                  </b-row>
                </template>
                <template v-else-if="field.type === 'file'">
                  <p class="mb-2">{{ field.title }}</p>
                  <b-form-file
                    :id="field.name"
                    placeholder="Choose a file or drop it here..."
                    drop-placeholder="Drop file here..."
                    accept=".pdf"
                    @change="handleFiles(field.name)"
                  ></b-form-file>
                </template>
                <template v-else>
                  <b-form-input
                    :type="field.type"
                    v-model="fieldsModels[field.name]"
                    :placeholder="field.title"
                  />
                </template>
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
        :disabled="sending"
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
      { text: "No", value: false }
    ],
    urlParams: {},
    loading: true,
    sending: false,
    sent: false,
    sendingError: false,
    errorMessage: '',
    count: 0,
    max: 0
  }),
  methods: {
    init () {
      // var url = (window.location != window.parent.location)
      //   ? document.referrer
      //   : document.location.href
      const url = 'https://job-server.net/js/case_data/?sid=wconen&applicant_id=9494858'
      this.getParams(url)
      this.getFields(`/casedata?a=init&sid=wconen&applicant_id=${this.urlParams.applicant_id}`)
    },
    getParams (applicantUrl) {
      var params = {};
      var parser = document.createElement('a');
      parser.href = applicantUrl;
      var query = parser.search.substring(1);
      var vars = query.split('&');
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        params[pair[0]] = decodeURIComponent(pair[1]);
      }
      console.log(params)
      this.urlParams = params;
      console.log(this.urlParams)
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
        this.get(`/casedata?a=get&sid=wconen&applicant_id=${this.urlParams.applicant_id}`);
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
          this.count = 0
          this.max = 0
          for (let source in res.data) {
            this.fieldsModels[source] = res.data[source];
            if (this.fieldsModels[source] || this.fieldsModels[source] === false) this.count++
            this.max++
          }
          this.loading = false;
          console.log(res.data)
        })
        .catch(err => console.log(err));
    },
    send() {
      this.sending = true
      const bodyFormData = new FormData();
      bodyFormData.set("data", JSON.stringify(this.fieldsModels));
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
    handleFiles(name) {
      this.loading = true;
      return new Promise(resolve => {
        const element = document.querySelector(`#${name}`);
        const file = element.files[0];
        const fr = new FileReader();
        fr.onload = function(event) {
          resolve(event.target.result);
        };
        fr.readAsDataURL(file);
      }).then(res => {
        this.fieldsModels[name] = res;
        this.loading = false;
      });
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
</style>
