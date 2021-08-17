<template>
  <v-app>
    <v-app-bar absolute
               color="#1C0153"
               dark
               :height="height*0.1"

               src="../assets/icon_group.png"
               style="padding-top:8px;margin: 0;position: fixed; z-index: 10; font-family: Kalam">
      <div style="font-weight: bold; font-size: 20px">{{ TPOViewTestTitle }}</div>
      <v-spacer></v-spacer>
      <v-btn icon @click="goToDashboard">
        <v-icon>{{ icons.mdiChevronRight }}</v-icon>
      </v-btn>
    </v-app-bar>

    <div
        :style="{'margin-left':`${width*0.06}px`, 'margin-right': `${width*0.06}px`, 'margin-top': `${height*0.1 + 30}px`}"
        style="font-family: kalam">
      <div v-if="loading" style="text-align: center;">
        <v-progress-circular indeterminate size="50" style="margin-top: 20px"></v-progress-circular>
      </div>
      <div v-else>
        <v-container fluid>
          <v-row>
            <v-container style="width: 500px; margin-top: 0; padding-top: 0">
              <v-row justify="center" align="center">
                <v-col cols="6" sm="6" md="6" lg="6" xl="6" style="margin-right: 0; padding-right: 0">
                  <v-btn block depressed height="47px" style="border-radius: 35px 0 0 35px"
                         :color="practice?'#1C0153':'#E6E6E6'" @click="practice=true">
                    <div :style="{'color': practice?'#E6E6E6':'#1C0153', 'font-weight': 'bold'}">Practice
                    </div>
                  </v-btn>
                </v-col>
                <v-col cols="6" sm="6" md="6" lg="6" xl="6" style="margin-left: 0; padding-left: 0">
                  <v-btn block depressed height="47px" style="border-radius: 0 35px 35px 0"
                         :color="!practice?'#1C0153':'#E6E6E6'" @click="practice=false">
                    <div :style="{'color': !practice?'#E6E6E6':'#1C0153', 'font-weight': 'bold'}">Test</div>
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-row>
        </v-container>

        <v-container fluid style="padding-bottom: 0">
          <v-row justify="center" align="center">
            <v-col style="padding-bottom: 0">
              <v-card height="60"
                      flat
                      style="background-image: linear-gradient(to right, #CE1BC1 , #1BCE21, #D9962E, #8D7DF9); border-radius: 15px; padding: 0">
                <v-container style="padding: 0; width: 100%;" fluid>
                  <v-row style="margin: 0; width: 100%;" align="center" justify="end">
                    <v-col cols="2" sm="2" md="2" lg="2" xl="2" style="padding: 0; padding-left: 20px">
                      <span class="correction-title">ALL</span>
                    </v-col>
                    <v-col cols="8" sm="8" md="8" lg="8" xl="8" style="padding: 0; padding-left: 12px">
                      <span class="correction-title"></span>
                    </v-col>
                    <v-col cols="2" sm="2" md="2" lg="2" xl="2" style="padding: 0; text-align: right">
                      <v-hover v-slot:default="{ hover }">
                        <v-container style="padding: 0; height: 60px" @click="goToTPO" :style="{ 'cursor': hover ? 'pointer' : ''}">
                          <v-row justify="center" align="center" style="margin: 0">
                            <v-col style="padding: 0; text-align: right; height: 60px">
                              <div class="triangle" :style="{'border-top-color': hover ? '#8D7DF9' : '#1C0153'}"></div>
                            </v-col>
                            <v-col style="padding: 0; text-align: right; height: 60px">
                              <div class="box" :style="{'background-color': hover ? '#8D7DF9' : '#1C0153'}">
                          <span>
                            Start
                          </span>

                              </div>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-hover>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6" md="6" lg="6" xl="6" style="padding: 0">
              <v-container fluid style="padding-bottom: 10px">
                <v-row justify="center" align="center">
                  <v-col style="padding-bottom: 0">
                    <v-card height="60"
                            flat
                            style="background-image: linear-gradient(45deg, #CE1BC1, #CF7CC3); border-radius: 15px; padding: 0">
                      <v-container style="padding: 0; width: 100%;" fluid>
                        <v-row style="margin: 0; width: 100%;" align="center" justify="end">
                          <v-col cols="6" sm="6" md="6" lg="6" xl="6" style="padding: 0; padding-left: 20px">
                            <span class="correction-title">Reading</span>
                          </v-col>
                          <v-col cols="6" sm="6" md="6" lg="6" xl="6" style="padding: 0; text-align: right">
                            <v-hover v-slot:default="{ hover }">
                              <v-container style="padding: 0; height: 60px" @click="goToReading" :style="{ 'cursor': hover ? 'pointer' : ''}">
                                <v-row justify="center" align="center" style="margin: 0">
                                  <v-col style="padding: 0; text-align: right; height: 60px">
                                    <div class="triangle"
                                         :style="{'border-top-color': hover ? '#8D7DF9' : '#1C0153'}"></div>
                                  </v-col>
                                  <v-col style="padding: 0; text-align: right; height: 60px">
                                    <div class="box" :style="{'background-color': hover ? '#8D7DF9' : '#1C0153'}">
                          <span>
                            Start
                          </span>

                                    </div>
                                  </v-col>
                                </v-row>
                              </v-container>
                            </v-hover>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card>
                  </v-col>
                </v-row>
              </v-container>
            </v-col>
            <v-col cols="12" sm="6" md="6" lg="6" xl="6" style="padding: 0">
              <v-container fluid style="padding-bottom: 0">
                <v-row justify="center" align="center">
                  <v-col style="padding-bottom: 0">
                    <v-card height="60"
                            flat
                            style="background-image: linear-gradient(45deg, #1BCE21, #7CCF9A); border-radius: 15px; padding: 0">
                      <v-container style="padding: 0; width: 100%;" fluid>
                        <v-row style="margin: 0; width: 100%;" align="center" justify="end">
                          <v-col cols="6" sm="6" md="6" lg="6" xl="6" style="padding: 0; padding-left: 20px">
                            <span class="correction-title">Listening</span>
                          </v-col>
                          <v-col cols="6" sm="6" md="6" lg="6" xl="6" style="padding: 0; text-align: right">
                            <v-hover v-slot:default="{ hover }">
                              <v-container style="padding: 0; height: 60px" @click="goToListening" :style="{ 'cursor': hover ? 'pointer' : ''}">
                                <v-row justify="center" align="center" style="margin: 0">
                                  <v-col style="padding: 0; text-align: right; height: 60px">
                                    <div class="triangle"
                                         :style="{'border-top-color': hover ? '#8D7DF9' : '#1C0153'}"></div>
                                  </v-col>
                                  <v-col style="padding: 0; text-align: right; height: 60px">
                                    <div class="box" :style="{'background-color': hover ? '#8D7DF9' : '#1C0153'}">
                          <span>
                            Start
                          </span>

                                    </div>
                                  </v-col>
                                </v-row>
                              </v-container>
                            </v-hover>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card>
                  </v-col>
                </v-row>
              </v-container>
            </v-col>
            <v-col cols="12" sm="6" md="6" lg="6" xl="6" style="padding: 0">
              <v-container fluid style="padding-bottom: 0">
                <v-row justify="center" align="center">
                  <v-col style="padding-bottom: 0">
                    <v-card height="60"
                            flat
                            style="background-image: linear-gradient(45deg, #D9962E, #DEC39B); border-radius: 15px; padding: 0">
                      <v-container style="padding: 0; width: 100%;" fluid>
                        <v-row style="margin: 0; width: 100%;" align="center" justify="end">
                          <v-col cols="6" sm="6" md="6" lg="6" xl="6" style="padding: 0; padding-left: 20px">
                            <span class="correction-title">Speaking</span>
                          </v-col>
                          <v-col cols="6" sm="6" md="6" lg="6" xl="6" style="padding: 0; text-align: right">
                            <v-hover v-slot:default="{ hover }">
                              <v-container style="padding: 0; height: 60px" @click="goToSpeaking" :style="{ 'cursor': hover ? 'pointer' : ''}">
                                <v-row justify="center" align="center" style="margin: 0">
                                  <v-col style="padding: 0; text-align: right; height: 60px">
                                    <div class="triangle"
                                         :style="{'border-top-color': hover ? '#8D7DF9' : '#1C0153'}"></div>
                                  </v-col>
                                  <v-col style="padding: 0; text-align: right; height: 60px">
                                    <div class="box" :style="{'background-color': hover ? '#8D7DF9' : '#1C0153'}">
                          <span>
                            Start
                          </span>

                                    </div>
                                  </v-col>
                                </v-row>
                              </v-container>
                            </v-hover>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card>
                  </v-col>
                </v-row>
              </v-container>
            </v-col>
            <v-col cols="12" sm="6" md="6" lg="6" xl="6" style="padding: 0">
              <v-container fluid>
                <v-row justify="center" align="center">
                  <v-col style="padding-bottom: 0">
                    <v-card height="60"
                            flat
                            style="background-image: linear-gradient(45deg, #8D7DF9, #B3ABE6); border-radius: 15px; padding: 0">
                      <v-container style="padding: 0; width: 100%;" fluid>
                        <v-row style="margin: 0; width: 100%;" align="center" justify="end">
                          <v-col cols="6" sm="6" md="6" lg="6" xl="6" style="padding: 0; padding-left: 20px">
                            <span class="correction-title">Writing</span>
                          </v-col>
                          <v-col cols="6" sm="6" md="6" lg="6" xl="6" style="padding: 0; text-align: right">
                            <v-hover v-slot:default="{ hover }">
                              <v-container style="padding: 0; height: 60px" @click="goToWriting" :style="{ 'cursor': hover ? 'pointer' : ''}">
                                <v-row justify="center" align="center" style="margin: 0">
                                  <v-col style="padding: 0; text-align: right; height: 60px">
                                    <div class="triangle"
                                         :style="{'border-top-color': hover ? '#8D7DF9' : '#1C0153'}"></div>
                                  </v-col>
                                  <v-col style="padding: 0; text-align: right; height: 60px">
                                    <div class="box" :style="{'background-color': hover ? '#8D7DF9' : '#1C0153'}">
                          <span>
                            Start
                          </span>

                                    </div>
                                  </v-col>
                                </v-row>
                              </v-container>
                            </v-hover>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card>
                  </v-col>
                </v-row>
              </v-container>
            </v-col>
          </v-row>
        </v-container>

        <hr style="margin-top: 20px; height: 3px; background-color: black; ">
        <h2 style="margin-top: 10px; font-family: kalam">History</h2>

        <v-data-table
            style="margin-top: 20px"
            :headers="headers"
            :items="TPOHistory"
            :items-per-page="5"
            :expand-icon="icons.mdiChevronDown"
            class="elevation-1"
            :footer-props="{
              'next-icon': icons.mdiChevronRight,
              'prev-icon': icons.mdiChevronLeft,
              'disable-items-per-page': true
            }"

        >

          <template v-slot:item.actions="{ item }">
            <v-btn
                small
                color="#1C0153"
                @click="openReview(item)"
                style="color: white"
            >
              review
            </v-btn>
          </template>
          <template v-slot:no-data>
            <v-img src="../assets/sad.png" height="60" contain style="margin-top: 30px;" position="center">
            </v-img>
            <h2 style="text-align: center; margin-top: 30px">You didn't do this TPO</h2>
            <h3 style="text-align: center; margin-top: 5px">Begin doing This TPO now!</h3>
          </template>
        </v-data-table>

      </div>
    </div>
    <v-dialog max-width="500" v-model="dialog">
      <v-card>
        <v-card-title>
          Do You Want To Continue Previous Session?
        </v-card-title>
        <v-card-actions>
          <v-btn @click="startOver" color="red" style="color: white">Start Over</v-btn>
          <v-btn @click="continueTest" color="green" style="color: white">Continue</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import {mdiChevronRight, mdiChevronLeft, mdiChevronDown} from '@mdi/js'
