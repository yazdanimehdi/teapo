<template>
  <v-app class="main">
    <v-container fluid class="toolbar" style="padding: 0">
      <v-row justify="space-between" align="start"
             style="padding: 0; padding-top: 29px; padding-bottom: 12px">
        <v-col sm="6" lg="6" cols="6" md="6" style="padding: 0; padding-left: 20px">
          <v-container fluid>
            <v-row justify="start" align="start">
              <v-col style="padding: 0">
                <v-btn to="/review" dark rounded small style="margin-right: 10px" v-if="listeningMode === 'reviewMode'">Back</v-btn>
                <v-btn @click="endDialog = true" dark rounded small style="margin-right: 10px" v-else>End</v-btn>
                <v-btn rounded @click="openDictionary"
                       x-small
                       v-if="listeningMode === 'practiceMode' || listeningMode === 'reviewMode'">
                  Dictionary
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
        <v-col sm="6" lg="4" cols="6" md="4" style="padding: 0;padding-right: 30px; ">
          <v-container fluid style="padding: 0">
            <v-row justify="end" align="start" style="padding: 0">
              <v-col cols="6" md="6" lg="6" sm="6" v-if="volume.enabled">
                <label>
                  <input type="range" v-model="volume_slide">
                </label>
              </v-col>
              <v-col cols="2" md="2" lg="2" sm="2" style="padding: 0">
                <v-img src="../../../assets/vol.png" contain max-height="60px"
                       min-height="40px" @click="show_vol"></v-img>
              </v-col>
              <v-col cols="2" md="2" lg="2" sm="2" style="padding: 0">
                <v-img src="../../../assets/backd.png" contain max-height="60px"
                       min-height="40px" v-if="!backAvailable"></v-img>
                <v-img src="../../../assets/back.png" contain max-height="60px"
                       min-height="40px"
                       v-else-if="listeningMode === 'practiceMode' || listeningMode === 'reviewMode'"
                       @click="goToBack"></v-img>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
      </v-row>
      <v-row justify="center" align="start">
        <v-container fluid style="margin: 0; padding:0">
          <v-row justify="center" align="start">
            <div class="qanounce">
              {{ taskType }} {{ taskTypeNumber }} of
              {{ taskType === 'Conversation' ? conversationCount : lectureCount }}
            </div>
          </v-row>
        </v-container>
      </v-row>
    </v-container>
    <v-container>
      <v-row align="center" justify="center">
        <img :src="listeningImageSource" style="max-height: 350px">
      </v-row>
      <v-row align="center" justify="center">
        <audio id="listening" autoplay
               :controls="(listeningMode === 'reviewMode' || listeningMode === 'practiceMode')"
               v-on:ended="listeningEnded" v-on:timeupdate="progressListening">
          <source :src="listeningSource">
        </audio>
      </v-row>
      <v-row justify="center" align="center">
        <div style="border: black solid 2px">
          <progress :value="audio.percentage" max="100"></progress>
        </div>
      </v-row>

      <v-row style="padding: 30px" v-if="listeningMode === 'practiceMode' || listeningMode === 'reviewMode'">
        <v-bottom-sheet v-model="sheet" :inset="false" :hide-overlay="true" persistent scrollable>
          <template v-slot:activator="{ on }">
            <v-row justify="center">
              <v-btn
                  color="purple"
                  dark
                  v-on="on"
              >
                Open Transcript
              </v-btn>
            </v-row>
          </template>
          <v-sheet class="text-center" style="overflow-y: scroll">
            <v-btn
                class="my-6"
                depressed
                color="error"
                @click="sheet = !sheet"
            >close
            </v-btn>
            <v-card>
              <v-card-title>
                <span class="headline">{{ listeningTitle }}</span>
              </v-card-title>
              <v-card-text style="text-align: left; font-size: 16px;">
                {{ listeningTranscript }}
              </v-card-text>
            </v-card>
          </v-sheet>
        </v-bottom-sheet>
      </v-row>

    </v-container>
    <v-dialog
        v-model="dialogDict"
        max-width="500px"
    >
      <v-card>
        <v-card-subtitle style="padding:10px 0 0 10px">
          <v-btn
              color="primary"
              icon
              @click="closeDialogDict"
          >
            <v-icon>{{ icons.mdiClose }}</v-icon>
          </v-btn>
        </v-card-subtitle>
        <v-card-text>
          <DictionaryComponent :width="400" flat v-if="selected !== ''"/>
          <v-container fluid v-else>
            <v-row align="center" justify="center">
              <v-col cols="11" md="11" sm="11" lg="11" xl="11" style="padding: 0">
                <v-text-field
                    v-model="wordSearch"
                    label="Word"
                    required
                    color="#1C0153"
                    style="font-weight: bold; font-size: 20px"
                    @keypress="searchDictionaryEnter($event)"
                ></v-text-field>
              </v-col>
              <v-col cols="1" md="1" sm="1" lg="1" xl="1">
                <v-btn @click="searchDictionary" icon>
                  <v-icon x-large>{{ icons.mdiCardSearch }}</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <DictionaryComponent :width="400" v-if="!minimized" :flat="false"/>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog max-width="500" v-model="endDialog">
      <v-card>
        <v-card-title>
          Do You Want To End This Session?
        </v-card-title>
        <v-card-subtitle>
          You can continue this session later.
        </v-card-subtitle>
        <v-card-actions>
          <v-btn @click="endTPO" color="red" style="color: white">Save & End</v-btn>
          <v-btn @click="endDialog = false" color="green" style="color: white">Continue</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import {mapGetters, mapState} from 'vuex'
