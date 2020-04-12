<template>
  <div style="position: fixed">
    <link rel="stylesheet"
        href="https://use.fontawesome.com/releases/v5.2.0/css/all.css"
        integrity="sha384-hWVjflwFxL6sNzntih27bfxkr27PmbbK/iSvJ+a4+0owXq79v+lsFkW54bOGbiDQ"
        crossorigin="anonymous">
    <div v-show="!review.enable">
      <div class="toolbar">
        <v-layout column justify-center align-space-between >
          <v-layout justify-space-between>
            <div style="padding: 20px">
              <v-btn dark rounded >Home</v-btn>
            </div>
            <v-spacer></v-spacer>

            <img class="btn" src="../assets/review.png" @click="toggleReviewShow" style="position: relative;  left: 160px">

            <img class="btn" src="../assets/vold.png"  style="position: relative; left: 120px">

            <img class="btn" src="../assets/helpd.png"  style="position: relative; left: 80px">

            <img class="btn" src="../assets/back.png" @click="goToBack" style="position: relative; left: 40px">

            <img class="btn" src="../assets/next.png" @click="goToNext" style="position: relative">

          </v-layout>
          <div>
            <v-container fluid style="margin: 0; padding:0">
              <v-row>
                <v-col sm="8" lg="10" md="9" style="padding: 0">
                  <div class="qanounce">
                    Question {{this.questionCount + this.questionNumber + 1}} of {{readingAllQuestionsNumber}}
                  </div>
                </v-col>
                <v-col sm="4" lg="2" md="3" style="padding: 0">
                  <template v-if="time_component.enable">
                    <img src="../assets/hidetime.png" class="clock" @click="toggleTimeShow">
                  </template>
                  <template v-else>
                    <img src="../assets/showtime.png" class="clock" @click="toggleTimeShow">
                  </template>
                  <span class='time' v-if="this.time_component.enable">{{ this.hours | formatTime}} : {{ this.minutes | formatTime}} : {{ this.seconds | formatTime}}</span>
                </v-col>
              </v-row>
            </v-container>
          </div>
        </v-layout>
      </div>
      <div style="margin: 0.5%">
        <v-container fluid>
          <v-row>
            <v-col cols="12" lg="6" sm="6">
          <div style="width: 100%; height: 100%; border: black thin solid; margin-right: 1px">
            <v-card class="my_class" flat height="73vh" :style="{'font-size': 6 + 24*size/100 + 'px'}">
              <br>
              <br>
              <div class="question"><span>{{this.reading[this.taskNumber].questions[this.questionNumber].question}}</span></div>
              <br>
              <div class="question"><span style="font-weight: bold">{{this.reading[this.taskNumber].questions[this.questionNumber].insertion_sentence}}</span></div>
              <br>
              <span>Paragraph {{this.reading[this.taskNumber].questions[this.questionNumber].related_paragraph}} is marked with an arrow [<i class="fas fa-arrow-right"></i>]</span>
            </v-card>
          </div>
            </v-col>
            <v-col cols="12" lg="6" sm="6">
          <div  style="width: 100%; height: 100%; border: black thin solid; margin-left: 1px">
            <div style="background-color: #1A01CC; height: 20px; text-align: right; color: white"><span v-if="scrolled < 0.6">Beginning</span><span v-if="0.6 < scrolled & scrolled < 0.9">More Available</span><span v-if="scrolled >= 0.9">End</span></div>
            <v-card class="my_class1" flat height="73vh" v-on:scroll.native="onScroll" :style="{'font-size': 6 + 24*size/100 + 'px'}">
              <br>
              <h2 style="text-align: center;">{{this.reading[this.taskNumber].questions[this.questionNumber].related_passage_title}}</h2>
              <br>
              <div id="passage"></div>

            </v-card>
          </div>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </div>
  </div>
</template>

