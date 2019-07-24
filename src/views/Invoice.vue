<template>
  <v-layout row wrap>
    <v-flex xs12 md10 lg9 xl10>
      <div id="invoice-box" class="invoice-box">
        <table cellpadding="0" cellspacing="0">
          <tr class="top">
            <td colspan="2">
              <table>
                <tr>
                  <td class="title">
                    <img src="../assets/spintec-logo-cropped.svg" style="width:100%; max-width:300px;">
                  </td>
                  <td>
                    Invoice #: 123<br>
                    <v-dialog
                      ref="date_created_picker"
                      v-model="date_created_picker"
                      :return-value.sync="date_created"
                      persistent
                      full-width
                      width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <span v-on="on" class="pointer">Created: {{ date_created }}</span>
                      </template>
                      <v-date-picker v-model="tmp_date" scrollable>
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="date_created_picker = false">Cancel</v-btn>
                        <v-btn text color="primary" @click="$refs.date_created_picker.save(tmp_date)">OK</v-btn>
                      </v-date-picker>
                    </v-dialog>
                    <br>
                    <v-dialog
                      ref="date_due_picker"
                      v-model="date_due_picker"
                      :return-value.sync="date_due"
                      persistent
                      full-width
                      width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <span v-on="on" class="pointer">Due: {{ date_due }}</span>
                      </template>
                      <v-date-picker v-model="tmp_date" scrollable>
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="date_created_picker = false">Cancel</v-btn>
                        <v-btn text color="primary" @click="$refs.date_due_picker.save(tmp_date)">OK</v-btn>
                      </v-date-picker>
                    </v-dialog>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr class="information">
            <td colspan="2">
              <table>
                <tr>
                  <td>
                    Sparksuite, Inc.<br>
                    12345 Sunny Road<br>
                    Sunnyville, CA 12345
                  </td>
                  <td>
                    Acme Corp.<br>
                    John Doe<br>
                    john@example.com
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr class="heading">
            <td>
              Payment Method
            </td>
            <td>
              Check #
            </td>
          </tr>
          <tr class="details">
            <td>
              Check
            </td>
            <td>
              1000
            </td>
          </tr>
          <tr class="heading">
            <td>
              Item
            </td>
            <td>
              Price
            </td>
          </tr>
          <tr class="item">
            <td>
              Website design
            </td>
            <td>
              $300.00
            </td>
          </tr>
          <tr class="item">
            <td>
              Hosting (3 months)
            </td>
            <td>
              $75.00
            </td>
          </tr>
          <tr class="item last">
            <td>
              Domain name (1 year)
            </td>
            <td>
              $10.00
            </td>
          </tr>
          <tr class="total">
            <td></td>
            <td>
              Total: $385.00
            </td>
          </tr>
        </table>
      </div>
    </v-flex>
    <v-flex xs12 md2 lg3 xl2>
      <v-btn @click="createPdf()">Download .pdf</v-btn>
    </v-flex>
  </v-layout>
</template>

<script>
import JsPDF from 'jspdf'
import html2canvas from "html2canvas"

export default {
  name: 'createInvoice',
  data: () => ({
    tmp_date: null,
    invoice_id: 0,
    items: [],
    date_created: new Date().toISOString().substr(0, 10),
    date_created_picker: false,
    date_due: new Date().toISOString().substr(0, 10),
    date_due_picker: false,
  }),
  computed: {
    costs_total () {

    }
  },
  methods: {
    createPdf () {
      const doc = new jsPDF();
      var canvasElement = document.createElement('canvas');
      html2canvas(this.$refs.content, { canvas: canvasElement }).then(function (canvas) {
        const img = canvas.toDataURL("image/png");
        doc.addImage(img,'JPEG',20,20);
        doc.save(`incoice-${this.invoice.id}.pdf`);
      });
    }
  }
}
</script>

<style scoped>
.pointer {
  cursor: pointer;
}
.invoice-box {
  max-width: 800px;
  margin: auto;
  padding: 30px;
  border: 1px solid #eee;
  box-shadow: 0 0 10px rgba(0, 0, 0, .15);
  font-size: 16px;
  line-height: 24px;
  font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
  color: #555;
  background-color: white;
}

.invoice-box table {
  width: 100%;
  line-height: inherit;
  text-align: left;
}

.invoice-box table td {
  padding: 5px;
  vertical-align: top;
}

.invoice-box table tr td:nth-child(2) {
  text-align: right;
}

.invoice-box table tr.top table td {
  padding-bottom: 20px;
}

.invoice-box table tr.top table td.title {
  font-size: 45px;
  line-height: 45px;
  color: #333;
}

.invoice-box table tr.information table td {
  padding-bottom: 40px;
}

.invoice-box table tr.heading td {
  background: #eee;
  border-bottom: 1px solid #ddd;
  font-weight: bold;
}

.invoice-box table tr.details td {
  padding-bottom: 20px;
}

.invoice-box table tr.item td{
  border-bottom: 1px solid #eee;
}

.invoice-box table tr.item.last td {
  border-bottom: none;
}

.invoice-box table tr.total td:nth-child(2) {
  border-top: 2px solid #eee;
  font-weight: bold;
}

@media only screen and (max-width: 600px) {
  .invoice-box table tr.top table td {
    width: 100%;
    display: block;
    text-align: center;
  }

  .invoice-box table tr.information table td {
    width: 100%;
    display: block;
    text-align: center;
  }
}
</style>
