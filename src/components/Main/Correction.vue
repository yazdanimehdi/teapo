<template>
  <div :style="{'width': `${width}px`, 'font-family':'kalam'}">
    <div v-if="loading" style="text-align: center; margin-top: 100px">
      <v-progress-circular indeterminate size="50"></v-progress-circular>
    </div>
    <div v-else-if="!connected">
      <v-card flat height="200">
        <v-img src="../../assets/sad.png" height="60" contain style="margin-top: 30px;" position="center">
        </v-img>
        <h2 style="text-align: center; margin-top: 30px">You are not connected to the internet</h2>
        <h3 style="text-align: center; margin-top: 5px">Only local TPOs are showing here</h3>

      </v-card>
    </div>
    <div v-else-if="correctionTests.length === 0">
      <v-card flat height="200">
        <v-img src="../../assets/sad.png" height="60" contain style="margin-top: 30px;" position="center">
        </v-img>
        <h2 style="text-align: center; margin-top: 30px">You don't have any test to correct</h2>
        <h3 style="text-align: center; margin-top: 5px">Begin doing TPOs now!</h3>

      </v-card>
    </div>
    <v-container fluid v-for="test in correctionTests" :key="test.userTestId" v-else>
      <v-row justify="center" align="center">
        <v-col style="padding-bottom: 0">
          <v-card height="60"
                  flat
                  style="background-image: linear-gradient(45deg, #5D5175, #562CAA); border-radius: 15px; padding: 0">
            <v-container style="padding: 0" fluid>
              <v-row style="margin: 0; width: 100%;" align="center" justify="end">
                <v-col cols="8" sm="7" md="8" lg="8" xl="8" style="padding: 0; padding-left: 12px"
                       @click="expand(test.id, test.userTestId, test)">
                  <v-icon color="white">
                    {{ openedBar === test.userTestId ? icons.mdiChevronDown : icons.mdiChevronRight }}
                  </v-icon>
                  <span class="correction-title">{{ test.title }}</span>
                </v-col>
                <v-col cols="2" sm="2" md="2" lg="2" xl="2" style="padding: 0; text-align: right">
                  <v-btn text color="white" large style="font-weight: bold; font-size: 16px"
                         @click="openReview(test.userTestId)">Review
                  </v-btn>
                </v-col>
                <v-col cols="2" sm="3" md="2" lg="2" xl="2" style="padding: 0; text-align: right">
                  <v-container style="padding: 0; height: 60px">
                    <v-row justify="center" align="center" style="margin: 0">
                      <v-col style="padding: 0; text-align: right; height: 60px">
                        <div class="triangle"></div>
                      </v-col>
                      <v-col style="padding: 0; text-align: right; height: 60px"
                             @click="openOrderDialog(test.userTestId, test.id, test)">
                        <div class="box">
                          <span>
                            order Grading
                          </span>

                        </div>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>
      </v-row>
      <transition name="slide-y-transition">
        <v-row align="center" justify="center" v-show="openedBar === test.userTestId" style="user-select: none">
          <v-col cols="10" sm="10" md="10" lg="10" xl="10" style="padding-top: 0">
            <v-card :height="cardHeight" color="#E4D8FB" flat style="border-radius: 0 0 30px 30px">
              <div v-if="correctionSpeakingAnswers.length !==0">
                <h2 style="padding:12px">Speakings:</h2>
                <v-container>
                  <v-row justify="space-between" align="center">
                    <v-col cols="4" sm="4" md="4" lg="4" xl="4" v-for="speakingAnswer in correctionSpeakingAnswers"
                           :key="speakingAnswer.id">
                      <span style="font-weight: bold">Number: </span><span
                        style="color: red; font-weight: bold">{{ speakingIds[speakingAnswer['question_id']] }}</span>
                      <audio :src="speakingAnswer.answer" controls style="width: 100%">
                      </audio>
                    </v-col>
                  </v-row>
                </v-container>
              </div>
              <div v-if="correctionWritingAnswers.length !==0">
                <h2 style="padding:12px">Writings:</h2>
                <v-container>
                  <v-row justify="space-between" align="center">
                    <v-col cols="4" sm="4" md="4" lg="4" xl="4" v-for="writingAnswer in correctionWritingAnswers"
                           :key="writingAnswer.id">
                      <span style="font-weight: bold">Number: </span><span
                        style="color: red; font-weight: bold">{{ writingIds[writingAnswer['question_id']] }}</span>

                    </v-col>
                  </v-row>
                </v-container>
              </div>

            </v-card>
          </v-col>
        </v-row>
      </transition>
    </v-container>
    <div v-if="loading === false">
    <hr style="margin-top: 20px; height: 3px; background-color: black">
    <h2 style="margin-top: 10px; font-family: kalam">My Orders</h2>
    <div style="text-align: center">
      <v-card flat height="200" v-if="orderedSpeaking.length === 0 && orderedWriting.length === 0">
        <v-img src="../../assets/sad.png" height="60" contain style="margin-top: 30px;" position="center">
        </v-img>
        <h2 style="text-align: center; margin-top: 30px">You don't have any order</h2>
        <h3 style="text-align: center; margin-top: 5px">Start ordering correction now!!</h3>
      </v-card>
      <div v-else>
        <v-container fluid v-for="test in orderedSpeaking" :key="test['local_user_test_id']">
          <v-row justify="center" align="center">
            <v-col style="padding-bottom: 0">
              <v-card height="60"
                      flat
                      :style="{'background-image': test.state === 0 ? 'linear-gradient(45deg, #5D5175, #562CAA)' : 'linear-gradient(45deg, #00FF00, #008080)'}"
                      style="border-radius: 15px; padding: 0;">
                <v-container style="padding: 0" fluid>
                  <v-row style="margin: 0; width: 100%;" align="center" justify="end">
                    <v-col cols="8" sm="7" md="8" lg="8" xl="8" style="padding: 0; padding-left: 12px">
                      <v-icon color="white">
                        {{ icons.mdiChevronRight }}
                      </v-icon>
                      <span class="correction-title">Speaking {{ test.test.title }}</span>
                    </v-col>
                    <v-col cols="2" sm="2" md="2" lg="2" xl="2" style="padding: 0; text-align: right">
                      <v-btn text color="white" large style="font-weight: bold; font-size: 16px"
                             @click="openReview(test.userTestId)">Review
                      </v-btn>
                    </v-col>
                    <v-col cols="2" sm="3" md="2" lg="2" xl="2" style="padding: 0; text-align: right">
                      <v-container style="padding: 0; height: 60px">
                        <v-row justify="center" align="center" style="margin: 0">
                          <v-col style="padding: 0; text-align: right; height: 60px">
                            <div class="triangle" :style="{'border-top-color': test.state === 0 ? '#1C0153' : 'rgba(0, 255, 0, 0.7)'}"></div>
                          </v-col>
                          <v-col style="padding: 0; text-align: right; height: 60px"
                                 @click="gotToOrderDetail(test.id, 'speaking')">
                            <div class="box" :style="{'background-color': test.state === 0 ? '#1C0153' : 'rgba(0, 255, 0, 0.7)'}">
                          <span>
                            Order Details
                          </span>

                            </div>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
        <v-container fluid v-for="test in orderedWriting" :key="test['local_user_test_id']">
          <v-row justify="center" align="center">
            <v-col style="padding-bottom: 0">
              <v-card height="60"
                      flat
                      :style="{'background-image': test.state === 0 ? 'linear-gradient(45deg, #5D5175, #562CAA)' : 'linear-gradient(45deg, #008080, #00FF00)'}"
                      style="border-radius: 15px; padding: 0;">
                <v-container style="padding: 0" fluid>
                  <v-row style="margin: 0; width: 100%;" align="center" justify="end">
                    <v-col cols="10" sm="9" md="10" lg="10" xl="10" style="padding: 0; padding-left: 12px; text-align: left">
                      <v-icon color="white">
                        {{ icons.mdiChevronRight }}
                      </v-icon>
                      <span class="correction-title">Writing {{ test.test.title }}</span>
                    </v-col>
                    <v-col cols="2" sm="3" md="2" lg="2" xl="2" style="padding: 0; text-align: right">
                      <v-container style="padding: 0; height: 60px">
                        <v-row justify="center" align="center" style="margin: 0">
                          <v-col style="padding: 0; text-align: right; height: 60px">
                            <div class="triangle" :style="{'border-top-color': test.state === 0 ? '#1C0153' : 'rgba(0, 255, 0, 0.7)'}"></div>
                          </v-col>
                          <v-col style="padding: 0; text-align: right; height: 60px"
                                 @click="gotToOrderDetail(test.id, 'writing')">
                            <div class="box" :style="{'background-color': test.state === 0 ? '#1C0153' : 'rgba(0, 255, 0, 0.7)'}">
                          <span>
                            Order Details
                          </span>

                            </div>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </div>
    </div>
    <v-dialog width="400" v-model="orderDialog">
      <v-card width="400" height="400" style="border-radius: 30px" flat>
        <v-card-title style="font-family: kalam; font-weight: bold; font-size: 30px">{{ test.title }}</v-card-title>
        <v-card-subtitle style="font-family: kalam; font-size: 15px; margin-top: 0">
          {{ test['time'] | formatDate}}
        </v-card-subtitle>
        <v-card-text>
          <v-container fluid style="font-family: kalam; padding: 0">
            <v-checkbox :disabled="correctionSpeakingAnswers.length === 0" label="Speaking" v-model="speaking"
                        :off-icon="icons.mdiCheckboxBlankOutline" :on-icon="icons.mdiCheckboxMarkedOutline"
                        hide-details></v-checkbox>
            <v-checkbox :disabled="correctionWritingAnswers.length === 0" label="Writing" v-model="writing"
                        :off-icon="icons.mdiCheckboxBlankOutline" :on-icon="icons.mdiCheckboxMarkedOutline"
                        hide-details></v-checkbox>
          </v-container>
          <h2 style="font-family: kalam; font-weight: bold; margin-top: 20px">Price</h2>
          <h3 style="font-family: kalam; font-weight: bold; margin-top: 10px; color:#1C0153; margin-bottom: 70px">
            {{ totalPrice.toString() | formatCurrency }}
            Toman</h3>
          <v-btn color="#1C0153" style="color: white; font-family: kalam; font-weight: bold"
                 :disabled="!writing && !speaking"
                 @click="payMethod(test.id, test.userTestId)">Confirm & Pay
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {mdiChevronDown, mdiChevronRight, mdiCheckboxBlankOutline, mdiCheckboxMarkedOutline} from '@mdi/js'
import {GET_LOCAL_TPO_LIST} from "@/store/actions/TPOPage";
import {
  GET_CORRECTION_CAPABLE_TESTS,
  GET_CORRECTION_CONTENT,
  GET_PRICES,
  ORDER_CORRECTION
} from "@/store/actions/correction";
import {mapGetters} from 'vuex';
import {SET_REVIEW_USER_TEST_ID} from "@/store/actions/reviewExam";
import {SET_CORRECTION_REVIEW_PARAMETERS} from "@/store/actions/correctionReview";

