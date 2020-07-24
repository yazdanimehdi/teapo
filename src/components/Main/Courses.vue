<template>
    <div :style="{'width': `${width}px`, 'font-family':'kalam'}">
        <v-container fluid>
            <v-row>
                <v-col cols="12" sm="6" md="4" lg="4" xl="4" v-for="(course, index) in courses" :key="course.id">
                    <v-card
                            class="mx-auto"
                    >
                        <v-img
                                :src="course.image"
                                height="200px"
                        ></v-img>

                        <v-card-title>
                            {{course.title}}
                        </v-card-title>

                        <v-card-subtitle>
                            {{course.subtitle}}
                        </v-card-subtitle>

                        <v-card-actions>
                            <v-btn text>Details</v-btn>

                            <v-btn
                                    color="purple"
                                    text
                            >
                                Enroll
                            </v-btn>

                            <v-spacer></v-spacer>

                            <v-btn
                                    icon
                                    @click="() => {
                                        let val = !show[index]
                                        show.splice(index, 1, val)
                                    }"
                            >
                                <v-icon>{{ show[index] ? icons.mdiChevronUp : icons.mdiChevronDown }}</v-icon>
                            </v-btn>
                        </v-card-actions>

                        <v-expand-transition>
                            <div v-show="show[index]">
                                <v-divider></v-divider>

                                <v-card-text>
                                    {{course.detailsText}}
                                </v-card-text>
                            </div>
                        </v-expand-transition>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
    import {mdiChevronUp, mdiChevronDown} from '@mdi/js'

    export default {
        name: "Courses",
        props: {
            width: {
                required: true,
                type: Number
            },
        },
        data() {
            return {
                icons: {
                    mdiChevronDown,
                    mdiChevronUp
                },
                show: [false, false],
                courses: [{
                    'image': 'https://cdn.vuetifyjs.com/images/cards/sunshine.jpg',
                    'title': 'Top western road trips',
                    'subtitle': '1,000 miles of wonder',
                    'detailsText': ' I\'m a thing. But, like most politicians, he promised more than he could deliver. You won\'t have time for sleeping, soldier, not with all the bed making you\'ll be doing. Then we\'ll go with that data file! Hey, you add a one and two zeros to that or we walk! You\'re going to do his laundry? I\'ve got to find a way to escape.',
                },
                    {
                        'image': 'https://cdn.vuetifyjs.com/images/cards/sunshine.jpg',
                        'title': 'Top western road trips',
                        'subtitle': '1,000 miles of wonder',
                        'detailsText': ' I\'m a thing. But, like most politicians, he promised more than he could deliver. You won\'t have time for sleeping, soldier, not with all the bed making you\'ll be doing. Then we\'ll go with that data file! Hey, you add a one and two zeros to that or we walk! You\'re going to do his laundry? I\'ve got to find a way to escape.',
                    }]
            }
        }
    }
</script>

<style scoped>

</style>