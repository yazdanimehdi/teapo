<template>
    <v-app @click.native="appClick($event)">

        <div class="teapo_title" :style="{'height': `${height*0.08}px`,
         'width': `${mini? width*0.08 : width*0.230}px`,
          'max-width': '280px'}">

            <div style="margin: 0" v-if="!mini">
                <div class="teapo_title_text">TEAPO</div>
                <div class="teapo_title_desc">Toefl Exam And Practice Online</div>
            </div>
            <div v-else>
                <div class="teapo_title_text_mini">TEAPO</div>
            </div>
        </div>
        <v-app-bar
                absolute
                color="#1C0153"
                dark
                :height="height*0.08"
                flat
                src="../assets/icon_group.png"
                style="padding: 0; margin: 0;"
        >
            <v-spacer></v-spacer>
            <div style="font-size: 18px; font-family: kalam">Mehdi Yazdani</div>
            <v-menu

            >
                <template v-slot:activator="{ on }">
                    <v-btn icon text v-on="on">
                        <v-icon>{{icons.mdiChevronDown}}</v-icon>
                    </v-btn>

                </template>

                <v-list>
                    <v-list-item link>
                        <v-list-item-icon :style="{'margin-right': '10px'}">
                            <v-icon small>
                                {{ icons.mdiAccountEdit }}
                            </v-icon>
                        </v-list-item-icon>
                        <v-list-item-title class="menu_class">Edit Account</v-list-item-title>
                    </v-list-item>

                    <v-list-item link>
                        <v-list-item-icon :style="{'margin-right': '10px'}">
                            <v-icon small>
                                {{ icons.mdiLogout }}
                            </v-icon>
                        </v-list-item-icon>
                        <v-list-item-title class="menu_class">Logout</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>

        </v-app-bar>
        <v-navigation-drawer
                id="navdrawer_element"
                color="#E6E6E6"
                :expand-on-hover="false"
                :mini-variant.sync="mini"
                :permanent="true"
                absolute
                :width="width*0.230"
                :style="{'padding-top': `${height*0.1}px`, 'max-width': '280px'}"
                :mini-variant-width="width*0.08"
        >
            <div></div>
            <v-list
                    nav
            >
                <v-list-item link @click="dashboardSelected">
                    <v-list-item-icon :style="{'margin-right': '10px'}">
                        <v-icon :color="linkSelected.dashboard ? '#A40000' : '#1C0153'" large>
                            {{ icons.mdiViewDashboard }}
                        </v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                        <v-list-item-title class="drawer_links"
                                           :style="{'color': `${linkSelected.dashboard ? '#A40000' : '#1C0153'}`}"
                        >Dashboard
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item link @click="TPOSelected">
                    <v-list-item-icon :style="{'margin-right': '10px'}">
                        <v-icon :color="linkSelected.TPO ? '#A40000' : '#1C0153'" large>
                            {{ icons.mdiBookOpenPageVariant }}
                        </v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                        <v-list-item-title class="drawer_links"
                                           :style="{'color': `${linkSelected.TPO ? '#A40000' : '#1C0153'}`}"
                        >TPO
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item link @click="analyticsSelected">
                    <v-list-item-icon :style="{'margin-right': '10px'}">
                        <v-icon :color="linkSelected.analytics ? '#A40000' : '#1C0153'" large>
                            {{ icons.mdiChartTimelineVariant }}
                        </v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                        <v-list-item-title class="drawer_links"
                                           :style="{'color': `${linkSelected.analytics ? '#A40000' : '#1C0153'}`}"
                        >Analytics
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item link @click="wordsSelected">
                    <v-list-item-icon :style="{'margin-right': '10px'}">
                        <v-icon :color="linkSelected.words ? '#A40000' : '#1C0153'" large>
                            {{ icons.mdiBookAlphabet }}
                        </v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                        <v-list-item-title class="drawer_links"
                                           :style="{'color': `${linkSelected.words ? '#A40000' : '#1C0153'}`}"
                        >Words
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item link @click="mockSelected">
                    <v-list-item-icon :style="{'margin-right': '10px'}">
                        <v-icon :color="linkSelected.mockTest ? '#A40000' : '#1C0153'" large>
                            {{ icons.mdiLeadPencil }}
                        </v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                        <v-list-item-title class="drawer_links"
                                           :style="{'color': `${linkSelected.mockTest ? '#A40000' : '#1C0153'}`}"
                        >Mock Test
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item link @click="ordersSelected">
                    <v-list-item-icon :style="{'margin-right': '10px'}">
                        <v-icon :color="linkSelected.orders ? '#A40000' : '#1C0153'" large>
                            {{ icons.mdiCart }}
                        </v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                        <v-list-item-title class="drawer_links"
                                           :style="{'color': `${linkSelected.orders ? '#A40000' : '#1C0153'}`}"
                        >Orders
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
        <DashboardComponent :width="mini? width*0.91 : width*0.76" v-if="linkSelected.dashboard" :style="{'margin-left': mini? `${width*0.08 + 10}px`:`${width*0.23 + 10}px`, 'margin-right': '50px'}"/>
    </v-app>
