<template>
    <v-card light style="position: fixed; font-family: kalam">
        <v-toolbar color="#1C0153" flat height="150px">
            <v-toolbar-title style="margin: 40px; color: white">Study Now</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="$emit('close')" style="margin: 40px">
                <v-icon color="white">{{icons.mdiClose}}</v-icon>
            </v-btn>
        </v-toolbar>
        <v-card-text style="font-weight: bold; font-size: 26px; text-align: center">
            <v-container fluid>
                <v-row align="center" justify="center" :style="{'height': `${height - 180}px`}">
                    <v-col cols="3" md="3" sm="3" lg="3" xl="3">
                        <div>
                            <v-btn icon height="120" width="120" @click="goToLearning"
                                   :disabled="learningStateCount === 0">
                                <v-badge color="red"
                                         :content="`${learningStateCount}`"
                                         v-if="learningStateCount !== 0"
                                >
                                    <v-icon size="100">{{icons.mdiTeach}}</v-icon>
                                </v-badge>
                                <v-icon size="100" v-else>{{icons.mdiTeach}}</v-icon>
                            </v-btn>
                        </div>
                        <div :style="{'color' : learningStateCount === 0 ? 'rgb(189, 189, 189)' : 'rgb(102, 102, 102)'}">
                            Learn New Words
                        </div>
                    </v-col>

                    <v-col cols="3" md="3" sm="3" lg="3" xl="3">
                        <div>
                            <v-btn icon @click="goToReviewing" height="120" width="120"
                                   :disabled="reviewingStateCount === 0">
                                <v-badge color="red"
                                         :content="`${reviewingStateCount}`"
                                         v-if="reviewingStateCount !== 0"
                                >
                                    <v-icon size="100">{{icons.mdiViewCarousel}}</v-icon>
                                </v-badge>
                                <v-icon size="100" v-else>{{icons.mdiViewCarousel}}</v-icon>
                            </v-btn>
                        </div>
                        <div :style="{'color' : reviewingStateCount === 0 ? 'rgb(189, 189, 189)' : 'rgb(102, 102, 102)'}">
                            Classic Review
                        </div>
                    </v-col>

                    <v-col cols="3" md="3" sm="3" lg="3" xl="3">
                        <div>
                            <v-btn icon @click="goToSpeedReview" height="120" width="120"
                                   :disabled="learntWordsCount === 0">
                                <v-badge color="red"
                                         :content="`${learntWordsCount}`"
                                         v-if="learntWordsCount !== 0"
                                >
                                    <v-icon size="100">{{icons.mdiBomb}}</v-icon>
                                </v-badge>
                                <v-icon size="100" v-else>{{icons.mdiBomb}}</v-icon>
                            </v-btn>
                        </div>
                        <div :style="{'color' : learntWordsCount === 0 ? 'rgb(189, 189, 189)' : 'rgb(102, 102, 102)'}">
                            Speed Review
                        </div>
                    </v-col>

                    <v-col cols="3" md="3" sm="3" lg="3" xl="3">
                        <div>
                            <v-btn icon @click="goToDifficultWords" height="120" width="120" :disabled="difficultStateCount === 0">
                                <v-badge color="red"
                                         :content="`${difficultStateCount}`"
                                         v-if="difficultStateCount !== 0"
                                >
                                    <v-icon size="100">{{icons.mdiAlien}}</v-icon>
                                </v-badge>
                                <v-icon size="100" v-else>{{icons.mdiAlien}}</v-icon>
                            </v-btn>
                        </div>
                        <div :style="{'color' : difficultStateCount === 0 ? 'rgb(189, 189, 189)' : 'rgb(102, 102, 102)'}">
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
    import {START_REVIEW, START_SPEED_REVIEW, START_STUDY_LEARNING, START_DIFFICULT_WORDS} from "@/store/actions/studyWords";
    import {mapGetters} from 'vuex'

    export default {
        name: "StartStudyOverlay",
        props: {
            height: {
                required: true,
                type: Number
            }
        },
        data() {
            return {
                icons: {
                    mdiClose,
                    mdiBomb,
                    mdiTeach,
                    mdiViewCarousel,
                    mdiAlien
                }
            }
        },
        computed: {
            ...mapGetters(['learningStateCount', 'reviewingStateCount', 'learntWordsCount', 'difficultStateCount'])
        },
        methods: {
            goToLearning() {
                this.$store.dispatch(START_STUDY_LEARNING);
                this.$router.push('/learn_words')
            },
            goToReviewing() {
                this.$store.dispatch(START_REVIEW);
                this.$router.push('/review')
            },
            goToSpeedReview() {
                this.$store.dispatch(START_SPEED_REVIEW);
                this.$router.push('/speed_review')
            },
            goToDifficultWords(){
                this.$store.dispatch(START_DIFFICULT_WORDS);
                this.$router.push('/difficult_words')
            }
        }
    }
</script>

<style scoped>

</style>