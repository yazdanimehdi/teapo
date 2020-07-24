<template>
    <v-app @click.native="appClick($event)">

        <div class="teapo_title" :style="{'height': `${height*0.08}px`,
         'width': `${mini? width*0.08 : width*0.230}px`,
          'max-width': '280px', 'position': 'fixed', 'z-index': '20'}">

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

                src="../assets/icon_group.png"
                style="padding: 0; margin: 0;position: fixed; z-index: 10"
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
                :style="{'padding-top': `${height*0.1}px`, 'max-width': '280px', 'position': 'fixed'}"
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

                <v-list-item link @click="CorrectSelected">
                    <v-list-item-icon :style="{'margin-right': '10px'}">
                        <v-icon :color="linkSelected.correct ? '#A40000' : '#1C0153'" large>
                            {{ icons.mdiCheckCircle }}
                        </v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                        <v-list-item-title class="drawer_links"
                                           :style="{'color': `${linkSelected.correct ? '#A40000' : '#1C0153'}`}"
                        >Grading
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

                <v-list-item link @click="classSelected">
                    <v-list-item-icon :style="{'margin-right': '10px'}">
                        <v-icon :color="linkSelected.classes ? '#A40000' : '#1C0153'" large>
                            {{ icons.mdiSchool }}
                        </v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                        <v-list-item-title class="drawer_links"
                                           :style="{'color': `${linkSelected.classes ? '#A40000' : '#1C0153'}`}"
                        >My Classes
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item link @click="onlineCoursesSelected">
                    <v-list-item-icon :style="{'margin-right': '10px'}">
                        <v-icon :color="linkSelected.onlineCourses ? '#A40000' : '#1C0153'" large>
                            {{ icons.mdiTelevision }}
                        </v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                        <v-list-item-title class="drawer_links"
                                           :style="{'color': `${linkSelected.onlineCourses ? '#A40000' : '#1C0153'}`}"
                        >Courses
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

<!--                <v-list-item link @click="ordersSelected">-->
<!--                    <v-list-item-icon :style="{'margin-right': '10px'}">-->
<!--                        <v-icon :color="linkSelected.orders ? '#A40000' : '#1C0153'" large>-->
<!--                            {{ icons.mdiCart }}-->
<!--                        </v-icon>-->
<!--                    </v-list-item-icon>-->

