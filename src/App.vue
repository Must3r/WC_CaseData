<template>
  <div id="case_data" class="mt-5" role="tablist">
    <b-form @submit.prevent="send()">
      <b-card
        v-for="(section, index) in fieldsConfig"
        :key="section.name"
        :tag="section.type"
        no-body
        class="mb-3"
      >
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-button block v-b-toggle="section.name" variant="success">{{ section.title }}</b-button>
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
                        :options="field.type === 'contract_cc' ? contractOptions : confirmationOptions"
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
                    @change="showFiles(field.name)"
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
      <b-button type="submit" variant="success">Save</b-button>
    </b-form>
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
      title: "",
      fname: "",
      mname: "",
      gname: "",
      birth_date: null,
      birth_place: "",
      address: "",
      address_ph: "",
      email: "",
      facebook: "",
      phone: null,
      ll_number: "",
      mobile: "",
      skype: "",
      civil_status: "",
      contract_cc: false,
      confirmation_dsgvo: false,
      poea_ereg: null,
      poea_num: null,
      batch: null,
      exam_date: null,
      start_date: null,
      proj_date: null,
      recog_app_form: false,
      poa_cc: false,
      lang_cert: null,
      curr_vitae: false,
      passport: false,
      marr_contract: false,
      birth_cert: null,
      birth_cert_child: null,
      school_dipl: null,
      bsn_dipl: null,
      transcript: null,
      related_exp: null,
      curriculum: null,
      empl_cert: null,
      prc_lic: null,
      prc_cert: null,
      prc_rating: null,
      defict_lett: false,
      defict_hours: null,
      defict_theory: "",
      defict_hosp: "",
      emploer_name: "",
      employer_addr: "",
      employer_cont_assist: false,
      work_hour_assist: null,
      job_offer: false,
      work_hour_nurse: null,
      cc_confirm: false,
      visa: false,
      visa_exp: null,
      visa_appform: false,
      employer_cont_name: "",
      employer_cont_email: "",
      employer_cont_phone: "",
      travel_insurance: false,
      medi_cert: false,
      medi_cert_exp: null,
      nbi_clear: false,
      nbi_exp: null,
      oec_num: "",
      oec_num_exp: null,
      e_ticket: false,
      arriv_date: null,
      melde_addr: "",
      melde_stat: false,
      bank_acc_id: false,
      steuer_id: false,
      renten_vn: "",
      kv_mitglie: false,
      quit_vors: false,
      aufenthalt: false,
      zusatzblatt: false,
      ablauf: null,
      measure_ztb: null,
      measure_zte: null,
      measure_ot: "",
      measure_zpb: null,
      measure_zpe: null,
      measure_op: "",
      termin_absch: null,
      bildungs: false,
      weiterbild: false,
      anlage9: false,
      arztliche: false,
      arbeit_measure: "",
      arberit_addr_measure: "",
      berufsurkunde: false,
      cc_vert_anerk: null
    },
    pdf: [],
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

    contractOptions: [
      { text: "Yes", value: true },
      { text: "No", value: false }
    ],
    confirmationOptions: [
      { text: "Yes", value: true },
      { text: "No", value: false }
    ]
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
      }).then(res => console.log(res.data));
    },
    send() {
      this.$axios({
        url: "/casedata?a=save&sid=wconen&applicant_id=13131",
        method: "POST",
        headers: {
          Authorization: "Basic " + window.btoa("test:pkotest9000"),
          "Content-Type": "application/json"
        },
        data: this.fieldsModels
      })
        .then(res => console.log(res))
        .catch(err => console.log(err));
      // var xhr = new XMLHttpRequest();
      // xhr.open('POST', '/casedata?a=save&sid=wconen&applicant_id=13131', true);
      // xhr.setRequestHeader('Authorization', "Basic " + window.btoa("test:pkotest9000"));
      // xhr.setRequestHeader('Content-Type', 'application/json');
      // xhr.send(JSON.stringify(this.fieldsModels));
      // if (xhr.status != 200) {
      //   console.log('Ошибка ' + xhr.status + ': ' + xhr.statusText);
      // } else {
      //   console.log(xhr.responseText);
      // }
    },
    showFiles(name) {
      const element = document.querySelector(`#${name}`);
      const file = element.files[0];
      console.log(element);
      const fr = new FileReader();
      var base64;
      fr.onload = function(event) {
        base64 = event.target.result;
      };
      fr.readAsDataURL(file);
      setTimeout(() => {
        this.fieldsModels[name] = base64;
      }, 50);
    }
  },
  created() {
    this.getFields("/casedata?a=init&sid=wconen");
    this.get(
      "/casedata?a=get&sid=wconen&applicant_id=1313"
    );
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
