<template>
    <div>
        <div class="toolbar">
            <v-layout column justify-center align-space-between >
                <v-layout justify-space-between>
                    <div style="padding: 20px">
                        <v-btn dark rounded >Home</v-btn>
                    </div>
                    <v-spacer></v-spacer>

                    <img class="btn" src="../assets/reviewd.png"  style="position: relative;  left: 160px">

                    <img class="btn" src="../assets/vold.png"  style="position: relative; left: 120px">

                    <img class="btn" src="../assets/help.png"  style="position: relative; left: 80px">

                    <template v-if="this.taskNumber === 0">
                        <img class="btn" src="../assets/backd.png"  style="position: relative; left: 40px">
                    </template>
                    <template v-else>
                        <img class="btn" src="../assets/back.png"  @click="goToBack" style="position: relative; left: 40px">
                    </template>

                    <img class="btn" src="../assets/next.png" @click="goToNext" style="position: relative">

                </v-layout>
                <div>
                    <v-container fluid style="margin: 0; padding:0">
                        <v-row>
                            <v-col sm="8" lg="10" md="9" style="padding: 0">
                        <div class="qanounce">
          Passage {{ taskNumber + 1 }} of {{reading.length}}
        </div>
                            </v-col>
                        <v-col sm="4" lg="2" md="3" style="padding: 0">
                            <template v-if="time_component.enable">
                                <img src="../assets/hidetime.png" class="clock" @click="toggleTimeShow">
                            </template>
                            <template v-else>
                                <img src="../assets/showtime.png" class="clock" @click="toggleTimeShow">
                            </template>
                            <span class='time' v-show="time_component.enable">{{ this.hours | formatTime}} : {{ this.minutes | formatTime}} : {{ this.seconds | formatTime}}</span>
                        </v-col>
                        </v-row>
                    </v-container>
                </div>
            </v-layout>
        </div>
        <div style="margin: 0.5%; height: 100%">
            <v-container fluid>
                <v-row>
                    <v-col cols="12" sm="6" lg="6">
                        <div style="width: 100%; height: 100%; border: black thin solid; margin-right: 1px">
                            <v-card class="my_class" flat height="65vh" :style="{'font-size': 6 + 24*size/100 + 'px'}">
                            </v-card>
                        </div>
                    </v-col>
                    <v-col cols="12" sm="6" lg="6">
                        <div  style="width: 100%; height: 100%; border: black thin solid; margin-left: 1px">
                            <div style="background-color: #1A01CC; height: 20px; text-align: right; color: white"><span v-if="scrolled < 0.6">Beginning</span><span v-if="0.6 < scrolled & scrolled < 0.9">More Available</span><span v-if="scrolled >= 0.9">End</span></div>
                            <v-card class="my_class1" flat height="65vh"  v-on:scroll.native="onScroll">
                                <br>
                                <h2 style="text-align: center;">{{this.reading[this.taskNumber]['title']}}</h2>
                                <br>
                                <div v-html="reading[taskNumber].passage"></div>

                            </v-card>
                        </div>
                    </v-col>
                </v-row>

            </v-container>

        </div>
        <div>
            <v-dialog
                    v-model="dialog"
                    width="500">
                <v-card>
                    <v-card-title
                            class="headline"
                            primary-title
                    >
                        Warning
                    </v-card-title>

                    <v-card-text>
                        You should use the scroll bar to read the whole passage before you begin to answer the question.
                        However, the passage will appear again with each question.
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                                color="primary"
                                text
                                @click="dialog = false"
                        >
                            Ok
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import $ from 'jquery'
    export default {
        name: "ReadingPassage",
        computed: mapState(['reading', 'readingTest', 'taskNumber', 'hours', 'minutes', 'seconds']),
        data(){
            return{
                scrolledToBottom: false,
                scrolled:0,
                size: 50,
                zoom:{
                    enabled: false
                },
                time_component : {
                    enable: true,
                },
                dialog: false,
                offsetTop: 0,
            }
        },

        methods:{
            goToBack(){
                this.$store.dispatch('goToPreviousReading');
            },
            toggleTimeShow() {
                this.time_component.enable = !this.time_component.enable;
            },
            goToNext: function () {
                if (this.scrolledToBottom) {
                    this.$store.dispatch('goToNextReading');
                }
                else {
                    this.dialog = true;
                }
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

    .my_class{
        margin: 5%;
        background-color: transparent;

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
    .toolbar{
        height:110px;
        background: linear-gradient(to right, rgb(61,83,135), rgb(113,53,60)) ; ;

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