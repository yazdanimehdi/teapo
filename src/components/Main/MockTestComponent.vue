<template>
  <div v-if="loading" style="text-align: center; margin-top: 100px">
    <v-progress-circular indeterminate size="50"></v-progress-circular>
  </div>
  <div :style="{'width': `${width}px`, 'font-family':'kalam'}" v-else>
    <v-container fluid style="overflow-y: scroll">
      <v-row>
        <v-col>
          <h2 style="font-size: 22px">
            Available Mock tests
          </h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card color="#BEE0E2" height="100%" :width="`${width}px`"
                  style="border-radius: 20px; padding-left: 15px; padding-right: 15px" flat>
            <v-container fluid>
              <v-row align="center" justify="space-around"
                     :style="{'border-radius': '20px','width':`${width - 50}px`, 'height': '90px', 'background-color': '#E6E6E6', 'margin-top': '15px', 'padding-left':'10px'}"
                     v-for="mock in mockListPaginated" :key="mock.id">
                <!--title-->
                <v-col cols="10" md="1" sm="1" lg="1" xl="1" style="padding-left: 5px; padding-right: 5px">
                  <div style="font-size: 16px; font-weight: bold">
                    {{ mock.code }}
                  </div>
                </v-col>
                <!--Date-->
                <v-col cols="10" md="2" sm="2" lg="2" xl="2" style="padding-left: 5px; padding-right: 5px">
                  <div class="my-title">
                    End
                  </div>
                  <div class="my-subtitle" style="color: red">
                    {{ mock['end_date'] | formatDate }}
                  </div>

                </v-col>
                <!--Organizer-->
                <v-col cols="10" md="2" sm="2" lg="2" xl="2" style="padding-left: 5px; padding-right: 5px">
                  <div class="my-title">
                    Organizer
                  </div>
                  <div class="my-subtitle">
                    {{ mock['institute'] }}
                  </div>
                </v-col>
                <!--Fee-->
                <v-col cols="10" md="2" sm="2" lg="2" xl="2" style="padding-left: 5px; padding-right: 5px">
                  <div class="my-title">
                    Fee
                  </div>
                  <div class="my-subtitle">
                    {{ mock['fee'] | formatCurrency }} Toman
                  </div>
                </v-col>
                <!--Register/Start Button-->
                <v-col cols="10" md="2" sm="2" lg="2" xl="2" style="padding-left: 5px; padding-right: 5px">
                  <v-btn rounded width="100%" color="#bab5c4" class="my-title" v-if="!mock['is_paid']"
                         @click="buyMock(mock)">
                    Register
                  </v-btn>
                  <v-btn rounded width="100%" color="#bab5c4" class="my-title" @click="startMock(mock)" v-else>
                    Start
                  </v-btn>

                </v-col>
              </v-row>

              <v-row style="margin-top: 15px;" align="center" justify="center">
                <v-col cols="6" md="6" lg="6" sm="6" xl="6">
                  <v-pagination
                      :next-icon="icons.mdiChevronRight"
                      :prev-icon="icons.mdiChevronLeft"
                      v-model="pageMock"
                      :length="mockListNumberOfPages"
                      color="#BEE0E2"
                      circle
                  ></v-pagination>
                </v-col>

              </v-row>
            </v-container>
          </v-card>
        </v-col>

      </v-row>
      <template v-if="mockResultList.length !== 0">
        <v-row>
          <v-col>
            <h2 style="font-size: 22px">
              Previous Mock tests results
            </h2>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-card color="#D5E294" height="100%" :width="`${width}px`"
                    style="border-radius: 20px; padding-left: 15px; padding-right: 15px" flat>
              <v-container fluid>
                <v-row align="center" justify="space-around"
                       :style="{'border-radius': '20px','width':`${width - 50}px`, 'height': '110px', 'background-color': '#E6E6E6', 'margin-top': '15px' }"
                       v-for="result in mockResultListPaginated" :key="result.id">
                  <!--title-->
                  <v-col cols="10" md="2" sm="2" lg="2" xl="2">
                    <div class="my-title">
                      {{ result.code }}
                    </div>
                  </v-col>
                  <!--date & institute -->
                  <v-col cols="10" md="2" sm="2" lg="2" xl="2">
                    <!--data-->
                    <div class="my-subtitle">
                      {{ result.date | formatDate }}
                    </div>
                    <!--institute-->
                    <div class="my-subtitle">
                      {{ result['institute'] }}
                    </div>
                  </v-col>
                  <!--total score -->
                  <v-col cols="10" md="2" sm="2" lg="2" xl="2">
                    <div class="my-title">
                      Total
                    </div>
                    <!--score-->
                    <div class="my-subtitle">
                      {{
                        result['reading_score'] !== null && result['listening_score'] !== null && result['speaking_score'] !== null && result['writing_score'] !== null ? result['reading_score'] + result['listening_score'] + result['speaking_score'] + result['writing_score'] : '?'
                      }}
                      / 120
                    </div>
                  </v-col>
                  <!--reading & listening -->
                  <v-col cols="10" md="3" sm="3" lg="3" xl="3">
                    <!--reading-->
                    <div class="my-subtitle">
                      Reading: {{ result['reading_score'] !== null ? result['reading_score'] : '?' }}
                    </div>
                    <!--listening-->
                    <div class="my-subtitle">
                      listening: {{ result['listening_score'] !== null ? result['listening_score'] : '?' }}
                    </div>
                  </v-col>
                  <!--speaking & writing -->
                  <v-col cols="10" md="2" sm="2" lg="2" xl="2" style="padding-left: 5px">
                    <!--speaking-->
                    <div class="my-subtitle">
                      Speaking: {{ result['speaking_score'] !== null ? result['speaking_score'] : '?' }}
                    </div>
                    <!--listening-->
                    <div class="my-subtitle">
                      writing: {{ result['writing_score'] !== null ? result['writing_score'] : '?' }}
                    </div>
                  </v-col>

                </v-row>

                <v-row style="margin-top: 15px;" align="center" justify="center">
                  <v-col cols="6" md="6" lg="6" sm="6" xl="6">
                    <v-pagination
                        :next-icon="icons.mdiChevronRight"
                        :prev-icon="icons.mdiChevronLeft"
                        v-model="pageResult"
                        :length="mockResultListNumberOfPages"
                        color="#D5E294"
                        circle
                    ></v-pagination>
                  </v-col>
                </v-row>
              </v-container>

            </v-card>
          </v-col>
        </v-row>
      </template>
    </v-container>
    <v-dialog v-model="dialog" width="600" st>
      <v-card width="600" height="100%">
        <v-card-title style="font-family: kalam; font-weight: bold; font-size: 30px">{{ selectedTest.title }}
        </v-card-title>
        <v-card-text style="text-align: right">
          <h3>:قوانین شرکت در آزمون</h3>
          <div>.حق مالکیت مادی و معنوی تمامی بخش های آزمون در اختیار موسسه برگزار کننده است -</div>

          <div>.هرگونه کپی برداری و انتشار اطلاعات آزمون غیرمجاز است -</div>

          <div>.ضمانت اصالت و کیفیت محتوا آزمون بر عهده موسسه برگزار کننده خواهد بود -</div>

          <div>.استاندارد های زمانی و محتوایی، طبق آخرین تغییرات تافل اعمال می شود -</div>

          <div> عنوان متن های بخش خواندنی و عنوان قسمت های موجود در بخش شنیداری نمایش داده شده است. مسئولیت بررسی -
            .عدم تکراری بودن این بخش ها بر عهده کاربر است و موسسه برگزار کننده هیچ مسئولیتی در این مورد نخواهد داشت
          </div>

          <div>.عملیات تصحیح آزمون توسط موسسه انجام شده و در نرم افزار تیپو به شما اعلام خواهد شد -</div>

          <div>.محیط برگزاری آزمون، بستر نرم افزار تیپو است -</div>

          <div>.در تمامی مراحل آزمون، اتصال به اینترنت الزامی است و در صورت قطعی یا مشکل اتصال به اینترنت خسارت ناشی بر
            عهده کاربر است -
          </div>

        </v-card-text>
        <v-card-text style="text-align: right; font-weight: bold">
          توجه داشته باشید که امکان شرکت در آزمون فقط تا زمان تعیین شده وجود دارد لذا توجه فرمایید که بعد از ثبت نام نیز
          میبایست قبل از تاریخ انقضا، در آزمون شرکت فرمایید
        </v-card-text>
        <v-card-text>
          <h3>Reading Titles:</h3>
          <div v-for="(reading, i) in selectedTest.reading " :key="i">
            {{ reading }}
          </div>

          <h3>Listening Titles:</h3>
          <div v-for="(listening, i) in selectedTest.listening " :key="selectedTest.reading.length + i">
            {{ listening }}
          </div>
          <h2 style="font-family: kalam; font-weight: bold; margin-top: 20px">Price</h2>
          <h3 style="font-family: kalam; font-weight: bold; margin-top: 10px; color:#1C0153; margin-bottom: 10px">
            {{ selectedTest['fee'] | formatCurrency }}
            Toman</h3>
          <v-btn color="#1C0153" style="color: white; font-family: kalam; font-weight: bold"
                 @click="payMethod">Confirm & Pay
          </v-btn>

        </v-card-text>
        <div>

        </div>
      </v-card>
    </v-dialog>
    <v-dialog v-model="startDialog" width="400">
      <v-card width="400" height="100%">
        <v-container fluid>
          <v-row justify="center" align="center">
            <h2>
              Downloading
            </h2>
          </v-row>
          <v-row>
            <v-col>
              <v-progress-linear
                  v-model="downloadValue"
                  :indeterminate="downloadQuery"
                  :query="true"
                  height="15"
                  striped
                  rounded
                  color="green"
              ><strong v-if="!downloadQuery">{{ Math.ceil(downloadValue) }}%</strong></v-progress-linear>
            </v-col>
          </v-row>

        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {
  mdiChevronRight,
  mdiChevronLeft,
  mdiArrowRight
} from '@mdi/js'
import {mapGetters} from 'vuex'
import {GET_LOCAL_MOCK_LIST, GET_MOCK_EXAMS, GET_MOCK_RESULTS, ORDER_MOCK} from "@/store/actions/mockExams";
import {DOWNLOAD_TPO} from "@/store/actions/download";
import {CHECK_EXISTING_USER_TEST} from "@/store/actions/TPOPage";
import {RESUME_TPO, START_TPO} from "@/store/actions/mainTPO";