</template>

<script>
    import {
        mdiViewDashboard,
        mdiBookOpenPageVariant,
        mdiChartTimelineVariant,
        mdiBookAlphabet,
        mdiLeadPencil,
        mdiCart,
        mdiChevronDown,
        mdiLogout,
        mdiAccountEdit

    } from '@mdi/js'

    import DashboardComponent from "@/components/DashboardComponent";

    export default {
        name: "Dashboard",
        components:{
            DashboardComponent
        },
        data() {
            return {
                mini: false,
                icons: {
                    mdiViewDashboard,
                    mdiBookOpenPageVariant,
                    mdiChartTimelineVariant,
                    mdiBookAlphabet,
                    mdiLeadPencil,
                    mdiCart,
                    mdiChevronDown,
                    mdiLogout,
                    mdiAccountEdit
                },
                titleHeight: 56,
                navWidth: 180,
                width: 0,
                height: 0,
                linkSelected: {
                    dashboard: true,
                    TPO: false,
                    words: false,
                    mockTest: false,
                    orders: false,
                    analytics: false,
                }
            }
        },
        created() {
            window.addEventListener('resize', this.handleResize);
            this.handleResize();
        },
        destroyed() {
            window.removeEventListener('resize', this.handleResize);
        },
        methods: {
            dashboardSelected(){
              this.linkSelected.TPO = false;
              this.linkSelected.words = false;
              this.linkSelected.mockTest = false;
              this.linkSelected.orders = false;
                this.linkSelected.analytics = false;
                this.linkSelected.dashboard = true;
            },
            TPOSelected(){
                this.mini = true
                this.linkSelected.dashboard = false;
                this.linkSelected.words = false;
                this.linkSelected.mockTest = false;
                this.linkSelected.orders = false;
                this.linkSelected.analytics = false;
                this.linkSelected.TPO = true;
            },
            wordsSelected(){
                this.linkSelected.dashboard = false;
                this.linkSelected.TPO = false;
                this.linkSelected.mockTest = false;
                this.linkSelected.orders = false;
                this.linkSelected.analytics = false;
                this.linkSelected.words = true;
            },
            mockSelected(){
                this.linkSelected.dashboard = false;
                this.linkSelected.TPO = false;
                this.linkSelected.words = false;
                this.linkSelected.orders = false;
                this.linkSelected.analytics = false;
                this.linkSelected.mockTest = true;
            },
            ordersSelected(){
                this.linkSelected.dashboard = false;
                this.linkSelected.TPO = false;
                this.linkSelected.words = false;
                this.linkSelected.mockTest = false;
                this.linkSelected.analytics = false;
                this.linkSelected.orders = true;
            },
            analyticsSelected(){
                this.linkSelected.dashboard = false;
                this.linkSelected.TPO = false;
                this.linkSelected.words = false;
                this.linkSelected.mockTest = false;
                this.linkSelected.orders = false;
                this.linkSelected.analytics = true
            },
            handleResize() {
                this.width = window.innerWidth;
                this.height = window.innerHeight;
            },
            appClick(event){
                let myElementToCheckIfClicksAreInsideOf = document.querySelector('#navdrawer_element');
                if (!myElementToCheckIfClicksAreInsideOf.contains(event.target)) {
                    this.mini = true;
                }
            }
        }
    }
</script>

<style scoped>
    .teapo_title {
        background-color: #a9a1ba;
        margin: 0;
        padding: 0;
        position: relative;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .teapo_title_text {
        color: #1C0153;
        font-weight: bold;
        text-align: center;
        font-size: 22px;
        font-family: kalam;
    }
    .teapo_title_text_mini {
        color: #1C0153;
        font-weight: bold;
        text-align: center;
        font-size: 20px;
        margin-top: 5px;
        font-family: kalam;
    }

    .teapo_title_desc {
        color: #1C0153;
        font-size: 12px;
        text-align: center;
        font-family: kalam;

    }

    .drawer_links {
        font-family: kalam;
        font-size: 22px
    }
    .menu_class{
        font-family: kalam;
        font-size: 14px;
    }
</style>