<template>
  <div id="case_data" class="mt-5" role="tablist">
    <!-- <b-card no-body class="mb-3">
      <b-card-header header-tag="header" class="p-1" role="tab">
        <b-button block v-b-toggle.language_training variant="success">Language Training A1-B1</b-button>
      </b-card-header>
      <b-collapse id="language_training" accordion="my-accordion" role="tabpanel">
        <b-card-body>
          <b-form>
            <b-row>
              <b-col class="mb-3" cols="12" sm="6">
                <b-form-input type="number" v-model.number="batch" placeholder="Batch"></b-form-input>
              </b-col>
              <b-col class="mb-3" cols="12" sm="6">
                <b-form-datepicker
                  v-model="date.exam"
                  placeholder="Date of examination"
                  locale="en"
                ></b-form-datepicker>
              </b-col>
              <b-col class="mb-3" cols="12" sm="6">
                <b-form-datepicker v-model="date.start" placeholder="Starting date" locale="en"></b-form-datepicker>
              </b-col>
              <b-col class="mb-3" cols="12" sm="6">
                <b-form-datepicker
                  v-model="date.projected"
                  placeholder="Projected date"
                  locale="en"
                ></b-form-datepicker>
              </b-col>
            </b-row>
            <b-button type="submit" variant="success mt-4">Save</b-button>
          </b-form>
        </b-card-body>
      </b-collapse>
    </b-card>
    <b-card>
      <b-card-body>{{fields}}</b-card-body>
    </b-card> -->

    <b-card v-for="(section, index) in fieldsConfig" :key="section.name" :tag="section.type" no-body class="mb-3">
      <b-card-header header-tag="header" class="p-1" role="tab">
        <b-button block v-b-toggle="section.name" variant="success">{{ section.title }}</b-button>
      </b-card-header>
      <b-collapse :id="section.name" accordion="my-accordion" :visible="index === 0" role="tabpanel">
        <b-card-body>
          <b-form>
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
                  <b-form-datepicker v-model="fieldsModels[field.name]" :placeholder="field.title" locale="en"></b-form-datepicker>
                </template>
                <template v-else-if="field.type === 'yes_no'">
                  <b-row no-gutters>
                    <b-col class="mb-3" cols="6">
                      <span>{{ field.title }}</span>
                    </b-col>
                    <b-col class="mb-3" cols="6">
                      <b-form-radio-group
                        v-model="fieldsModels[field.name]"
                        :options="field.type === 'contract_cc' ? contractOptions : confirmationOptions"
                      ></b-form-radio-group>
                    </b-col>
                  </b-row>
                </template>
                <template v-else-if="field.type === 'file'">
                  <p class="mb-2">{{ field.title }}</p>
                  <b-form-file
                    v-model="fieldsModels[field.name]"
                    placeholder="Choose a file or drop it here..."
                    drop-placeholder="Drop file here..."
                    accept=".pdf"
                  ></b-form-file>
                </template>
                <template v-else>
                  <b-form-input :type="field.type" v-model="fieldsModels[field.name]" :placeholder="field.title" />
                </template>
                <b>{{fieldsModels[field.name]}}</b>
              </b-col>
            </b-row>
            <b-button type="submit" variant="success mt-4">Save</b-button>
          </b-form>
        </b-card-body>
      </b-collapse>
    </b-card>
  </div>
</template>

