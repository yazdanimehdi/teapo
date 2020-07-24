<template>
    <v-app-bar flat height="70" dark color="rgb(246, 195, 67)" absolute style="font-family: kalam">
        <v-container fluid>
            <v-row style="width: 100%" align="center" justify="center">
                <v-col cols="1" sm="1" md="1" lg="1" xl="1"
                       style="border-right: rgba(0, 0, 0, 0.1)  solid thin; padding-bottom: 10px;">
                    <div style="text-align: center">
                        <div style="height: 48px">
                            <v-icon large style="margin-top: 6px" color="rgb(57,77,53)">{{icons.mdiAlien}}</v-icon>
                        </div>

                    </div>
                </v-col>
                <v-col cols="1" sm="1" md="1" lg="1" xl="1"
                       style="border-right: rgba(0, 0, 0, 0.1) solid thin; text-align: center; padding-bottom: 10px;">
                    <v-btn icon @click="pause ? $emit('play') : $emit('pause')">
                        <v-icon large color="rgb(57,77,53)">{{pause ? icons.mdiPlay : icons.mdiPause}}</v-icon>
                    </v-btn>
                </v-col>
                <v-col cols="6" sm="6" md="6" lg="6" xl="6"
                       style="border-right: rgba(0, 0, 0, 0.1)  solid thin; text-align: center; padding-bottom: 4px;">
                    <v-container fluid style="padding: 0">
                        <v-row justify="space-between" style="padding: 12px">
                            <v-col cols="10" sm="10" md="10" lg="10" xl="10" style="padding: 0">
                                <div style="text-align: left; font-size: 20px; font-weight: bold">Difficult Words:
                                    {{number}}
                                </div>
                            </v-col>
                        </v-row>
                        <v-row justify="end" align="end">
                            <v-col style="padding: 0; padding-bottom: 3px">
                                <v-progress-linear :value="percent" height="10px" dark color="green"  style="background-color: rgba(0, 0, 0, 0.4)"></v-progress-linear>
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
    import {mdiAlien, mdiPause, mdiClose, mdiPlay} from '@mdi/js'

    export default {
        name: "DifficultWordsAppBar",
        props: {
            percent: {
                required: true,
                type: Number,
            },
            number: {
                required: true,
                type: Number,
            },
            pause:{
                required: false,
                type: Boolean,
                default: false,
            }
        },
        data() {
            return {
                icons: {
                    mdiPlay,
                    mdiAlien,
                    mdiPause,
                    mdiClose
                }
            }
        }
    }
</script>

<style scoped>

</style>