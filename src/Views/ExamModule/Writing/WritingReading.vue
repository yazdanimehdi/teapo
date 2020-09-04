<template>
  <v-app style="position: fixed">
    <v-container fluid class="toolbar" style="padding: 0">
      <v-row justify="space-between" align="start"
             style="padding: 0; padding-top: 19px; padding-bottom: 12px">
        <v-col sm="6" lg="6" cols="6" md="6" style="padding: 0; padding-left: 20px">
          <v-container fluid>
            <v-row justify="start" align="start">
              <v-col style="padding: 0">
                <v-btn to="/review" dark rounded small style="margin-right: 10px"
                       v-if="writingMode === 'reviewMode'">Back
                </v-btn>
                <v-btn @click="endDialog = true" dark rounded small style="margin-right: 10px;" v-else>End</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
        <v-col sm="6" lg="4" cols="6" md="4" style="padding: 0;padding-right: 30px; ">
          <v-container fluid style="padding: 0">
            <v-row justify="end" align="start" style="padding: 0">

              <v-col cols="2" md="2" lg="2" sm="2" style="padding: 0">
                <v-img src="../../../assets/vold.png" contain max-height="60px"
                       min-height="40px"></v-img>
              </v-col>
              <v-col cols="2" md="2" lg="2" sm="2" style="padding: 0">
                <v-img src="../../../assets/helpd.png" contain max-height="60px"
                       min-height="40px"></v-img>

              </v-col>
              <v-col cols="2" md="2" lg="2" sm="2" style="padding: 0" v-if="writingMode ==='practiceMode'">
                <v-img src="../../../assets/back.png" @click="goToBack" contain
                       max-height="60px" min-height="40px"></v-img>
              </v-col>
              <v-col cols="2" md="2" lg="2" sm="2" style="padding: 0" v-if="writingMode ==='practiceMode' || writingMode === 'reviewMode'">
                <v-img src="../../../assets/next.png" @click="goToNext" contain
                       max-height="60px" min-height="40px"></v-img>
              </v-col>
              <v-col cols="2" md="2" lg="2" sm="2" style="padding: 0" v-else>
                <v-img src="../../../assets/nextd.png" contain
                       max-height="60px" min-height="40px"></v-img>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
      </v-row>
      <v-row justify="center" align="start">
        <v-container fluid style="margin: 0; padding:0">
          <v-row justify="end" align="start">
            <v-col sm="4" lg="2" md="3" style="padding: 0; max-width: 250px">
              <template v-if="time_component.enable">
                <img src="../../../assets/hidetime.png" class="clock" @click="toggleTimeShow">
              </template>
              <template v-else>
                <img src="../../../assets/showtime.png" class="clock" @click="toggleTimeShow">
              </template>
              <span class='time' v-if="this.time_component.enable">{{formattedHours}} : {{formattedMinutes}} : {{formattedSeconds}}</span>
            </v-col>
          </v-row>
        </v-container>
      </v-row>
    </v-container>
    <v-container fluid>
      <v-row>
      <div class="directions"></div>
        </v-row>
      <v-row>
      <v-col cols="12" sm="6" lg="6">
        <div class="right"><div style="padding: 15px;">{{writingReading}}</div></div>
      </v-col>
        <v-col cols="12" sm="6" lg="6">
        <div class="writing"></div>
        </v-col>
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
  import { mapState, mapGetters } from 'vuex'
  import {GO_TO_NEXT_WRITING, GO_TO_PREVIOUS_WRITING} from "@/store/actions/writing";
  import {SAVE_TPO} from "@/store/actions/mainTPO";
  export default {
    name: "WritingReading",
    data() {
      return {
        endDialog: false,
        time_component: {
          enable: true,
          minutes: 0,
          seconds: 0,
          hours: 0,
          seconds_count: 0,
        }
      }
    },
    computed:{
      ...mapGetters(['writingReading', 'formattedHours', 'formattedMinutes', 'formattedSeconds']),
      ...mapState({
        writingMode: state => state.mainTPO.mode,
        totalTime : state => state.time.totalTime
      })
    },
    watch:{
      totalTime: function (newVal) {
        if(newVal === 0){
          this.$store.dispatch(GO_TO_NEXT_WRITING);
        }
      }
    },
    methods: {
      endTPO() {
        this.$store.dispatch(SAVE_TPO);
      },
      goToNext: function () {
        this.$store.dispatch(GO_TO_NEXT_WRITING);
      },
      goToBack(){
        this.$store.dispatch(GO_TO_PREVIOUS_WRITING);
      },
      toggleTimeShow() {
        this.time_component.enable = !this.time_component.enable;
      },
    },
  }
</script>

<style scoped>
  ::-webkit-scrollbar {
    width: 18px;
  }

  ::-webkit-scrollbar-track {
    background: rgb(239, 238, 241);
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
  }

  ::-webkit-scrollbar-thumb {
    background-color: rgb(203, 213, 236);
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
  }

  ::-webkit-scrollbar-button {
    background-color: #bbbbbb;
    display: block;
    height: 20px;
    width: 30px;
  }

  ::-webkit-scrollbar-button:start:decrement,
  ::-webkit-scrollbar-button:end:increment {
    display: block;
  }

  /* Turn off the down area up on top, and up area on bottom */
  ::-webkit-scrollbar-button:vertical:start:increment,
  ::-webkit-scrollbar-button:vertical:end:decrement {
    display: none;
  }


  .writing{
    border: black solid thin;
    height: 63vh;
    font-family: Verdana;
    font-weight: normal;font-size: 16px;
    margin: 1.5px;
    width: 100%;
    background-color: rgb(196, 199, 215);
  }
  .right{
    border: black solid thin;
    height: 63vh;
    overflow-y: scroll;
    width: 100%;
    font-family: Verdana;
    font-weight: normal;font-size: 14px;
    margin: 1.5px;
  }
  .directions{
    border: black solid thin; height: 100px;
    font-family: Verdana;
    margin: 10px;
    margin-top: 0;
    font-weight: 500;font-size: 14px;
    background-color: rgb(196, 199, 215);
    width: 100%;
  }
  .toolbar{
    height:110px;
    background: linear-gradient(to right, #4148a2,#822a42) ;

  }
  .clock{
    height: 30px;
    width: auto;
    position: relative;
    bottom: 6px;
    right: 30px;
  }

  .btn {
    height: 80px;
    width: auto;

  }
  .time{
    font-size: 20px;
    position: relative;
    bottom: 1ex;
    color: white;
    right: 20px;
  }
</style>
