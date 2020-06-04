<template>
  <section id="case_data" class="mt-5" role="tablist">
    <b-card no-body class="mb-3">
      <b-card-header header-tag="header" class="p-1" role="tab">
        <b-button block v-b-toggle.countries variant="success">Countries</b-button>
      </b-card-header>
      <b-collapse id="countries" visible accordion="my-accordion" role="tabpanel">
        <b-card-body>
          <b-form>
            <b-row>
              <b-col class="mb-3" cols="12" sm="6">
                <b-form-select v-model="countryOfOrigin" :options="countries.origin"></b-form-select>
              </b-col>
              <b-col class="mb-3" cols="12" sm="6">
                <b-form-select v-model="countryOfDestination" :options="countries.destination"></b-form-select>
              </b-col>
            </b-row>
            <b-button type="submit" variant="success mt-3">Save</b-button>
          </b-form>
        </b-card-body>
      </b-collapse>
    </b-card>
    <b-card no-body class="mb-3">
      <b-card-header header-tag="header" class="p-1" role="tab">
        <b-button block v-b-toggle.recruitment variant="success">Recruitment</b-button>
      </b-card-header>
      <b-collapse id="recruitment" accordion="my-accordion" role="tabpanel">
        <b-card-body>
          <b-form>
            <b-row>
              <b-col class="mb-3" cols="12" sm="4" md="3">
                <b-form-input v-model="title" placeholder="Title"></b-form-input>
              </b-col>
              <b-col class="mb-3" cols="12" sm="8" md="9">
                <b-form-input v-model="name.family" placeholder="Family name"></b-form-input>
              </b-col>
              <b-col class="mb-3" cols="12" sm="6">
                <b-form-input v-model="name.middle" placeholder="Middle name"></b-form-input>
              </b-col>
              <b-col class="mb-3" cols="12" sm="6">
                <b-form-input v-model="name.given" placeholder="Given name"></b-form-input>
              </b-col>
            </b-row>
            <b-row>
              <b-col class="mb-3" cols="12" sm="4">
                <b-form-datepicker v-model="birth.date" placeholder="Date of birth" locale="en"></b-form-datepicker>
              </b-col>
              <b-col class="mb-3" cols="12" sm="8">
                <b-form-input v-model="birth.place" placeholder="Place of birth"></b-form-input>
              </b-col>
            </b-row>
            <b-row>
              <b-col class="mb-3" cols="12">
                <b-form-input v-model="address.ph" placeholder="Address PH"></b-form-input>
              </b-col>
              <b-col class="mb-3" cols="12" sm="6">
                <b-form-input type="email" v-model="email" placeholder="Email"></b-form-input>
              </b-col>
              <b-col class="mb-3" cols="12" sm="6">
                <b-form-input v-model="facebook" placeholder="Facebook"></b-form-input>
              </b-col>
              <b-col class="mb-3" cols="12" sm="6">
                <b-form-input type="tel" v-model="number.phone" placeholder="Phone number"></b-form-input>
              </b-col>
              <b-col class="mb-3" cols="12" sm="6">
                <b-form-input v-model="civilStatus" placeholder="Civil status"></b-form-input>
              </b-col>
            </b-row>
            <b-row>
              <b-col cols="12" sm="6">
                <b-row no-gutters>
                  <b-col class="mb-3" cols="6">
                    <span>Contract C&C</span>
                  </b-col>
                  <b-col class="mb-3" cols="6">
                    <b-form-radio-group
                      v-model="selectedContract"
                      :options="contractOptions"
                      name="contract"
                    ></b-form-radio-group>
                  </b-col>
                </b-row>
              </b-col>
              <b-col cols="12" sm="6">
                <b-row no-gutters>
                  <b-col class="mb-3" cols="6">
                    <span>Confirmation DSGVO</span>
                  </b-col>
                  <b-col class="mb-3" cols="6">
                    <b-form-radio-group
                      v-model="selectedConfirmation"
                      :options="confirmationOptions"
                      name="confirmation"
                    ></b-form-radio-group>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
            <b-row>
              <b-col class="mb-3" cols="12" sm="4" md="3">
                <b-form-input v-model="address.current" placeholder="Current address"></b-form-input>
              </b-col>
              <b-col class="mb-3" cols="12" sm="8" md="9">
                <b-form-input v-model="number.landline" placeholder="Landline number"></b-form-input>
              </b-col>
              <b-col class="mb-3" cols="12" sm="6">
                <b-form-input v-model="number.mobile" placeholder="Mobile number"></b-form-input>
              </b-col>
              <b-col class="mb-3" cols="12" sm="6">
                <b-form-input v-model="skype" placeholder="Skype name"></b-form-input>
              </b-col>
            </b-row>
            <b-row>
              <b-col cols="12" sm="6">
                <p class="mb-2">POEA E-Registration</p>
                <b-form-file
                  v-model="POEARegistration"
                  placeholder="Choose a file or drop it here..."
                  drop-placeholder="Drop file here..."
                  accept=".pdf"
                ></b-form-file>
              </b-col>
              <b-col cols="12" sm="6">
                <p class="mb-2">POEA PEOS Number</p>
                <b-form-file
                  v-model="POEAPEOSNumber"
                  placeholder="Choose a file or drop it here..."
                  drop-placeholder="Drop file here..."
                  accept=".pdf"
                ></b-form-file>
              </b-col>
            </b-row>
            <b-button type="submit" variant="success mt-4">Save</b-button>
          </b-form>
        </b-card-body>
      </b-collapse>
    </b-card>

    <b-card no-body class="mb-3">
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
      <b-card-body>ksdjhfkjh</b-card-body>
    </b-card>
  </section>
</template>

<script>
export default {
  name: "App",
  data: () => ({
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
    title: "",
    name: {
      family: "",
      middle: "",
      given: ""
    },
    birth: {
      date: null,
      place: ""
    },
    address: {
      ph: "",
      current: ""
    },
    number: {
      phone: "",
      landline: "",
      mobile: ""
    },
    email: "",
    facebook: "",
    skype: "",
    civilStatus: "",
    contractOptions: [
      { text: "Yes", value: true },
      { text: "No", value: false }
    ],
    confirmationOptions: [
      { text: "Yes", value: true },
      { text: "No", value: false }
    ],
    selectedContract: false,
    selectedConfirmation: false,
    POEARegistration: null,
    POEAPEOSNumber: null,

    // Language Training
    batch: null,
    date: {
      exam: null,
      start: null,
      projected: null
    }
  }),
  methods: {
    getFields(url) {
      fetch(url, {
        headers: { Authorization: "Basic " + window.btoa("test:pkotest9000") }
      }).then(data => {
        console.log(data);
      });
    }
  },
  created() {
    this.getFields("/casedata?a=init&sid=wconen");
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