<!--                    <v-list-item-content>-->
<!--                        <v-list-item-title class="drawer_links"-->
<!--                                           :style="{'color': `${linkSelected.orders ? '#A40000' : '#1C0153'}`}"-->
<!--                        >Orders-->
<!--                        </v-list-item-title>-->
<!--                    </v-list-item-content>-->
<!--                </v-list-item>-->
            </v-list>
        </v-navigation-drawer>
        <DashboardComponent :width="mini? width*0.91 : width*0.76" v-if="linkSelected.dashboard"
                            :style="{'margin-left': mini? `${width*0.08 + 10}px`:`${width*0.23 + 10}px`, 'margin-right': '50px', 'margin-top': `${height*0.08}px`}"
                            :height="height"/>
        <WordsComponent :width="mini? width*0.91 : width*0.76" v-if="linkSelected.words"
                        :style="{'margin-left': mini? `${width*0.08 + 10}px`:`${width*0.23 + 10}px`, 'margin-right': '50px', 'margin-top': `${height*0.08}px`}"
                        :height="height"/>
        <MockTestComponent :width="mini? width*0.91 : width*0.76" v-if="linkSelected.mockTest"
                           :style="{'margin-left': mini? `${width*0.08 + 10}px`:`${width*0.23 + 10}px`, 'margin-right': '50px', 'margin-top': `${height*0.08}px`}"/>
        <TPOComponent :width="mini? width*0.91 : width*0.76" v-if="linkSelected.TPO"
                      :style="{'margin-left': mini? `${width*0.08 + 10}px`:`${width*0.23 + 10}px`, 'margin-right': '50px', 'margin-top': `${height*0.08}px`}"/>
        <Analytics :width="mini? width*0.91 : width*0.76" v-if="linkSelected.analytics"
                   :style="{'margin-left': mini? `${width*0.08 + 10}px`:`${width*0.23 + 10}px`, 'margin-right': '50px', 'margin-top': `${height*0.08}px`}"/>
        <Courses :width="mini? width*0.91 : width*0.76" v-if="linkSelected.onlineCourses"
                 :style="{'margin-left': mini? `${width*0.08 + 10}px`:`${width*0.23 + 10}px`, 'margin-right': '50px', 'margin-top': `${height*0.08}px`}"/>
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
        mdiAccountEdit,
        mdiCheckCircle,
        mdiTelevision,
        mdiSchool

    } from '@mdi/js'
    import {mapState} from 'vuex'
    import {CHANGE_TAB} from "@/store/actions/dashboard";
    import DashboardComponent from "@/components/Main/DashboardComponent";
    import WordsComponent from "@/components/Main/WordsComponent";
    import MockTestComponent from "@/components/Subcomponents/MockTestComponent";
    import TPOComponent from "@/components/Main/TPOComponent";
    import Analytics from "@/components/Main/Analytics";
    import Courses from "@/components/Main/Courses";

    export default {
        name: "Dashboard",
        components: {
            Courses,
            Analytics,
            TPOComponent,
            MockTestComponent,
            WordsComponent,
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
                    mdiAccountEdit,
                    mdiCheckCircle,
                    mdiTelevision,
                    mdiSchool
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
                    correct: false,
                    classes: false,
                    onlineCourses: false,
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
        computed: {
            ...mapState({
                tabNumber: state => state.dashboard.tabNumber
            })
        },
        mounted(){
          switch (this.tabNumber) {
            case 0: this.dashboardSelected(); break;
            case 1: this.TPOSelected(); break;
            case 2: this.CorrectSelected(); break;
            case 3: this.analyticsSelected(); break;
            case 4: this.wordsSelected(); break;
            case 5: this.mockSelected(); break;
            case 6: this.classSelected(); break;
            case 7: this.onlineCoursesSelected(); break;
          }
        },
        methods: {
            dashboardSelected() {
                this.$store.dispatch(CHANGE_TAB, 0);
                this.linkSelected.TPO = false;
                this.linkSelected.words = false;
                this.linkSelected.mockTest = false;
                this.linkSelected.orders = false;
                this.linkSelected.analytics = false;
                this.linkSelected.correct = false;
                this.linkSelected.onlineCourses = false;
                this.linkSelected.classes = false;
                this.linkSelected.dashboard = true;
            },
            TPOSelected() {
                this.$store.dispatch(CHANGE_TAB, 1);
                this.linkSelected.dashboard = false;
                this.linkSelected.words = false;
                this.linkSelected.mockTest = false;
                this.linkSelected.orders = false;
                this.linkSelected.analytics = false;
                this.linkSelected.correct = false;
                this.linkSelected.onlineCourses = false;
                this.linkSelected.classes = false;
                this.linkSelected.TPO = true;
            },
            wordsSelected() {
                this.$store.dispatch(CHANGE_TAB, 4);
                this.linkSelected.dashboard = false;
                this.linkSelected.TPO = false;
                this.linkSelected.mockTest = false;
                this.linkSelected.orders = false;
                this.linkSelected.analytics = false;
                this.linkSelected.correct = false;
                this.linkSelected.onlineCourses = false;
                this.linkSelected.classes = false;
                this.linkSelected.words = true;
            },
            mockSelected() {
                this.$store.dispatch(CHANGE_TAB, 5);
                this.linkSelected.dashboard = false;
                this.linkSelected.TPO = false;
                this.linkSelected.words = false;
                this.linkSelected.orders = false;
                this.linkSelected.analytics = false;
                this.linkSelected.correct = false;
                this.linkSelected.onlineCourses = false;
                this.linkSelected.classes = false;
                this.linkSelected.mockTest = true;
            },
            classSelected() {
                this.$store.dispatch(CHANGE_TAB, 6);
                this.linkSelected.dashboard = false;
                this.linkSelected.TPO = false;
                this.linkSelected.words = false;
                this.linkSelected.mockTest = false;
                this.linkSelected.analytics = false;
                this.linkSelected.correct = false;
                this.linkSelected.onlineCourses = false;
                this.linkSelected.classes = true;
            },
            analyticsSelected() {
                this.$store.dispatch(CHANGE_TAB, 3);
                this.linkSelected.dashboard = false;
                this.linkSelected.TPO = false;
                this.linkSelected.words = false;
                this.linkSelected.mockTest = false;
                this.linkSelected.orders = false;
                this.linkSelected.correct = false;
                this.linkSelected.onlineCourses = false;
                this.linkSelected.classes = false;
                this.linkSelected.analytics = true
            },
            CorrectSelected() {
                this.$store.dispatch(CHANGE_TAB, 2);
                this.linkSelected.dashboard = false;
                this.linkSelected.TPO = false;
                this.linkSelected.words = false;
                this.linkSelected.mockTest = false;
                this.linkSelected.orders = false;
                this.linkSelected.analytics = false;
                this.linkSelected.onlineCourses = false;
                this.linkSelected.classes = false;
                this.linkSelected.correct = true;
            },
            onlineCoursesSelected(){
                this.$store.dispatch(CHANGE_TAB, 7);
                this.linkSelected.dashboard = false;
                this.linkSelected.TPO = false;
                this.linkSelected.words = false;
                this.linkSelected.mockTest = false;
                this.linkSelected.orders = false;
                this.linkSelected.analytics = false;
                this.linkSelected.correct = false;
                this.linkSelected.classes = false;
                this.linkSelected.onlineCourses = true;
            },
            handleResize() {
                this.width = window.innerWidth;
                this.height = window.innerHeight;
            },
            appClick(event) {
                let myElementToCheckIfClicksAreInsideOf = document.querySelector('#navdrawer_element');
                if (myElementToCheckIfClicksAreInsideOf !== null) {
                    if (!myElementToCheckIfClicksAreInsideOf.contains(event.target)) {
                        this.mini = true;
                    }
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

    .menu_class {
        font-family: kalam;
        font-size: 14px;
    }
</style>