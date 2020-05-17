<template>
  <v-app>
    <v-container fluid class="toolbar" style="padding: 0">
      <v-row justify="space-between" align="start"
             style="padding: 0; padding-top: 29px; padding-bottom: 12px">
        <v-col sm="6" lg="6" cols="6" md="6" style="padding: 0; padding-left: 20px">
          <v-container fluid>
            <v-row justify="start" align="start">
              <v-col style="padding: 0">
                <v-btn dark rounded small style="margin-right: 10px;">Home</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
        <v-col sm="6" lg="4" cols="6" md="4" style="padding: 0;padding-right: 30px; ">
          <v-container fluid style="padding: 0">
            <v-row justify="end" align="start" style="padding: 0">

              <v-col cols="2" md="2" lg="2" sm="2" style="padding: 0">
                <v-img src="../../assets/continue.png" contain max-height="60px"
                       min-height="40px" @click="goToNext"></v-img>
              </v-col>


              <v-col cols="2" md="2" lg="2" sm="2" style="padding: 0">
                <v-img src="../../assets/vold.png" contain max-height="60px"
                       min-height="40px"></v-img>
              </v-col>
              <v-col cols="2" md="2" lg="2" sm="2" style="padding: 0">
                <v-img src="../../assets/helpd.png" contain max-height="60px"
                       min-height="40px"></v-img>

              </v-col>

              <v-col cols="2" md="2" lg="2" sm="2" style="padding: 0" v-if="writingMode ==='practiceMode' || writingMode === 'reviewMode'">
                <v-img src="../../assets/back.png" contain max-height="60px"
                       min-height="40px" @click="goToBack"></v-img>
              </v-col>

              <v-col cols="2" md="2" lg="2" sm="2" style="padding: 0">
                <v-img src="../../assets/nextd.png" contain max-height="60px"
                       min-height="40px"></v-img>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
      </v-row>
    </v-container>
    <v-container v-show="state === 0" fluid>
      <v-row justify="center" align="center">
        <img src="../../assets/direction_pic.png" height="300" width="350">
      </v-row>
      <v-row justify="center" align="center">
        <p class="direction_headset">Now put your headset</p>
      </v-row>
    </v-container>
    <v-container style="background-color: rgb(240, 231, 206)" fluid v-show="state === 1">
      <v-row align="center" justify="center">
        <div class="direction" >
          <div style="height: 10%"></div>
          <h2 style="text-align: center; text-shadow: 2px 2px rgba(128, 129, 120, 0.4); color: rgb(66,63,91)">Writing Based on Reading and Listening Directions</h2>
          <div style="margin: 5%; margin-top: 3%">
            <p>For this task, you will read a passage about an academic topic. A clock at the top of the screen will show how much time you have to read. You may take notes on the passage while you read. The passage will then be removed and you will listen to a lecture about the same topic. While you listen, you may also take notes.</p>
            <p>Then you will write a respond to a question that asks you about the relationship between the lecture you heard and the reading passage. Try to answer the question as completely as possible using information from the reading passage and the lecture. The question does <span style="font-weight: bold">not</span> ask you to express your personal opinion. You <span style="font-weight: bold">will</span> be able to see the reading passage again when it is time for you to write. You may use your notes to help you answer the question. A clock at the top of the screen will show how much time you have to write your response.</p>
            <p>Typically, an effective response will be 150 to 225 words. your response will be judged on the quality of your writing and on the completeness and accuracy of the content. If you finish your response before time is up, you may click on <span style="font-weight: bold">Next</span> to go on to the second writing task.</p>
            <p>Now you will see the reading passage. Remember it will be available to you again when you write your response. Immediately after the reading time ends, the lecture will begin, so keep your headset on untill the lecture is over. </p>
            <p style="text-align: center; font-weight: bold; font-style: italic;">(Click on Continue at any time to dismiss these directions.)</p>
          </div>
        </div>
      </v-row>
    </v-container>


  </v-app>
</template>

<script>
  import {GO_TO_PREVIOUS_WRITING, GO_TO_NEXT_WRITING} from "@/store/actions/writing";
  import {mapState} from "vuex";

  export default {
    name: "IntegratedWritingDirection",
    methods: {
      goToNext : function() {
        if (this.state === 1){
          this.$store.dispatch(GO_TO_NEXT_WRITING)
        }
        if (this.state === 0){
          this.state += 1
        }
      },
      goToBack(){
        if (this.state === 1){
          this.state = this.state - 1
        }
        if (this.state === 0){
          this.$store.dispatch(GO_TO_PREVIOUS_WRITING)
        }
      }
    },
    computed:{
      ...mapState({
        writingMode: state => state.writing.writingMode
      })
    },
    data() {
      return {
        ended: false,
        state: 0,
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
    .direction_headset{
    text-align: center;
    font-family: Verdana;
    font-size: 16px;
    font-weight: bold;
  }

</style>
