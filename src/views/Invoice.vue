<template>
  <v-layout row wrap>
    <v-flex xs12 md9 lg9 xl10>
      <div id="invoice-box" ref="invoice-box" class="invoice-box">
        <table cellpadding="0" cellspacing="0">
          <tr class="top">
            <td colspan="2">
              <table>
                <tr>
                  <td class="title">
                    <img src="../assets/spintec-logo-cropped.svg" style="width:100%; max-width:300px;">
                  </td>
                  <td>
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
                      <v-date-picker 
                        v-model="date_created_tmp" 
                        scrollable
                        color="red"
                      >
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="date_created_picker = false">Cancel</v-btn>
                        <v-btn text color="primary" @click="$refs.date_created_picker.save(date_created_tmp)">Save</v-btn>
                      </v-date-picker>
                    </v-dialog>
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
                      <v-date-picker 
                        v-model="date_due_tmp"
                        scrollable
                        color="red"
                      >
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="date_due_picker = false">Cancel</v-btn>
                        <v-btn text color="primary" @click="$refs.date_due_picker.save(date_due_tmp)">Save</v-btn>
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
                    SPINTEC d.o.o.<br>
                    Polje 12<br>
                    5290 Šempeter pri Gorici<br>
                    Slovenija
                  </td>
                  <td>
                    POLJE 1<br>
                    POLJE 2<br>
                    POLJE 3
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr class="heading">
            <td>Payment Method</td>
            <td>Check #</td>
          </tr>
          <tr class="details">
            <td>Check</td>
            <td>1000</td>
          </tr>
          <tr class="heading">
            <td>Product</td>
            <td>Price</td>
          </tr>
          <tr
            v-for="item in items"
            :key="item.key"
            class="item"
          >
            <td>{{ item.name }}</td>
            <td>{{ item.price > 0 ? '€'+item.price : '' }}</td>
          </tr>
          <tr v-if="items.length <= 25">
            <td></td>
            <td>
              <v-btn right small icon color="info">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </td>
          </tr>
          <tr class="total">
            <td></td>
            <td>
              Total price: {{ costs_total > 0 ? '€'+costs_total : 'FREE' }}
            </td>
          </tr>
        </table>
      </div>
    </v-flex>
    <v-flex xs12 md3 lg3 xl2>
      <v-btn 
        outlined
        color="red"
        @click="createPdf()"
      >{{ ['Download .pdf', 'Generaging ...', 'Finished'][generating_pdf_index] }}</v-btn>
    </v-flex>
  </v-layout>
</template>

<script>
import JsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export default {
  name: 'createInvoice',
  data: () => ({
    generating_pdf_index: 0,
    invoice_id: 0,
    items: [],
    date_created: new Date().toISOString().substr(0, 10),
    date_created_picker: false,
    date_created_tmp: new Date().toISOString().substr(0, 10),
    date_due: new Date((new Date().getTime()) + 604800000).toISOString().substr(0, 10),
    date_due_picker: false,
    date_due_tmp: new Date((new Date().getTime()) + 604800000).toISOString().substr(0, 10),
  }),
  computed: {
    costs_total () {
      return this.items.reduce((acc, item) => {
        if (typeof item.price === 'string') return acc + (item.price)
        else return acc
      }, 0);
    }
  },
  watch: {
    date_created (newVal, oldVal) { this.date_created_tmp = newVal },
    date_due (newVal, oldVal) { this.date_due_tmp = newVal }
  },
  methods: {
    createPdf () {
      const invoiceid = this.invoice_id

      this.generating_pdf_index = 1

      setTimeout(() => {
        html2canvas(
          document.querySelector('#invoice-box'),
          { scale: 2 }
        ).then(canvas => {
          let pdf = new JsPDF('p', 'mm', 'a4')
          pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 211, 298)
          pdf.save(`incoice-${invoiceid}.pdf`)
          pdf = null

          this.generating_pdf_index = 2
          setTimeout(() => this.generating_pdf_index = 3, 2500);
        })
      }, 10)
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
  min-height: 297mm;
  min-width: 210mm;
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
