<template>
    <v-app>
        <v-container fluid class="toolbar" style="padding: 0">
            <v-row justify="space-between" align="start"
                   style="padding: 0; padding-top: 29px; padding-bottom: 12px">
                <v-col sm="6" lg="6" cols="6" md="6" style="padding: 0; padding-left: 20px">
                    <v-container fluid>
                        <v-row justify="start" align="start">
                            <v-col style="padding: 0">
                                <v-btn @click="endDialog = true" dark rounded small style="margin-right: 10px;">End</v-btn>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-col>
                <v-col sm="6" lg="4" cols="6" md="4" style="padding: 0;padding-right: 30px; ">
                    <v-container fluid style="padding: 0">
                        <v-row justify="end" align="start" style="padding: 0">

                            <v-col cols="2" md="2" lg="2" sm="2" style="padding: 0">
                                <v-img src="../../../assets/continue.png" contain max-height="60px"
                                       min-height="40px" @click="goToNext"></v-img>
                            </v-col>


                            <v-col cols="2" md="2" lg="2" sm="2" style="padding: 0">
                                <v-img src="../../../assets/vold.png" contain max-height="60px"
                                       min-height="40px"></v-img>
                            </v-col>
                            <v-col cols="2" md="2" lg="2" sm="2" style="padding: 0">
                                <v-img src="../../../assets/helpd.png" contain max-height="60px"
                                       min-height="40px"></v-img>

                            </v-col>

                            <v-col cols="2" md="2" lg="2" sm="2" style="padding: 0" v-if="writingMode ==='practiceMode' || writingMode === 'reviewMode'">
                                <v-img src="../../../assets/back.png" contain max-height="60px"
                                       min-height="40px" @click="goToBack"></v-img>
                            </v-col>

                            <v-col cols="2" md="2" lg="2" sm="2" style="padding: 0">
                                <v-img src="../../../assets/nextd.png" contain max-height="60px"
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
                    <h2 style="text-align: center; text-shadow: 2px 2px rgba(128, 129, 120, 0.4); color: rgb(66,63,91)">Writing Section Directions</h2>
                    <div style="margin: 5%; margin-top: 3%">
                        <p style="font-weight: bold">Make sure your headset is on.</p>
                        <p>This section measures your ability to use writing to communicate in an academic environment. There will be two writing tasks.</p>
                        <p>For the first writing task, you will read a passage and listen to a lecture and then answer a question based on what you have read and heard. For the second writing task, you will answer a question based on your own knowledge and experience.</p>
                        <p>Now listen to the directions for the first writing task.</p>
                        <p style="font-weight: bold; text-align: center">(Click on Continue at any time to dismiss these directions.)</p>
                    </div>
                </div>
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
    import {GO_TO_NEXT_WRITING, GO_TO_PREVIOUS_WRITING} from "@/store/actions/writing";
    import {mapState} from 'vuex'
    import {SAVE_TPO} from "@/store/actions/mainTPO";

    export default {
        name: "WritingDirection",
        methods: {
          endTPO() {
            this.$store.dispatch(SAVE_TPO);
          },
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
              endDialog: false,
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
</style>