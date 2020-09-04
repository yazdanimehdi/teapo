<template>
  <v-app>
    <v-container fluid class="toolbar" style="padding: 0">
      <v-row justify="space-between" align="start"
             style="padding: 0; padding-top: 29px; padding-bottom: 12px">
        <v-col sm="6" lg="6" cols="6" md="6" style="padding: 0; padding-left: 20px">
          <v-container fluid>
            <v-row justify="start" align="start">
              <v-col style="padding: 0">
                <v-btn to="/review" dark rounded small style="margin-right: 10px"
                       v-if="speakingMode === 'reviewMode'">Back
                </v-btn>
                <v-btn @click="endDialog = true" dark rounded small style="margin-right: 10px" v-else>End</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
        <v-col sm="6" lg="4" cols="6" md="4" style="padding: 0;padding-right: 30px; ">
          <v-container fluid style="padding: 0">
            <v-row justify="end" align="start" style="padding: 0">


              <v-col cols="2" md="2" lg="2" sm="2" style="padding: 0; padding-right: 6px">
                <v-img src="../../../assets/continue.png" contain max-height="60px"
                       min-height="40px" @click="goToNext"></v-img>
              </v-col>

              <v-col cols="2" md="2" lg="2" sm="2" style="padding: 0"
                     v-if="speakingMode === 'practiceMode'">
                <v-img src="../../../assets/back.png" contain max-height="60px" min-height="40px"
                       @click="goToBack"></v-img>
              </v-col>

              <v-col cols="4" md="4" lg="4" sm="4" v-if="volume.enabled" style="padding: 0; padding-top: 10px">
                <label>
                  <input type="range" v-model="volume_slide">
                </label>
              </v-col>


              <v-col cols="2" md="2" lg="2" sm="2" style="padding: 0">
                <v-img src="../../../assets/vol.png" contain max-height="60px"
                       min-height="40px" @click="show_vol"></v-img>
              </v-col>

            </v-row>
          </v-container>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-row align="center" justify="center">
        <img src="../../../assets/direction_pic.png" height="300" width="350">
      </v-row>
      <v-row>
        <audio id="guide" autoplay v-on:ended="goToNext">
          <source :src="speakingGuidAudiFile">
        </audio>
      </v-row>
    </v-container>
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
  import { mapGetters, mapState } from 'vuex'
  import {GO_TO_NEXT_SPEAKING, GO_TO_PREVIOUS_SPEAKING} from "@/store/actions/speaking";
  import {SAVE_TPO} from "@/store/actions/mainTPO";

  export default {
    name: "DirectionSpeaking",
    methods: {
      endTPO() {
        this.$store.dispatch(SAVE_TPO);
      },
      goToBack(){
        this.$store.dispatch(GO_TO_PREVIOUS_SPEAKING)
      },

      goToNext: function () {
        this.$store.dispatch(GO_TO_NEXT_SPEAKING);
      },
      show_vol() {
        this.volume.enabled = !this.volume.enabled;
      },
    },
    data() {
      return {
        endDialog: false,
        ended: false,
        volume: {
          enabled: false
        },
        volume_slide: 50,
      }
    },
    computed:{
      ...mapGetters(['speakingGuidAudiFile']),
      ...mapState({
          speakingMode: state => state.mainTPO.mode
      })
    },
    watch: {
      volume_slide: function (val) {
        document.getElementById("listening_direction").volume = parseInt(val) / 100.0;
      }
    }
  }
</script>

<style scoped>
  .toolbar{
    height:110px;
    background: linear-gradient(to right, #4148a2,#822a42) ;

  }
  .btn {
    height: 80px;
    width: auto;

  }
  .btn_new{
    height: 42px;
    width: auto;

  }

</style>