export default {
  name: "MockTestComponent",
  props: {
    width: {
      required: true,
      type: Number
    }
  },
  data() {
    return {
      pageMock: 1,
      pageResult: 1,
      icons: {
        mdiChevronLeft,
        mdiChevronRight,
        mdiArrowRight
      },
      loading: true,
      dialog: false,
      selectedTest: {'fee': 0},
      startDialog: false,
      downloadQuery: false,
      downloadValue: 0,
      userTestId: 0,
    }
  },
  created() {
    let self = this
    this.$store.dispatch(GET_MOCK_EXAMS).then(() => {
      this.$store.dispatch(GET_MOCK_RESULTS).then(() => {
        this.$store.dispatch(GET_LOCAL_MOCK_LIST).then(() => {
          self.loading = false
        })
      })
    })
    this.deepLinkListener = require('electron').ipcRenderer.on('deep-link', function (event, data) {
      if (data === 'teapo://transaction' || data === 'transaction') {
        self.loading = true
        self.$store.dispatch(GET_MOCK_EXAMS).then(() => {
          self.$store.dispatch(GET_MOCK_RESULTS).then(() => {
            this.$store.dispatch(GET_LOCAL_MOCK_LIST).then(() => {
              self.loading = false
            })
          })
        })
      }
    })
  },
  watch: {
    percentCompleted(newVal) {
      if (newVal > 0) {
        this.downloadQuery = false
      }
      this.downloadValue = newVal
      if (newVal === 100) {
        this.downloadShow = false
      }
    }
  },
  computed: {
    ...mapGetters(['mockList', 'mockResultList', 'percentCompleted']),
    mockListPaginated() {
      return this.mockList.slice(this.pageMock - 1, 4)
    },
    mockListNumberOfPages() {
      return Math.ceil(this.mockList.length / 4)
    },
    mockResultListPaginated() {
      return this.mockResultList.slice(this.pageResult - 1, 4)
    },
    mockResultListNumberOfPages() {
      return Math.ceil(this.mockResultList.length / 4)
    },
    isMockAvailable() {
      return this.$store.getters.isMockAvailable(this.selectedTest.id)
    }
  },
  methods: {
    buyMock(test) {
      this.dialog = true;
      this.selectedTest = test;

    },
    payMethod() {
      let self = this;
      this.$store.dispatch(ORDER_MOCK, self.selectedTest.id).then((resp) => {
        const {shell} = require("electron");
        shell.openExternal(resp.data['link']);
        self.orderDialog = false;
      })
    },
    startMock(test) {
      this.selectedTest = test;
      let examArray = [];
      if (this.selectedTest.reading.length !== 0) {
        examArray.push('Reading')
      }
      if (this.selectedTest.listening.length !== 0) {
        examArray.push('Listening')
      }
      if (this.selectedTest.speaking.length !== 0) {
        examArray.push('Speaking')
      }
      if (this.selectedTest.writing.length !== 0) {
        examArray.push('Writing')
      }
      if (!this.isMockAvailable) {
        this.startDialog = true
        this.$store.dispatch(DOWNLOAD_TPO, this.selectedTest.id)
        this.downloadQuery = true
      }
      this.$store.dispatch(CHECK_EXISTING_USER_TEST, [this.selectedTest.id, examArray, 'mockMode']).then((result) => {
        if (!result.isAvailable) {
          this.$store.dispatch(START_TPO, {
            'examArray': examArray,
            'TPO': this.selectedTest.id,
            'mode': 'mockMode'
          })
          this.$router.push('/tpo')
        } else {
          this.userTestId = result.userTestId
          this.examArray = examArray
          this.$store.dispatch(RESUME_TPO, this.userTestId).then(() => {
            this.$router.push('/tpo')
          })
        }
      })
    }

  }
}
</script>

<style scoped>
.my-title {
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  font-family: kalam;
}

.my-subtitle {
  font-size: 16px;
  text-align: center;
  font-family: kalam;
}
</style>