<script>

  import $ from 'jquery'
  import { mapState } from 'vuex'
  export default {
    name: "ReadingInsertion",
    data(){
      return{
        inserted_number: null,
        scrolled: 0,
        size: 50,
        time_component : {
          enable: true,
        },
        answer : [],
        multi:false,
        review:{
          enable:false
        },
        questionCount:0,
      }
    },
    computed:{
      ...mapState(['reading', 'hours', 'minutes', 'seconds', 'taskNumber', 'questionNumber', 'readingAnswers', 'readingAllQuestionsNumber'])
    },
    watch: {
      questionNumber: function (newVal) {
        document.getElementById('passage').innerHTML = this.reading[this.taskNumber].questions[newVal].related_passage;
        if (this.reading[this.taskNumber].questions[newVal].related_paragraph) {
          var elmnt = $(`#passage #${this.reading[this.taskNumber].questions[newVal].related_paragraph}`)[0];
          elmnt.scrollIntoView();
        }
        let self = this;

        if (this.reading[this.taskNumber].questions[newVal].id in this.readingAnswers){
          this.answer = this.readingAnswers[this.reading[this.taskNumber].questions[newVal].id];
          document.getElementById(`insert${this.answer}`).innerText = '[' + self.reading[self.taskNumber].questions[self.questionNumber].insertion_sentence + ']';
        }
        else {
          this.answer = []
        }

      }
    },
    methods: {
      goToBack(){
        this.$store.dispatch('saveAnswersReading', [this.reading[this.taskNumber].questions[this.questionNumber].id, this.answer]);
        this.$store.dispatch('goToPreviousReading');
      },
      // toggleReviewShow(){
      //   this.$store.dispatch('saveAnswersReading', [this.exam['reading'][this.task_number].questions[this.question_number].id, this.answer]);
      //   this.$store.dispatch('toggleReview');
      // },

      toggleTimeShow() {
        this.time_component.enable = !this.time_component.enable;
      },
      goToNext: function () {
        this.$store.dispatch('saveAnswersReading', [this.reading[this.taskNumber].questions[this.questionNumber].id, this.answer]);
        this.$store.dispatch('goToNextReading');

      },
      onScroll () {
        var self = this;
        $(".my_class1").scroll(function(){
          self.scrolled = ($(this).scrollTop() + $(this).outerHeight())/$(this)[0].scrollHeight;
          if(self.scrolled >= 0.95) {
            self.scrolledToBottom = true;
          }


        });
      },
      toggleReviewShow(){
        this.$store.dispatch('saveAnswersReading', [this.reading[this.taskNumber].questions[this.questionNumber].id, this.answer]);
        this.$store.dispatch('toggleReview');
      },

    },
    updated(){
      var self = this;
      document.getElementById('insert1').addEventListener('click', function() {
        self.answer = "1";
        document.getElementById('insert1').innerText = '[' + self.reading[self.taskNumber].questions[self.questionNumber].insertion_sentence + ']';
        document.getElementById('insert2').innerText = '[]';
        document.getElementById('insert3').innerText = '[]';
        document.getElementById('insert4').innerText = '[]';
      }, false);
      document.getElementById('insert2').addEventListener('click', function() {
        self.answer = "2";
        document.getElementById('insert2').innerText = '[' + self.reading[self.taskNumber].questions[self.questionNumber].insertion_sentence + ']';
        document.getElementById('insert1').innerText = '[]';
        document.getElementById('insert3').innerText = '[]';
        document.getElementById('insert4').innerText = '[]';

      }, false);
      document.getElementById('insert3').addEventListener('click', function() {
        self.answer = "3";
        document.getElementById('insert3').innerText = '[' + self.reading[self.taskNumber].questions[self.questionNumber].insertion_sentence + ']';
        document.getElementById('insert2').innerText = '[]';
        document.getElementById('insert1').innerText = '[]';
        document.getElementById('insert4').innerText = '[]';
      }, false);
      document.getElementById('insert4').addEventListener('click', function() {
        self.answer = "4";
        document.getElementById('insert4').innerText = '[' + self.reading[self.taskNumber].questions[self.questionNumber].insertion_sentence + ']';
        document.getElementById('insert1').innerText = '[]';
        document.getElementById('insert2').innerText = '[]';
        document.getElementById('insert3').innerText = '[]';
      }, false);

    },
    mounted() {
      let k;
      for(k=0;k<this.taskNumber;k++){
        this.questionCount = this.questionCount+this.reading[k].questions.length
      }
      document.getElementById('passage').innerHTML = this.reading[this.taskNumber].questions[this.questionNumber].related_passage;
      $("a").css("color", "blue");
      var elmnt = $(`#passage #${this.reading[this.taskNumber].questions[this.questionNumber].related_paragraph}`)[0];
      elmnt.scrollIntoView();
      let self = this
      $(".my_class1").scroll(function() {
        self.scrolled = ($(this).scrollTop() + $(this).outerHeight()) / $(this)[0].scrollHeight;
      });
      if (this.reading[this.taskNumber].questions[this.questionNumber].id in this.readingAnswers){
        this.answer = this.readingAnswers[this.reading[this.taskNumber].questions[this.questionNumber].id];
        document.getElementById(`insert${this.answer}`).innerText = '[' + self.reading[self.taskNumber].questions[self.questionNumber].insertion_sentence + ']';
      }
      else {
        this.answer = []
      }
    },
  }

