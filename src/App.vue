<template>
  <v-app>
    <v-content class="my-5">
      <v-layout row wrap>
        <v-flex xs12 md12 lg12 xl3 />
        <v-flex xs12 md12 lg9 xl6>
          <div id="invoice-box" ref="invoice-box" class="invoice-box">
            <table cellpadding="0" cellspacing="0">
              <tr class="top">
                <td colspan="2">
                  <table>
                    <tr>
                      <td class="title">
                        <img src="./assets/spintec-logo-cropped.svg" style="width:100%; max-width:300px;">
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
                            <span v-on="on" class="pointer" :style="generating_pdf_index===0?'color:#2196f3;':''">Created: {{ date_created }}</span>
                          </template>
                          <v-date-picker 
                            v-model="date_created_tmp" 
                            :max="date_due"
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
                            <span v-on="on" class="pointer" :style="generating_pdf_index===0?'color:#2196f3;':''">Due: {{ date_due }}</span>
                          </template>
                          <v-date-picker 
                            v-model="date_due_tmp"
                            :min="date_created"
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
                        <span
                          v-for="(line, i) in lines1"
                          :key="i"
                        >
                          <v-edit-dialog :return-value.sync="lines1[i]">
                            {{ line }}
                            <v-btn 
                              v-if="generating_pdf_index === 0"
                              small icon 
                              color="error"
                              class="c_btnmicro"
                              @click.stop="lines1.splice(i, 1)" 
                            >
                              <v-icon>mdi-minus</v-icon>
                            </v-btn>
                            <template v-slot:input>
                              <v-text-field
                                v-model="lines1[i]"
                                label="Edit"
                                single-line
                              ></v-text-field>
                            </template>
                          </v-edit-dialog>
                        </span>
                        <v-btn 
                          v-if="lines1.length < 6 && generating_pdf_index === 0"
                          right small icon 
                          color="success"
                          class="c_btnmicro"
                          style="float: right;"
                          @click="lines1.push('New line')" 
                        >
                          <v-icon>mdi-plus</v-icon>
                        </v-btn>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr class="heading">
                <td>Product</td>
                <td>Price</td>
              </tr>
              <tr
                v-for="(item, i) in items"
                :key="i"
                class="item"
              >
                <td>
                  <v-edit-dialog :return-value.sync="items[i].name">
                    {{ item.name }}
                    <template v-slot:input>
                      <v-text-field
                        v-model="item.name"
                        label="Edit"
                        single-line
                      ></v-text-field>
                    </template>
                  </v-edit-dialog>
                </td>
                <td>
                  <v-edit-dialog :return-value.sync="items[i].price">
                    €{{ item.price }}
                    <v-btn 
                      v-if="generating_pdf_index === 0"
                      small icon 
                      color="error"
                      class="c_btnmicro"
                      @click.stop="items.splice(i, 1)" 
                    >
                      <v-icon>mdi-minus</v-icon>
                    </v-btn>
                    <template v-slot:input>
                      <v-text-field
                        v-model="item.price"
                        type="number"
                        label="Edit"
                        single-line
                      ></v-text-field>
                    </template>
                  </v-edit-dialog>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <v-btn 
                    v-if="items.length < 16 && generating_pdf_index === 0"
                    right small icon 
                    color="success"
                    class="c_btnmicro"
                    style="float: right;"
                    @click="items.push({name: 'name', price: 0})" 
                  >
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </td>
              </tr>
              <tr class="total">
                <td></td>
                <td>
                  Total price: €{{ costs_total }}
                </td>
              </tr>
            </table>
          </div>
        </v-flex>
        <v-flex xs12 md12 lg2 xl1>
          <v-layout row wrap>
            <v-flex offset-xs3 xs6 offset-md3 md6 offset-lg0 lg12 offset-xl0 xl12>
              <v-btn
                outlined left block
                class="mt-1"
                color="red"
                @click="createPdf()"
              >{{ ['Download pdf', 'Generaging ...', 'Finished'][generating_pdf_index] }}</v-btn>
            </v-flex>
            <!-- <v-flex offset-xs3 xs6 offset-md3 md6 offset-lg0 lg12 offset-xl0 xl12>
              <v-btn
                outlined left block
                class="mt-1"
                color="red"
                @click="createXlsx()"
              >{{ ['Download xlsx', 'Generaging ...', 'Finished'][generating_xslx_index] }}</v-btn>
            </v-flex> -->
          </v-layout>
        </v-flex>
      </v-layout>
    </v-content>
  </v-app>
</template>

<script>
import JsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { json2excel } from 'js2excel'

export default {
  name: 'App',
  data: () => ({
    generating_pdf_index: 0,
    generating_xslx_index: 0,
    invoice_id: 0,
    items: [],
    lines1: [],
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
        if (typeof item.price === 'string') return acc + (+item.price)
        else return acc
      }, 0);
    }
  },
  watch: {
    date_created (newVal, oldVal) { this.date_created_tmp = newVal },
    date_due (newVal, oldVal) { this.date_due_tmp = newVal }
  },
  methods: {
    createXlsx () {
      this.generating_xslx_index = 1

      data.push({name: 'Total price', price: this.costs_total})
      try {
        json2excel({
          data,
          name: 'invoice-'+this.invoice_id,
          formateDate: 'dd/mm/yyy'
        })
        this.generating_xslx_index = 2
        setTimeout(() => this.generating_xslx_index = 0, 2500);
      } catch (e) {
        console.error('export error');
      }

    },
    createPdf () {
      const invoiceid = this.invoice_id

      this.generating_pdf_index = 1

      setTimeout(() => {
        const element = document.querySelector('#invoice-box')
        html2canvas(
          element,
          { scale: 2 }
        ).then(canvas => {
          let height
          let pdf = new JsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
            putOnlyUsedFonts: true,

          })
          
          pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 211, 298)
          pdf.save(`incoice-${invoiceid}.pdf`)
          pdf = null

          this.generating_pdf_index = 2
          setTimeout(() => this.generating_pdf_index = 0, 2500);
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
.c_btnmicro {
  height: 25px !important;
  width: 25px !important;
}
.invoice-box {
  margin: auto;
  padding: 30px;
  border: 1px solid #eee;
  box-shadow: 0 0 10px rgba(0, 0, 0, .15);
  font-size: 16px;
  line-height: 25px;
  font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
  color: #555;
  background-color: white;
  width: 210mm;
  height: 297mm;
}

.invoice-box table {
  width: 100%;
  line-height: 25px;
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