export default {
  name: "Correction",
  props: {
    width: {
      required: true,
      type: Number
    },
  },
  data() {
    return {
      loading: true,
      orderDialog: false,
      openedBar: -1,
      icons: {
        mdiChevronRight,
        mdiChevronDown,
        mdiCheckboxBlankOutline,
        mdiCheckboxMarkedOutline
      },
      test: {},
      speaking: false,
      writing: false,
      connection: '',
      deepLinkListener: '',
    }
  },
  created() {
    let self = this;
      self.$store.dispatch(GET_PRICES).then(() => {
        self.$store.dispatch(GET_LOCAL_TPO_LIST).then(() => {
          self.$store.dispatch(GET_CORRECTION_CAPABLE_TESTS).then(() => {
            self.loading = false;
          })
        })
      })

    this.deepLinkListener = require('electron').ipcRenderer.on('deep-link', function (event, data) {
      if (data === 'teapo://transaction' || data === 'transaction') {
        self.loading = true
        self.$store.dispatch(GET_PRICES).then(() => {
          self.$store.dispatch(GET_LOCAL_TPO_LIST).then(() => {
            self.$store.dispatch(GET_CORRECTION_CAPABLE_TESTS).then(() => {
              self.loading = false;
            })
          })
        })
      }
    })
  },
  destroyed() {
    this.deepLinkListener.removeAllListeners('deep-link')
  },
  computed: {
    ...mapGetters(['correctionTests',
      'correctionSpeakingAnswers',
      'correctionWritingAnswers',
      'speakingIds',
      'writingIds',
      'connected',
      'speakingPrice',
      'writingPrice',
      'authToken',
      'orderedWriting',
      'orderedSpeaking'
    ]),
    cardHeight() {
      if (this.correctionWritingAnswers.length !== 0 && this.correctionSpeakingAnswers.length !== 0) {
        return 500
      } else if (this.correctionWritingAnswers.length !== 0) {
        return 200
      } else if (this.correctionSpeakingAnswers.length !== 0) {
        return 300
      } else {
        return 0
      }
    },
    totalPrice() {
      let totalPrice = 0;
      if (this.writing) {
        totalPrice += this.writingPrice
      }
      if (this.speaking) {
        totalPrice += this.speakingPrice
      }
      return totalPrice
    }
  },
  methods: {
    expand(testId, userTestId) {
      this.$store.dispatch(GET_CORRECTION_CONTENT, [testId, userTestId]).then(() => {
        this.openedBar === userTestId ? this.openedBar = -1 : this.openedBar = userTestId
      })
    },
    openReview(userTestId) {
      this.$store.dispatch(SET_REVIEW_USER_TEST_ID, userTestId)
      this.$router.push('/review')
    },
    openOrderDialog(userTestId, testId, test) {
      this.$store.dispatch(GET_CORRECTION_CONTENT, [testId, userTestId]).then(() => {
        this.test = test;
        this.orderDialog = true;
      })
    },
    payMethod(testId, userTestId) {
      let self = this;
      this.$store.dispatch(ORDER_CORRECTION, [testId, userTestId, this.speaking, this.writing]).then((resp) => {
        const {shell} = require("electron");
        shell.openExternal(resp.data['link']);
        self.orderDialog = false
      })
    },
    gotToOrderDetail(orderId, section){
      this.$store.dispatch(SET_CORRECTION_REVIEW_PARAMETERS, {'id': orderId, 'type': section})
      this.$router.push('order_detail')
    },
  }
}
</script>

<style scoped>

.correction-title {
  font-weight: bold;
  color: white;
  margin-left: 30px;
  font-size: 20px;
  user-select: none;
}

.box {
  height: 60px;
  width: 100%;
  background-color: #1C0153;
  border-radius: 0 15px 15px 0;
  color: white;
  text-align: center;
  font-weight: bold;
  font-size: 20px;
  line-height: 20px;
  padding-top: 8px;
  user-select: none;
}

.triangle {
  width: 0;
  height: 0;
  border-top: 60px solid #1C0153;
  border-left: 60px solid transparent;
  display: inline-block;
}

.flip-list-move {
  transition: transform 300ms;
}

</style>