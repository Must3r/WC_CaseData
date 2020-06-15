<template>
  <div id="case_data" role="tablist">
    <b-form @submit.prevent="send()">
      <b-card
        v-for="(section, index) in fieldsConfig"
        :key="section.name"
        :tag="section.type"
        no-body
        class="mb-3"
      >
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-button block v-b-toggle="section.name" variant="secondary">{{ section.title }}</b-button>
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
      <b-button type="submit" variant="secondary" size="lg" class="mt-4">Save</b-button>
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
    options: [
      { text: "Yes", value: true },
      { text: "No", value: false }
    ],
    loading: true
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
        this.get("/casedata?a=get&sid=wconen&applicant_id=1313");
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
          for (let source in res.data) {
            if (res.data[source] !== this.fieldsModels[source]) {
              if (res.data[source].substr(0, 20) === "data:application/pdf") {
                this.fieldsModels[source] = null;
              } else {
                this.fieldsModels[source] = res.data[source];
              }
            }
          }
          this.loading = false;
        })
        .catch(err => console.log(err));
    },
    send() {
      const bodyFormData = new FormData();
      bodyFormData.set("data", JSON.stringify(this.fieldsModels));
      this.$axios({
        url: `/casedata?a=save&sid=wconen&applicant_id=1313`,
        method: "POST",
        headers: {
          Authorization: "Basic " + window.btoa("test:pkotest9000"),
          "Content-Type": "application/json"
        },
        data: bodyFormData
      });
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
    this.getFields("/casedata?a=init&sid=wconen");
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
