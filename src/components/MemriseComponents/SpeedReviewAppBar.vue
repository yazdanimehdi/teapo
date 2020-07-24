<template>
    <v-app-bar flat height="70" dark color="rgb(228, 81, 61)" absolute style="font-family: kalam">
        <v-container fluid>
            <v-row style="width: 100%" align="center" justify="center">
                <v-col cols="1" sm="1" md="1" lg="1" xl="1"
                       style="border-right: rgba(0, 0, 0, 0.1)  solid thin; padding-bottom: 10px;">
                    <div style="text-align: center">
                        <div style="height: 48px">
                            <v-icon large style="margin-top: 6px" color="rgb(57,77,53)">{{icons.mdiBomb}}</v-icon>
                        </div>

                    </div>
                </v-col>
                <v-col cols="6" sm="6" md="6" lg="6" xl="6"
                       style="border-right: rgba(0, 0, 0, 0.1)  solid thin; text-align: center;">
                    <v-container fluid style="padding: 0">
                        <v-row justify="space-between" style="padding: 0 12px 0 12px">
                            <v-col cols="8" sm="8" md="8" lg="8" xl="8" style="padding: 0">
                                <div style="text-align: left; font-size: 20px; font-weight: bold">Correct:
                                    {{number}}
                                </div>
                            </v-col>
                            <v-col cols="2" sm="2" md="2" lg="2" xl="2" style="padding: 0">
                                <template v-if="hearts === 3">
                                    <v-icon>{{icons.mdiHeart}}</v-icon>
                                    <v-icon>{{icons.mdiHeart}}</v-icon>
                                    <v-icon>{{icons.mdiHeart}}</v-icon>
                                </template>
                                <template v-if="hearts === 2">
                                    <v-icon>{{icons.mdiHeart}}</v-icon>
                                    <v-icon>{{icons.mdiHeart}}</v-icon>
                                    <v-icon color="black">{{icons.mdiHeartBroken}}</v-icon>
                                </template>
                                <template v-if="hearts === 1">
                                    <v-icon>{{icons.mdiHeart}}</v-icon>
                                    <v-icon color="black">{{icons.mdiHeartBroken}}</v-icon>
                                    <v-icon color="black">{{icons.mdiHeartBroken}}</v-icon>
                                </template>

                                <template v-if="hearts === 0">
                                    <v-icon color="black">{{icons.mdiHeartBroken}}</v-icon>
                                    <v-icon color="black">{{icons.mdiHeartBroken}}</v-icon>
                                    <v-icon color="black">{{icons.mdiHeartBroken}}</v-icon>
                                </template>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-col>

                <v-col cols="1" sm="1" md="1" lg="1" xl="1">
                    <v-btn icon @click="$router.push('/')">
                        <v-icon large color="rgb(57,77,53)">{{icons.mdiClose}}</v-icon>
                    </v-btn>
                </v-col>
            </v-row>

        </v-container>
    </v-app-bar>
</template>

<script>
    import {mdiBomb, mdiPause, mdiClose, mdiHeart, mdiHeartBroken} from '@mdi/js'

    export default {
        name: "SpeedReviewAppBar",
        props: {
            number: {
                required: true,
                type: Number,
            },
            hearts: {
                required: true,
                type: Number,
            }
        },
        data() {
            return {
                icons: {
                    mdiBomb,
                    mdiPause,
                    mdiClose,
                    mdiHeart,
                    mdiHeartBroken
                }
            }
        }
    }
</script>

<style scoped>

</style>