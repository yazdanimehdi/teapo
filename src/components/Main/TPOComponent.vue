<template>
    <div :style="{'width': `${width}px`, 'font-family':'kalam'}">
        <v-container fluid style="overflow-y: scroll;margin-top: 0; padding-top: 0">
            <v-row>
                <v-container style="width: 500px; margin-top: 0; padding-top: 0">
                    <v-row justify="center" align="center">
                        <v-col cols="6" sm="6" md="6" lg="6" xl="6" style="margin-right: 0; padding-right: 0">
                            <v-btn block depressed height="47px" style="border-radius: 35px 0 0 35px"
                                   :color="practice?'#1C0153':'#E6E6E6'" @click="practice=true">
                                <div :style="{'color': practice?'#E6E6E6':'#1C0153', 'font-weight': 'bold'}">Practice
                                </div>
                            </v-btn>
                        </v-col>
                        <v-col cols="6" sm="6" md="6" lg="6" xl="6" style="margin-left: 0; padding-left: 0">
                            <v-btn block depressed height="47px" style="border-radius: 0 35px 35px 0"
                                   :color="!practice?'#1C0153':'#E6E6E6'" @click="practice=false">
                                <div :style="{'color': !practice?'#E6E6E6':'#1C0153', 'font-weight': 'bold'}">Test</div>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-container>
            </v-row>
            <v-row>
                <v-container fluid>
                    <v-row>
                        <v-col v-for="(tpo, i) in tpoList" cols="12" sm="6" md="6" lg="4" :key="i">
                            <TPOCard :tpo-title="tpo.title" :tpo-id="tpo.id" :standard="tpo.mode === 'T'"  :mode="practice ? 'practiceMode' : 'testMode'"/>
                        </v-col>
                    </v-row>
                </v-container>
            </v-row>

        </v-container>
    </div>
</template>

<script>
    import TPOCard from "@/components/Subcomponents/TPOCard";
    import {GET_LOCAL_TPO_LIST, GET_ONLINE_TPO_LIST} from "@/store/actions/TPOPage";
    import {mapGetters} from 'vuex'

    export default {
        name: "TPOComponent",
        props: {
            width: {
                required: true,
                type: Number
            }
        },
        components: {
            TPOCard
        },
        computed:{
          ...mapGetters(['connected', 'onlineTPOList', 'localTPOList']),
            tpoList(){
              if(this.connected === true){
                  return [...this.localTPOList, ...this.onlineTPOList]
              }
              else {
                  return this.localTPOList
              }
            }
        },
        created(){
          if(this.connected === true){
              this.$store.dispatch(GET_ONLINE_TPO_LIST).catch(() => {
                console.log('not connected')
              })
              this.$store.dispatch(GET_LOCAL_TPO_LIST)
          }
          else{
              this.$store.dispatch(GET_LOCAL_TPO_LIST)
          }
        },
        data() {
            return {
                practice: true
            }
        }
    }
</script>

<style scoped>

</style>