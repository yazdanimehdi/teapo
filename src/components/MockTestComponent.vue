<template>
    <div :style="{'width': `${width}px`, 'font-family':'kalam'}">
        <v-container fluid style="overflow-y: scroll">
            <v-row>
                <v-col>
                    <h2 style="font-size: 22px">
                        Available Mock tests
                    </h2>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-card color="#BEE0E2" height="290px" :width="`${width}px`"
                            style="border-radius: 20px; padding-left: 15px; padding-right: 15px" flat>
                        <v-container fluid>
                            <v-row align="center" justify="space-around"
                                   :style="{'border-radius': '20px','width':`${width - 50}px`, 'height': '90px', 'background-color': '#E6E6E6', 'margin-top': '15px', 'padding-left':'10px'}"
                            v-for="i in 2" :key="i">
                                <!--title-->
                                <v-col cols="10" md="2" sm="2" lg="2" xl="2">
                                    <div style="font-size: 16px; font-weight: bold">
                                        MT6
                                    </div>
                                </v-col>
                                <!--Date-->
                                <v-col cols="10" md="2" sm="2" lg="2" xl="2">
                                    <div class="my-title">
                                        Date
                                    </div>
                                    <div class="my-subtitle">
                                        1 shahrivar 99
                                    </div>

                                </v-col>
                                <!--Organizer-->
                                <v-col cols="10" md="2" sm="2" lg="2" xl="2">
                                    <div class="my-title">
                                        Organizer
                                    </div>
                                    <div class="my-subtitle">
                                        TOEFL3
                                    </div>
                                </v-col>
                                <!--Fee-->
                                <v-col cols="10" md="2" sm="2" lg="2" xl="2">
                                    <div class="my-title">
                                        Fee
                                    </div>
                                    <div class="my-subtitle">
                                        90,000 Toman
                                    </div>
                                </v-col>
                                <!--Register Button-->
                                <v-col cols="10" md="2" sm="2" lg="2" xl="2">
                                    <v-btn rounded width="100%" color="#bab5c4" class="my-title">
                                        Register
                                    </v-btn>
                                </v-col>
                            </v-row>

                            <v-row style="margin-top: 15px">
                                <v-pagination
                                        :next-icon="icons.mdiChevronRight"
                                        :prev-icon="icons.mdiChevronLeft"
                                        v-model="pageMock"
                                        :length="4"
                                        color="#BEE0E2"
                                        circle
                                ></v-pagination>
                            </v-row>
                        </v-container>
                    </v-card>
                </v-col>

            </v-row>
            <v-row>
                <v-col>
                    <h2 style="font-size: 22px">
                        Previous Mock tests results
                    </h2>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-card color="#D5E294" height="455px" :width="`${width}px`"
                            style="border-radius: 20px; padding-left: 15px; padding-right: 15px" flat>
                        <v-container fluid>
                            <v-row align="center" justify="space-around"
                                   :style="{'border-radius': '20px','width':`${width - 50}px`, 'height': '110px', 'background-color': '#E6E6E6', 'margin-top': '15px' }"
                                   v-for="i in 3" :key="i" >
                                <!--title-->
                                <v-col cols="10" md="2" sm="2" lg="2" xl="2">
                                    <div class="my-title">
                                        MT3
                                    </div>
                                </v-col>
                                <!--date & institute -->
                                <v-col cols="10" md="2" sm="2" lg="2" xl="2">
                                    <!--data-->
                                    <div class="my-subtitle">
                                        2 Mordad 99
                                    </div>
                                    <!--institute-->
                                    <div class="my-subtitle">
                                        Amirbahador Ins.
                                    </div>
                                </v-col>
                                <!--total score -->
                                <v-col cols="10" md="2" sm="2" lg="2" xl="2">
                                    <div class="my-title">
                                        Total
                                    </div>
                                    <!--score-->
                                    <div class="my-subtitle">
                                        96 / 120
                                    </div>
                                </v-col>
                                <!--reading & listening -->
                                <v-col cols="10" md="2" sm="2" lg="2" xl="2">
                                    <!--reading-->
                                    <div class="my-subtitle">
                                        Reading: 26
                                    </div>
                                    <!--listening-->
                                    <div class="my-subtitle">
                                        listening: 27
                                    </div>
                                </v-col>
                                <!--speaking & writinh -->
                                <v-col cols="10" md="2" sm="2" lg="2" xl="2">
                                    <!--speaking-->
                                    <div class="my-subtitle">
                                        Speaking: 21
                                    </div>
                                    <!--listening-->
                                    <div class="my-subtitle">
                                        writing: 22
                                    </div>
                                </v-col>
                                <v-col cols="10" md="1" sm="1" lg="1" xl="1">
                                   <v-btn icon><v-icon>{{icons.mdiArrowRight}}</v-icon></v-btn>
                                </v-col>
                            </v-row>

                            <v-row style="margin-top: 15px">
                                <v-pagination
                                        :next-icon="icons.mdiChevronRight"
                                        :prev-icon="icons.mdiChevronLeft"
                                        v-model="pageResult"
                                        :length="4"
                                        color="#D5E294"
                                        circle
                                ></v-pagination>
                            </v-row>
                        </v-container>

                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
    import {
        mdiChevronRight,
        mdiChevronLeft,
        mdiArrowRight
    } from '@mdi/js'

    export default {
        name: "MockTestComponent",
        props: {
            width: {
                required: true,
                type: Number
            }
        },
        data() {
            return {
                pageMock: 1,
                pageResult: 1,
                icons: {
                    mdiChevronLeft,
                    mdiChevronRight,
                    mdiArrowRight
                }
            }
        }
    }
</script>

<style scoped>
    .my-title {
        font-size: 16px;
        font-weight: bold;
        text-align: center;
        font-family: kalam;
    }

    .my-subtitle {
        font-size: 16px;
        text-align: center;
        font-family: kalam;
    }
</style>