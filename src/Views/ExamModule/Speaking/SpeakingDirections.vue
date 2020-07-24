<template>
  <v-app>
    <v-container fluid class="toolbar" style="padding: 0">
      <v-row justify="space-between" align="start"
             style="padding: 0; padding-top: 29px; padding-bottom: 12px">
        <v-col sm="6" lg="6" cols="6" md="6" style="padding: 0; padding-left: 20px">
          <v-container fluid>
            <v-row justify="start" align="start">
              <v-col style="padding: 0">
                <v-btn to="/" dark rounded small style="margin-right: 10px;">Home</v-btn>
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

              <v-col cols="2" md="2" lg="2" sm="2" style="padding: 0">
                <v-img src="../../../assets/vol.png" contain max-height="60px"
                       min-height="40px" @click="show_vol"></v-img>
              </v-col>
              <v-col cols="4" md="4" lg="4" sm="4" v-if="volume.enabled" style="padding: 0">
                <label>
                  <input type="range" v-model="volume_slide">
                </label>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
      </v-row>
    </v-container>
   <div style="background-color: rgb(240, 231, 206);">
      <v-container>
        <v-row align="center" justify="center" class="direction">
          <div style="height: 10%"></div>
          <h2 style="text-align: center; text-shadow: 2px 2px rgba(128, 129, 120, 0.4); color: rgb(66,63,91)">Speaking Section Directions</h2>
          <div style="margin: 5%; margin-top: 3%">
            <p>In this section of the test, you will be able to demonstrate your ability to speak about a variety of topics. You will answer {{speakingLength}} questions by speaking into the microphone. Answer each of the questions as completely as possible</p>
            <p>In question type 1 and 2, you will speak about familiar topics. Your response will be scored on your ability to speak clearly and coherently about the topics.</p>
            <p>In questions type 3 and 4, you will first read a short text. The text will go away and you will then listen to a talk on the same topic. You will then be asked a question about what you have read and heard. You will need to combine appropriate information from the text and the talk to provide a complete answer to the question. Your response will be scored on your ability to speak clearly and coherently and on your ability to accurately convey information about what you read and heard.</p>
            <p>In questions type 5 and 6, you will listen to part of a conversation or a lecture. You will then be asked a question about what you heard. Your response will be scored on your ability to speak clearly and coherently and on your ability to accurately convey information about what you heard.</p>
            <p>You may take notes while you read and while you listen to the conversations and lectures. You may use your notes to help prepare your response.</p>
            <p>Listen carefully to the directions for each question. The directions will not be written on the screen.</p>
            <p>For each question you will be given a short time to prepare your response. A clock will show how much preparation time is remaining. When the preparation time is up, you will be told to begin your response. A clock will show how much response time is remaining. A message will appear on the screen when the response time has ended</p>
            <p style="text-align: center; font-weight: bold; font-style: italic;">(Click on Continue at any time to dismiss these directions.)</p>
          </div>
        </v-row>
      </v-container>
    </div>

  </v-app>
</template>

<script>
  import { mapGetters } from 'vuex'
  import {GO_TO_NEXT_SPEAKING} from "@/store/actions/speaking";

  export default {
    name: "SpeakingDirections",

    methods: {
      goToNext : function() {
        this.$store.dispatch(GO_TO_NEXT_SPEAKING)
      },
      show_vol() {
        this.volume.enabled = !this.volume.enabled;
      },
    },
    watch:{
      volume_slide: function (val) {
        document.getElementById("listening_direction").volume = parseInt(val) / 100.0;
      }
    },
    computed:{
      ...mapGetters(['speakingLength']),
    },
    data() {
      return {
        ended: false,
        state: 0,
        volume: {
          enabled: false
        },
        volume_slide: 50,
      }
    },
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
  .direction{
    margin: 2em;
    text-align: left;
    font-family: Verdana;
    font-size: 16px;
    font-weight: 400;
  }


</style>
