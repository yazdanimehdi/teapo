<template>
  <div>
  <v-hover v-slot:default="{ hover }">
    <v-card width="100%" height="180px" flat
            style="border-radius: 30px"
            :color="cardBackgroundColor">

      <v-card-title class="tpo-title">
        {{ tpoTitle }}
      </v-card-title>
      <v-card-text style="color: white; padding: 0">
        <div>
          <v-container fluid>
            <v-row align="center" justify="space-between" class="progress-class" v-if="!downloaded">
              <v-container fluid>
                <v-row justify="center" align="center">
                  <h2 v-if="!downloadShow">
                    Download this TPO
                  </h2>
                  <h2 v-else>
                    Downloading
                  </h2>
                </v-row>
                <v-row justify="center" align="center" v-if="!downloadShow">
                  <v-col>
                    <v-btn block @click="downloadTPO">
                      Download
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-progress-linear
                        v-model="downloadValue"
                        :active="downloadShow"
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

            </v-row>
            <v-row align="center" justify="space-between" class="progress-class" v-else>
              <v-col cols="3" sm="3" md="3" lg="3" xl="3">
                <v-container fluid>
                  <v-row class="progress-row">
                    Reading
                  </v-row>
                  <v-row class="progress-row">
                    <v-progress-circular
                        size="50"
                        width="6"
                        :value="(TPOInst['readingScore']/30)*100"
                        color="teal accent-1"
                        v-if="TPOInst['readingCompleted']"
                    >{{ TPOInst['readingScore'] }}
                    </v-progress-circular>
                    <h2 style="height: 50px" v-else>-</h2>
                  </v-row>
                </v-container>
              </v-col>
              <v-col cols="3" sm="3" md="3" lg="3" xl="3">
                <v-container fluid>
                  <v-row class="progress-row">
                    Listening
                  </v-row>
                  <v-row class="progress-row">
                    <v-progress-circular
                        size="50"
                        width="6"
                        :value="(TPOInst['listeningScore']/30)*100"
                        color="indigo lighten-4"
                        v-if="TPOInst['listeningCompleted']"
                    >{{ TPOInst['listeningScore'] }}
                    </v-progress-circular>
                    <h2 style="height: 50px" v-else>-</h2>
                  </v-row>
                </v-container>

              </v-col>
              <v-col cols="3" sm="3" md="3" lg="3" xl="3">
                <v-container fluid>
                  <v-row class="progress-row">
                    Speaking
                  </v-row>
                  <v-row class="progress-row">
                    <v-progress-circular
                        size="50"
                        width="6"
                        :value="(TPOInst['speakingScore']/30)*100"
                        color="deep-orange lighten-3"
                        v-if="TPOInst['speakingCompleted']"
                    >{{ TPOInst['speakingScore'] === 0 ? '?' : TPOInst['speakingScore'] }}
                    </v-progress-circular>
                    <h2 style="height: 50px" v-else>-</h2>
                  </v-row>
                </v-container>

              </v-col>
              <v-col cols="3" sm="3" md="3" lg="3" xl="3">
                <v-container fluid>
                  <v-row class="progress-row">
                    Writing
                  </v-row>
                  <v-row class="progress-row">
                    <v-progress-circular
                        size="50"
                        width="6"
                        :value="(TPOInst['writingScore']/30)*100"
                        color="red accent-2"
                        v-if="TPOInst['writingCompleted']"
                    >{{ TPOInst['writingScore'] === 0 ? '?' : TPOInst['writingScore'] }}
                    </v-progress-circular>
                    <h2 style="height: 50px" v-else>-</h2>
                  </v-row>
                </v-container>

              </v-col>
            </v-row>
          </v-container>
        </div>
      </v-card-text>
      <v-expand-transition>
        <div
            v-if="hover && downloaded"
            class="d-flex transition-fast-in-fast-out black darken-2 v-card--reveal display-3 white--text"
            style="height: 100%;"
        >
          <v-container fluid>
            <v-row align="center" justify="center">
              <v-col>
                <v-btn block @click="goToTPO">All</v-btn>
              </v-col>
            </v-row>

            <v-row align="center" justify="center">
              <v-col cols="6" sm="6" md="6" lg="6" xl="6">
                <v-btn @click="goToReading" block color="teal accent-1">Reading</v-btn>
              </v-col>
              <v-col cols="6" sm="6" md="6" lg="6" xl="6">
                <v-btn @click="goToListening" block color="indigo lighten-4">Listening</v-btn>
              </v-col>
              <v-col cols="6" sm="6" md="6" lg="6" xl="6">
                <v-btn @click="goToSpeaking" block color="deep-orange lighten-3">Speaking</v-btn>
              </v-col>
              <v-col cols="6" sm="6" md="6" lg="6" xl="6">
                <v-btn @click="goToWriting" block color="red accent-2">Writing</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </div>
      </v-expand-transition>
    </v-card>
  </v-hover>
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
  </div>
</template>

