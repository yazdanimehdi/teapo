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
                        <v-col v-for="i in 53" cols="12" sm="6" md="6" lg="4" :key="i">
                            <TPOCard :tpo-id="i" :mode="practice ? 'practiceMode' : 'testMode'"/>
                        </v-col>
                    </v-row>
                </v-container>
            </v-row>

        </v-container>
    </div>
</template>

<script>
    import TPOCard from "@/components/Subcomponents/TPOCard";

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
        data() {
            return {
                practice: true
            }
        }
    }
</script>

<style scoped>

</style>