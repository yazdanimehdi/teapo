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
    <v-container fluid style="background-color: rgb(240, 231, 206);height: 100%">
      <v-row align="center" justify="center" >
        <div class="direction">
          <div style="height: 10%"></div>
          <h2 style="text-align: center; text-shadow: 2px 2px rgba(128, 129, 120, 0.4); color: rgb(66,63,91)">Writing Based on Knowledge and Experience Directions</h2>
          <div style="margin: 5%; margin-top: 3%">
            <p>For this task, you will write an essay in response to a question that asks you to state, explain, and support your opinion on an issue. A clock at the top of the screen will show how much time you have to plan, write and revise your essay.</p>
            <p>Typically, an effective essay will contain a minimum of 300 words. Your essay will be judged on the quality of your writing. This includes the development of your idea, the organization of your essay, and the quality and accuracy of the language you use to express your ideas.</p>
            <p>If you finish your essay before time is up, you may click on <span style="font-weight: bold;">Next</span> to end this section.</p>
            <p>Click on <span style="font-weight: bold">Continue</span> to go on.</p>
          </div>
        </div>
      </v-row>
    </v-container>

  </v-app>
</template>

<script>
  import {GO_TO_NEXT_WRITING, GO_TO_PREVIOUS_WRITING} from '@/store/actions/writing'
  import {mapState} from 'vuex'

  export default {
    name: "IndependentWritingDirection",
    methods: {
      goToNext : function() {
        this.$store.dispatch(GO_TO_NEXT_WRITING)
      },
      goToBack(){
        this.$store.dispatch(GO_TO_PREVIOUS_WRITING)
      }
    },
    computed:{
      ...mapState({
        writingMode: state => state.mainTPO.mode
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



</style>
