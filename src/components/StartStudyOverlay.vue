<template>
        <v-card light style="position: fixed; font-family: kalam">
            <v-toolbar color="#1C0153" flat height="150px">
                <v-toolbar-title style="margin: 40px; color: white">Study Now</v-toolbar-title>
                <v-spacer></v-spacer>
                    <v-btn icon @click="$emit('close')" style="margin: 40px"><v-icon color="white">{{icons.mdiClose}}</v-icon></v-btn>
            </v-toolbar>
            <v-card-text style="font-weight: bold; font-size: 26px; text-align: center">
                <v-container fluid>
                    <v-row align="center" justify="center" :style="{'height': `${height - 180}px`}">
                        <v-col cols="3" md="3" sm="3" lg="3" xl="3">
                            <div>
                                <v-btn icon height="120" width="120" @click="goToLearning"><v-icon size="100">{{icons.mdiTeach}}</v-icon></v-btn>
                            </div>
                            <div>
                                Learn New Words
                            </div>
                        </v-col>

                        <v-col cols="3" md="3" sm="3" lg="3" xl="3">
                            <div>
                                <v-btn icon height="120" width="120"><v-icon size="100">{{icons.mdiViewCarousel}}</v-icon></v-btn>
                            </div>
                            <div>
                                Classic Review
                            </div>
                        </v-col>

                        <v-col cols="3" md="3" sm="3" lg="3" xl="3">
                            <div>
                                <v-btn icon height="120" width="120"><v-icon size="100">{{icons.mdiBomb}}</v-icon></v-btn>
                            </div>
                            <div>
                                Speed Review
                            </div>
                        </v-col>

                        <v-col cols="3" md="3" sm="3" lg="3" xl="3">
                            <div>
                                <v-btn icon height="120" width="120"><v-icon size="100">{{icons.mdiAlien}}</v-icon></v-btn>
                            </div>
                            <div>
                                Difficult Words
                            </div>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>

        </v-card>
</template>

<script>
    import {mdiClose, mdiBomb, mdiTeach, mdiViewCarousel, mdiAlien} from '@mdi/js'
    import {START_STUDY_LEARNING} from "@/store/actions/studyWords";
    export default {
        name: "StartStudyOverlay",
        props: {
            height: {
                required: true,
                type: Number
            }
        },
        data(){
            return{
                icons:{
                    mdiClose,
                    mdiBomb,
                    mdiTeach,
                    mdiViewCarousel,
                    mdiAlien
                }
            }
        },
        methods:{
            goToLearning(){
                this.$store.dispatch(START_STUDY_LEARNING);
                this.$router.push('/new_words')
            }
        }
    }
</script>

<style scoped>

</style>