import {CHECK_EXISTING_USER_TEST} from "@/store/actions/TPOPage";
import {RESUME_TPO, START_TPO} from "@/store/actions/mainTPO";
import {GET_TPO_HISTORY} from '@/store/actions/TPOView'
import {mapGetters} from 'vuex'
import {SET_REVIEW_USER_TEST_ID} from "@/store/actions/reviewExam";

export default {
  name: "TPOView",
  data() {
    return {
      loading: true,
      width: 0,
      height: 0,
      icons: {
        mdiChevronRight,
        mdiChevronLeft,
        mdiChevronDown
      },
      practice: true,
      headers: [
        {
          text: 'Date',
          align: 'start',
          sortable: true,
          value: 'date',
        },
        {text: 'Reading', value: 'reading'},
        {text: 'Listening', value: 'listening'},
        {text: 'Speaking', value: 'speaking'},
        {text: 'Writing', value: 'writing'},
        {text: 'total', value: 'total'},
        {text: 'Action', value: 'actions', sortable: false}
      ],
      dialog: false,
    }
  },
  created() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
    this.$store.dispatch(GET_TPO_HISTORY).then(() => {
      this.loading = false
    })
  },
  computed: {
    ...mapGetters(['TPOViewTestId', 'TPOHistory', 'TPOViewTestTitle']),
    mode() {
      if (this.practice) {
        return 'practiceMode'
      } else {
        return 'testMode'
      }
    }
  },
  methods: {
    handleResize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
    },
    goToDashboard() {
      this.$router.push('/')
    },
    openReview(item) {
      this.$store.dispatch(SET_REVIEW_USER_TEST_ID, item['id'])
      this.$router.push('/review')
    },
    goToTPO() {
      this.$store.dispatch(CHECK_EXISTING_USER_TEST, [this.TPOViewTestId, ['Reading', 'Listening', 'Speaking', 'Writing'], this.mode]).then((result) => {
        if (!result.isAvailable) {
          this.$store.dispatch(START_TPO, {
            'examArray': ['Reading', 'Listening', 'Speaking', 'Writing'],
            'TPO': this.TPOViewTestId,
            'mode': this.mode
          })
          this.$router.push('/tpo')
        } else {
          this.userTestId = result.userTestId
          this.examArray = ['Reading', 'Listening', 'Speaking', 'Writing']
          this.dialog = true
        }
      })
    },
    goToReading() {
      this.$store.dispatch(CHECK_EXISTING_USER_TEST, [this.TPOViewTestId, ['Reading'], this.mode]).then((result) => {
        if (!result.isAvailable) {
          this.$store.dispatch(START_TPO, {
            'examArray': ['Reading'],
            'TPO': this.TPOViewTestId,
            'mode': this.mode
          })
          this.$router.push('/tpo')
        } else {
          this.userTestId = result.userTestId
          this.examArray = ['Reading']
          this.dialog = true
        }
      })
    },
    goToListening() {
      this.$store.dispatch(CHECK_EXISTING_USER_TEST, [this.TPOViewTestId, ['Listening'], this.mode]).then((result) => {
        if (!result.isAvailable) {
          this.$store.dispatch(START_TPO, {
            'examArray': ['Listening'],
            'TPO': this.TPOViewTestId,
            'mode': this.mode
          })
          this.$router.push('/tpo')
        } else {
          this.userTestId = result.userTestId
          this.examArray = ['Listening']
          this.dialog = true
        }
      })
    },
    goToSpeaking() {
      this.$store.dispatch(CHECK_EXISTING_USER_TEST, [this.TPOViewTestId, ['Speaking'], this.mode]).then((result) => {
        if (!result.isAvailable) {
          this.$store.dispatch(START_TPO, {
            'examArray': ['Speaking'],
            'TPO': this.TPOViewTestId,
            'mode': this.mode
          })
          this.$router.push('/tpo')
        } else {
          this.userTestId = result.userTestId
          this.examArray = ['Speaking']
          this.dialog = true
        }
      })
    },
    goToWriting() {
      this.$store.dispatch(CHECK_EXISTING_USER_TEST, [this.TPOViewTestId, ['Writing'], this.mode]).then((result) => {
        if (!result.isAvailable) {
          this.$store.dispatch(START_TPO, {
            'examArray': ['Writing'],
            'TPO': this.TPOViewTestId,
            'mode': this.mode
          })
          this.$router.push('/tpo')
        } else {
          this.userTestId = result.userTestId
          this.examArray = ['Writing']
          this.dialog = true
        }
      })
    },
    startOver() {
      this.$store.dispatch(START_TPO, {
        'examArray': this.examArray,
        'TPO': this.TPOViewTestId,
        'mode': this.mode
      })
      this.$router.push('/tpo')
    },
    continueTest() {
      this.$store.dispatch(RESUME_TPO, this.userTestId).then(() => {
        this.$router.push('/tpo')
      })
    },
    goToReview(item) {
      console.log(item)
    }
  }
}
</script>

<style scoped>

.correction-title {
  font-weight: bold;
  color: white;
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
  padding-top: 19px;
  user-select: none;
}

.triangle {
  width: 0;
  height: 0;
  border-top: 60px solid #1C0153;
  border-left: 60px solid transparent;
  display: inline-block;
}

</style>