</script>

<style scoped>
  .qanounce{
    position: relative;
    bottom: 1ex;
    font-size: 18px;
    color: white;
    font-weight: bold;
    text-align: center;
  }

  .clock{
    height: 30px;
    width: auto;
    position: relative;
    bottom: 6px;
    right: 30px;
  }
  ::-webkit-scrollbar {
    width: 18px;
  }

  ::-webkit-scrollbar-track {
    background: rgb(239, 238, 241);
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);
  }
  ::-webkit-scrollbar-thumb {
    background-color: rgb(203,213,236);
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);
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
  .btn {
    height: 80px;
    width: auto;

  }
  .my_class{
    margin: 1%;
    margin-left: 3%;

  }
  .my_class1{
    background-color: transparent;
    overflow-y: scroll;
    margin: 1%;
  }
  div{
    font-family: Verdana;
    font-weight: normal;
  }
  .label{
    padding-left: 1em;
  }
  /deep/ mark{
    background-color: #c8c8c8;
  }
  /*#question{*/
  /*    font-size: 16px;*/
  /*}*/
  .toolbar {
    height: 110px;
    background: linear-gradient(to right, rgb(61,83,135), rgb(113,53,60)) ;
  }

  .view_text{
    align-items: flex-start;
    background-attachment: scroll;
    background-clip: border-box;
    background-color: rgba(0, 0, 0, 0);
    background-image: none;
    background-origin: padding-box;
    background-position-x: 0%;
    background-position-y: 0%;
    background-size: auto;
    border-bottom-color: rgba(0, 0, 0, 0.2);
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-image-outset: 0px;
    border-image-repeat: stretch;
    border-image-slice: 100%;
    border-image-source: none;
    border-image-width: 1;
    border-left-color: rgba(0, 0, 0, 0.2);
    border-left-style: solid;
    border-left-width: 1px;
    border-right-color: rgba(0, 0, 0, 0.2);
    border-right-style: solid;
    border-right-width: 1px;
    border-top-color: rgba(0, 0, 0, 0.2);
    border-top-style: solid;
    border-top-width: 1px;
    box-shadow: rgba(255, 255, 255, 0.45) -1px 1px 2px 0px inset, rgba(0, 0, 0, 0.4) -1px -2px 2px 0px inset;
    box-sizing: border-box;
    color: rgba(255, 255, 255, 0.3);
    cursor: default;
    direction: ltr;
    display: inline-block;
    font-family: "Open Sans", sans-serif;
    font-size: 10px;
    font-stretch: 50%;
    font-style: normal;
    font-variant-caps: normal;
    font-variant-east-asian: normal;
    font-variant-ligatures: normal;
    font-variant-numeric: normal;
    font-weight: 500;
    height: 35px;
    letter-spacing: normal;
    line-height: 10px;
    margin-bottom: 0px;
    margin-left: 4px;
    margin-right: 4px;
    margin-top: 0px;
    outline-color: rgb(255, 255, 255);
    outline-style: none;
    outline-width: 0px;
    overflow-x: visible;
    overflow-y: visible;
    padding-bottom: 6px;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 6px;
    text-align: center;
    text-indent: 0px;
    text-rendering: auto;
    text-shadow: none;
    text-size-adjust: 100%;
    text-transform: none;
    width: 60px;
    word-spacing: 0px;
    writing-mode: horizontal-tb;
    -webkit-appearance: none;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    -webkit-border-image: none;

  }

  .time{
    font-size: 20px;
    position: relative;
    bottom: 1ex;
    color: white;
    right: 20px;
  }
  .question{
    font-size: 20px;
    font-family: Verdana;
  }
  label{
    padding-left: 1em;
  }

</style>