<script>
import {RESUME_TPO, START_TPO} from "@/store/actions/mainTPO";
import {DOWNLOAD_TPO} from "@/store/actions/download";
import {mapGetters} from 'vuex'
import {CHECK_EXISTING_USER_TEST} from "@/store/actions/TPOPage";

export default {
  name: "TPOCard",
  props: {
    tpoId: {
      required: true,
      type: Number,
    },
    tpoTitle: {
      required: true,
      type: String,
    },
    mode: {
      required: true,
      type: String
    },
    standard: {
      required: true,
      type: Boolean
    },
  },
  data() {
    return {
      downloadValue: 0,
      downloadQuery: false,
      downloadShow: false,
      dialog: false,
      examArray: [],
      userTestId: 0,
    }
  },
  computed: {
    ...mapGetters(['percentCompleted', 'localTPOListId', 'localTPOList']),
    downloaded(){
      return this.localTPOListId.indexOf(this.tpoId) !== -1;
    },
    TPOInst() {
      return this.$store.getters.getTPOById(this.tpoId)
    },
    cardBackgroundColor() {
      if (this.downloaded) {
        if (this.readingCompleted && this.listeningCompleted && this.speakingCompleted && this.writingCompleted) {
          return 'success'
        } else {
          if (this.standard) {
            return '#5A4389'
          } else {
            return 'red'
          }
        }
      } else {
        if (this.standard) {
          return '#1C0153'
        } else {
          return '#640202'
        }
      }
    }
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
  methods: {
    goToTPO() {
      this.$store.dispatch(CHECK_EXISTING_USER_TEST, [this.tpoId, ['Reading', 'Listening', 'Speaking', 'Writing'], this.mode]).then((result) => {
        if(!result.isAvailable){
          this.$store.dispatch(START_TPO, {
            'examArray': ['Reading', 'Listening', 'Speaking', 'Writing'],
            'TPO': this.tpoId,
            'mode': this.mode
          })
          this.$router.push('/tpo')
        }
        else {
          this.userTestId = result.userTestId
          this.examArray = ['Reading', 'Listening', 'Speaking', 'Writing']
          this.dialog = true
        }
      })
    },
    goToReading() {
      this.$store.dispatch(CHECK_EXISTING_USER_TEST, [this.tpoId, ['Reading'], this.mode]).then((result) => {
        if(!result.isAvailable){
          this.$store.dispatch(START_TPO, {
            'examArray': ['Reading'],
            'TPO': this.tpoId,
            'mode': this.mode
          })
          this.$router.push('/tpo')
        }
        else {
          this.userTestId = result.userTestId
          this.examArray = ['Reading']
          this.dialog = true
        }
      })
    },
    goToListening() {
      this.$store.dispatch(CHECK_EXISTING_USER_TEST, [this.tpoId, ['Listening'], this.mode]).then((result) => {
        if(!result.isAvailable){
          this.$store.dispatch(START_TPO, {
            'examArray': ['Listening'],
            'TPO': this.tpoId,
            'mode': this.mode
          })
          this.$router.push('/tpo')
        }
        else {
          this.userTestId = result.userTestId
          this.examArray = ['Listening']
          this.dialog = true
        }
      })
    },
    goToSpeaking() {
      this.$store.dispatch(CHECK_EXISTING_USER_TEST, [this.tpoId, ['Speaking'], this.mode]).then((result) => {
        if(!result.isAvailable){
          this.$store.dispatch(START_TPO, {
            'examArray': ['Speaking'],
            'TPO': this.tpoId,
            'mode': this.mode
          })
          this.$router.push('/tpo')
        }
        else {
          this.userTestId = result.userTestId
          this.examArray = ['Speaking']
          this.dialog = true
        }
      })
    },
    goToWriting() {
      this.$store.dispatch(CHECK_EXISTING_USER_TEST, [this.tpoId, ['Writing'], this.mode]).then((result) => {
        if(!result.isAvailable){
          this.$store.dispatch(START_TPO, {
            'examArray': ['Writing'],
            'TPO': this.tpoId,
            'mode': this.mode
          })
          this.$router.push('/tpo')
        }
        else {
          this.userTestId = result.userTestId
          this.examArray = ['Writing']
          this.dialog = true
        }
      })
    },
    downloadTPO() {
      this.$store.dispatch(DOWNLOAD_TPO, this.tpoId)
      this.downloadQuery = true
      this.downloadShow = true
    },
    startOver(){
      this.$store.dispatch(START_TPO, {
        'examArray': this.examArray,
        'TPO': this.tpoId,
        'mode': this.mode
      })
      this.$router.push('/tpo')
    },
    continueTest(){
      this.$store.dispatch(RESUME_TPO, this.userTestId).then(() => {
        this.$router.push('/tpo')
      })
    },
  },
}
</script>

<style scoped>
.progress-class {
  background-color: rgba(246, 245, 242, 0.4);
}

.tpo-title {
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  text-align: center;
  font-size: 24px;
  color: white;
  padding: 5px 0 0 0;
}

.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: .7;
  position: absolute;
  width: 100%;
  border-radius: 30px;
}

.progress-row {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: bold;
}
</style>