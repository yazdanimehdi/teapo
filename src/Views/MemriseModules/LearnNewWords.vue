<template>
    <v-app>
        <learn-new-words-app-bar/>
        <v-container fluid style="margin-top: 100px; width: 700px; font-family: kalam">
            <v-row justify="center" align="center" v-if="learningSession.length !== 0">
                <v-col>
                    <v-card flat light height="500px">
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col sm="8" md="8" lg="8" xl="8" style="border-bottom: gray thin solid">
                                        <div style="font-weight: bold; font-size: 70px; margin-top: 30px">
                                            {{learningSession[index]['word']}}
                                        </div>
                                    </v-col>

                                    <v-col sm="2" md="2" lg="2" xl="2" style="border-bottom: gray thin solid">
                                        <v-container fluid>
                                            <v-row>
                                                <v-col style="padding: 0">
                                                    <v-progress-linear value="50"
                                                                       height="15"
                                                                       striped
                                                                       rounded
                                                                       color="#5A4389"
                                                    ></v-progress-linear>
                                                </v-col>
                                            </v-row>
                                            <v-row>
                                                <v-col>
                                                    <v-btn icon>
                                                        <v-icon :size="30" color="rgb(246, 193, 67)">
                                                            {{icons.mdiAlien}}
                                                        </v-icon>
                                                    </v-btn>
                                                </v-col>
                                            </v-row>
                                        </v-container>
                                    </v-col>
                                    <v-col sm="2" md="2" lg="2" xl="2" style="padding-bottom: 0">
                                        <v-hover
                                                v-slot:default="{ hover }"
                                        >
                                            <v-btn
                                                    :color="hover? 'rgb(246, 193, 67)' : 'rgb(197, 193, 193)'"
                                                    height="120" width="90" :elevation="hover? 8: 2">
                                                <v-container>
                                                    <v-row>
                                                        <v-col>
                                                            <v-icon x-large>
                                                                {{icons.mdiChevronRight}}
                                                            </v-icon>
                                                        </v-col>

                                                    </v-row>
                                                    <v-row>
                                                        <v-col style="font-weight: bold">
                                                            Next
                                                        </v-col>

                                                    </v-row>
                                                </v-container>

                                            </v-btn>
                                        </v-hover>
                                    </v-col>
                                </v-row>

                                <v-row>
                                    <v-col>
                                        <div style="font-size: 36px; line-height: 40px">{{learningSession[index]['definition']}}</div>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col>
                                        <div style="font-size: 28px; margin-bottom: 10px; line-height: 30px" v-for="(example, index) in exampleList[index]" :key="index"><span style="color: red">{{index + 1}}</span> {{example['example']}}</div>
                                    </v-col>
                                </v-row>
                            </v-container>

                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
            <v-row v-else justify="center" align="center" style="text-align: center">
                <v-col>
                    <v-progress-circular color="#1C0153" size="100" indeterminate width="10"/>
                </v-col>
            </v-row>

        </v-container>
    </v-app>
</template>

<script>
    import LearnNewWordsAppBar from "@/components/LearnNewWordsAppBar";
    import {mapState} from 'vuex'
    import {mdiAlien , mdiChevronRight} from '@mdi/js'

    export default {
        name: "LearnNewWords",
        components: {LearnNewWordsAppBar},
        data() {
            return {
                index: 0,
                icons: {
                    mdiAlien,
                    mdiChevronRight
                }
            }
        },
        computed: {
            ...mapState({
                learningList: state => state.studyWords.learningList,
                exampleList: state => state.studyWords.learningExampleList,
            }),
            learningSession() {
                return this.learningList.slice(0, 5)
            }
        },
    }
</script>

<style scoped>
    .hover-before {
        background-color: rgb(197, 193, 193);
    }

    .hover-after {
        background-color: black;
    }

</style>