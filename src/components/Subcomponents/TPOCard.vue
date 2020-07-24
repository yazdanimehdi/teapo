<template>
    <v-hover v-slot:default="{ hover }">
        <v-card width="100%" height="200px" flat
                style="border-radius: 30px"
                :color="cardBackgroundColor">
            <v-card-title class="tpo-title">
                TPO 38
            </v-card-title>
            <v-card-text style="color: white; padding: 0" >
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
                                                color="#5A4389"
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
                                                :value="(readingScore/30)*100"
                                                color="teal accent-1"
                                                v-if="readingCompleted"
                                        >{{readingScore}}</v-progress-circular>
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
                                                :value="(listeningScore/30)*100"
                                                color="indigo lighten-4"
                                                v-if="listeningCompleted"
                                        >{{listeningScore}}</v-progress-circular>
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
                                                :value="(speakingScore/30)*100"
                                                color="deep-orange lighten-3"
                                                v-if="speakingCompleted"
                                        >{{speakingScore}}</v-progress-circular>
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
                                                :value="(writingScore/30)*100"
                                                color="red accent-2"
                                                v-if="writingCompleted"
                                        >{{writingScore}}</v-progress-circular>
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
</template>

<script>
    import {START_TPO} from "@/store/actions/mainTPO";

    export default {
        name: "TPOCard",
        props:{
            tpoId:{
                required: true,
                type: Number,
            },
            mode:{
                required: true,
                type: String
            }
        },
        beforeDestroy () {
            clearInterval(this.interval)
        },
        data(){
            return{
                downloaded: true,
                downloadValue: 0,
                downloadQuery: false,
                downloadShow: false,
                interval: 0,
                readingScore: 30,
                readingCompleted: false,
                listeningScore: 20,
                listeningCompleted: true,
                speakingScore: 25,
                speakingCompleted: true,
                writingScore: 21,
                writingCompleted: true,
                standard: true,
            }
        },
        computed:{
          cardBackgroundColor(){
              if(this.downloaded){
                  if(this.readingCompleted && this.listeningCompleted && this.speakingCompleted && this.writingCompleted){
                      return 'success'
                  }
                  else {
                      if(this.standard){
                          return '#5A4389'
                      }
                      else {
                          return 'red'
                      }
                  }
              }
              else {
                  if(this.standard){
                      return '#1C0153'
                  }
                  else{
                      return '#640202'
                  }
              }
          }
        },
        methods:{
            goToTPO(){
                this.$store.dispatch(START_TPO, {
                    'examArray': ['Reading', 'Listening', 'Speaking', 'Writing'],
                    'TPO': `tpo${this.tpoId}`,
                    'mode': this.mode
                })
                this.$router.push('/tpo')
            },
            goToReading(){
                this.$store.dispatch(START_TPO, {
                    'examArray': ['Reading'],
                    'TPO': `tpo${this.tpoId}`,
                    'mode': this.mode
                })
                this.$router.push('/tpo')
            },
            goToListening(){
                this.$store.dispatch(START_TPO, {
                    'examArray': ['Listening'],
                    'TPO': `tpo${this.tpoId}`,
                    'mode': this.mode
                })
                this.$router.push('/tpo')
            },
            goToSpeaking(){
                this.$store.dispatch(START_TPO, {
                    'examArray': ['Speaking'],
                    'TPO': `tpo${this.tpoId}`,
                    'mode': this.mode
                })
                this.$router.push('/tpo')
            },
            goToWriting(){
                this.$store.dispatch(START_TPO, {
                    'examArray': ['Writing'],
                    'TPO': `tpo${this.tpoId}`,
                    'mode': this.mode
                })
                this.$router.push('/tpo')
            },
            downloadTPO (){
                this.queryAndIndeterminate();
            },
            queryAndIndeterminate () {
                this.downloadQuery = true
                this.downloadShow = true
                this.downloadValue = 0
                setTimeout(() => {
                    this.downloadQuery = false
                    this.interval = setInterval(() => {
                        if (this.downloadValue === 100) {
                            clearInterval(this.interval)
                            this.DownloadShow = false
                            return setTimeout(this.queryAndIndeterminate, 2000)
                        }
                        this.downloadValue += 25
                    }, 1000)
                }, 2500)
            },
        },
    }
</script>

<style scoped>
    .progress-class{
        background-color: rgba(246, 245, 242, 0.4);
    }
    .tpo-title{
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
    .progress-row{
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 10px;
        font-size: 16px;
        font-weight: bold;
    }
</style>