import {GO_TO_NEXT_LISTENING, GO_TO_PREVIOUS_LISTENING} from "@/store/actions/listening";
import {LOAD_DICTIONARY} from "@/store/actions/dictionary";
import DictionaryComponent from "@/components/Subcomponents/DictionaryComponent";
import {mdiClose, mdiCardSearch} from '@mdi/js'
import {SAVE_TPO} from "@/store/actions/mainTPO";

export default {
  name: 'Player',
  components: {DictionaryComponent},
  data: function () {
    return {
      endDialog: false,
      sheet: false,
      dialogDict: false,
      minimized: true,
      volume_slide: 100,
      audio: {
        percentage: 0,
        timerVar: null
      },
      volume: {
        enabled: false,
        value: 0,
      },
      selected: '',
      wordSearch: '',
      icons:{
        mdiClose,
        mdiCardSearch
      }
    }
  },
  watch: {
    volume_slide: function (val) {
      document.getElementById("listening").volume = parseInt(val) / 100.0;
    },

  },
  computed: {
    ...mapGetters(['taskType',
      'taskTypeNumber',
      'lectureCount',
      'conversationCount',
      'listeningImageSource',
      'listeningSource',
      'listeningTitle',
      'listeningTranscript',
      'backAvailable']),
    ...mapState({
      listeningMode: state => state.mainTPO.mode
    })
  },
  methods: {
    endTPO() {
      this.$store.dispatch(SAVE_TPO);
    },
    closeDialogDict() {
      this.dialogDict = false;
      this.minimized = true;
      this.wordSearch = '';
    },
    searchDictionaryEnter(ev) {
      if (ev.charCode === 13) {
        this.minimized = false;
        this.$store.dispatch(LOAD_DICTIONARY, this.wordSearch)
      }
    },
    searchDictionary() {
      this.minimized = false;
      this.$store.dispatch(LOAD_DICTIONARY, this.wordSearch)
    },
    openDictionary() {
      this.dialogDict = true;
      this.$store.dispatch(LOAD_DICTIONARY, this.selected)
    },
    listeningEnded() {
      if(this.listeningMode !== 'reviewMode'){
        this.$store.dispatch(GO_TO_NEXT_LISTENING);
      }
    },
    progressListening() {
      let listening = document.getElementById('listening');
      let duration = listening.duration;
      this.audio.percentage = (listening.currentTime / duration) * 100;
    },
    show_vol() {
      this.volume.enabled = !this.volume.enabled;
    },
    toggleTimeShow() {
      this.time.enable = !this.time.enable;
    },
    goToBack() {
      this.$store.dispatch(GO_TO_PREVIOUS_LISTENING);
    }

  },
  updated() {
    let selectedText = '';

    // window.getSelection
    if (window.getSelection) {
      selectedText = window.getSelection();
    }
    // document.getSelection
    else if (document.getSelection) {
      selectedText = document.getSelection();
    }
    // document.selection
    else if (document.selection) {
      selectedText = document.selection.createRange().text;
    }
    this.selected = selectedText.toString();

  },
}


</script>

<style scoped>
progress {
  display: block; /* default: inline-block */
  width: 300px;
  height: 27px;
  /*margin: 2em auto;*/
  border: 10px rgb(129, 136, 132) solid;
  background: none;
  box-shadow: inset 0px 1px 1px rgba(0, 0, 0, 0.5), 0px 1px 0px rgba(255, 255, 255, 0.2);
}

progress::-moz-progress-bar {
  border: none;
  background: rgb(115, 245, 253);
  /*box-shadow: inset 0 -2px 4px rgba(0,0,0,0.4), 0 2px 5px 0px rgba(0,0,0,0.3);*/

}

progress::-webkit-progress-bar {
  background: black;
}

progress::-webkit-progress-value {
  background: rgb(115, 245, 253);
  /*box-shadow: inset 0 -2px 4px rgba(0,0,0,0.4), 0 2px 5px 0px rgba(0,0,0,0.3);*/
}

.toolbar {
  height: 115px;
  background: linear-gradient(to right, #4148a2, #822a42);

}

.btn {
  height: 80px;
  width: auto;

}

.qanounce {
  position: relative;
  bottom: 3ex;
  font-size: 18px;
  color: white;
  font-weight: bold;
  text-align: center;
}

</style>
<!--src="http://127.0.0.1:8000/media/listening/listening_toefl.jpeg"-->