<script>
export default {
  name: "App",
  data: () => ({
    fieldsConfig: {},
    fieldsData: {
      recruitment: {}
    },
    fieldsModels: {
      "title": "",
      "fname": "",
      "mname": "",
      "gname": "",
      "birth_date": null,
      "birth_place": "",
      "address": "",
      "address_ph": "",
      "email": "",
      "facebook": "",
      "phone": null,
      "ll_number": "",
      "mobile": "",
      "skype": "",
      "civil_status": "",
      "contract_cc": false,
      "confirmation_dsgvo": false,
      "poea_ereg": null,
      "poea_num": null,
      "batch": null,
      "exam_date": null,
      "start_date": null,
      "proj_date": null,
      "recog_app_form": false,
      "poa_cc": false,
      "lang_cert": null,
      "curr_vitae": false,
      "passport": false,
      "marr_contract": false,
      "birth_cert": null,
      "birth_cert_child": null,
      "school_dipl": null,
      "bsn_dipl": null,
      "transcript": null,
      "related_exp": null,
      "curriculum": null,
      "empl_cert": null,
      "prc_lic": null,
      "prc_cert": null,
      "prc_rating": null,
      "defict_lett": false,
      "defict_hours": null,
      "defict_theory": "",
      "defict_hosp": "",
      "emploer_name": "",
      "employer_addr": "",
      "employer_cont_assist": false,
      "work_hour_assist": null,
      "job_offer": false,
      "work_hour_nurse": null,
      "cc_confirm": false,
      "visa": false,
      "visa_exp": null,
      "visa_appform": false,
      "employer_cont_name": "",
      "employer_cont_email": "",
      "employer_cont_phone": "",
      "travel_insurance": false,
      "medi_cert": false,
      "medi_cert_exp": null,
      "nbi_clear": false,
      "nbi_exp": null,
      "oec_num": "",
      "oec_num_exp": null,
      "e_ticket": false,
      "arriv_date": null,
      "melde_addr": "",
      "melde_stat": false,
      "bank_acc_id": false,
      "steuer_id": false,
      "renten_vn": "",
      "kv_mitglie": false,
      "quit_vors": false,
      "aufenthalt": false,
      "zusatzblatt": false,
      "ablauf": null,
      "measure_ztb": null,
      "measure_zte": null,
      "measure_ot": "",
      "measure_zpb": null,
      "measure_zpe": null,
      "measure_op": "",
      "termin_absch": null,
      "bildungs": false,
      "weiterbild": false,
      "anlage9": false,
      "arztliche": false,
      "arbeit_measure": "",
      "arberit_addr_measure": "",
      "berufsurkunde": false,
      "cc_vert_anerk": null
    },
    // Countries data
    countries: {
      // Alpha-3 ISO standard is used for values
      origin: [
        { value: null, text: "Select country of origin" },
        { value: "PHL", text: "Philippines" },
        { value: "DEU", text: "Germany" }
      ],
      destination: [
        { value: null, text: "Select country of destination" },
        { value: "DEU", text: "Germany" },
        { value: "PHL", text: "Philippines" }
      ]
    },
    countryOfOrigin: null,
    countryOfDestination: null,

    // Recruitment data

    // title: "",
    // name: {
    //   family: "",
    //   middle: "",
    //   given: ""
    // },
    // birth: {
    //   date: null,
    //   place: ""
    // },
    // address: {
    //   ph: "",
    //   current: ""
    // },
    // number: {
    //   phone: "",
    //   landline: "",
    //   mobile: ""
    // },
    // email: "",
    // facebook: "",
    // skype: "",
    // civilStatus: "",
    contractOptions: [
      { text: "Yes", value: true },
      { text: "No", value: false }
    ],
    confirmationOptions: [
      { text: "Yes", value: true },
      { text: "No", value: false }
    ],
    // selectedContract: false,
    // selectedConfirmation: false,
    // POEARegistration: null,
    // POEAPEOSNumber: null,

    // Language Training
    // batch: null,
    // date: {
    //   exam: null,
    //   start: null,
    //   projected: null
    // }
  }),
  methods: {
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
        // this.fieldsConfig.forEach(field => {
        //   const content = field.children
        //   for (let item of content) {
        //     this.fieldsModels[item.name] = item.type === 'date' || item.type === 'number' || item.type === 'file' ? null : item.type === 'yes_no' ? false : ''
        //   }
        // })
      })
    },
    input (item, value) {
      item = value
      console.log(item)
    }
  },
  created() {
    this.getFields("http://localhost:8080/casedata?a=init&sid=wconen")
  }
};
</script>

<style>
body {
  background-color: #212121;
}
#case_data {
  background-color: #fff;
  margin: 0 auto;
  padding: 15px;
  /* width: 1010px; */
  max-width: 1010px;
  /* height: 802px;
  max-height: 802px; */
  font-family: Arial, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
