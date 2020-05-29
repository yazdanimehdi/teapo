<template>
    <div :style="{'width': `${width}px`, 'font-family':'kalam'}">
        <v-container fluid style="overflow-y: scroll">
            <v-row>
                <v-col cols="12" sm="5" md="5" lg="5" xl="5">
                    <v-card @click="$router.push('/study_words')"
                            style="background-image: linear-gradient(#A0B271, #B6F51F); height: 300px; border-radius: 15px">
                        <v-img src="../assets/study.png" class="black--text" contain
                               height="300px">
                            <v-card-subtitle>
                                <div>
                                    <v-icon>{{icons.mdiBookAlphabet}}</v-icon>
                                    <span style="margin-left: 8px; font-size: 18px; font-weight: bold">Study Now</span>
                                </div>
                            </v-card-subtitle>
                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col cols="6" sm="6" md="6" lg="6" xl="6">
                                            <div style="font-weight: bolder; font-size: 50px; text-align: center">26
                                            </div>
                                        </v-col>
                                        <v-col cols="6" sm="6" md="6" lg="6" xl="6">
                                            <div style="font-weight: bold; font-size: 20px; text-align: center">Words
                                            </div>
                                            <div style="font-size: 20px; text-align: center">for review</div>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>

                            </v-card-actions>
                        </v-img>

                    </v-card>
                </v-col>

                <v-col cols="12" sm="7" md="7" lg="7" xl="7">
                    <v-card style="background-image: linear-gradient(#79EC37, #7BCF4B); height: 300px">
                        <v-card-subtitle>
                            <div>
                                <v-icon>{{icons.mdiPlusCircle}}</v-icon>
                                <span style="margin-left: 8px; font-size: 18px; font-weight: bold">Add New Word</span>
                            </div>

                        </v-card-subtitle>
                        <v-card-text>
                            <v-container fluid>
                                <v-row>
                                    <v-text-field
                                            v-model="word"
                                            label="Word"
                                            required
                                    ></v-text-field>
                                </v-row>
                                <v-row>
                                    <v-text-field
                                            v-model="definition"
                                            label="Definition"
                                            required
                                    ></v-text-field>
                                </v-row>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn icon>
                                <v-icon x-large>
                                    {{icons.mdiPlusCircle}}
                                </v-icon>
                            </v-btn>
                        </v-card-actions>

                    </v-card>
                </v-col>
            </v-row>
            <v-container fluid>
                <v-data-iterator
                        :items="items"
                        :items-per-page.sync="itemsPerPage"
                        :page="page"
                        :search="search"
                        :sort-by="sortBy.toLowerCase()"
                        :sort-desc="sortDesc"
                        hide-default-footer
                >
                    <template v-slot:header>
                        <v-toolbar
                                dark
                                color="#BFABE8"
                                class="mb-1"
                        >
                            <v-text-field
                                    v-model="search"
                                    clearable
                                    flat
                                    solo-inverted
                                    hide-details
                                    prepend-inner-icon="search"
                                    label="Search"
                            ></v-text-field>
                            <template v-if="$vuetify.breakpoint.mdAndUp">
                                <v-spacer></v-spacer>
                                <v-select
                                        v-model="sortBy"
                                        flat
                                        solo-inverted
                                        hide-details
                                        :items="keys"
                                        prepend-inner-icon="search"
                                        label="Sort by"
                                ></v-select>
                                <v-spacer></v-spacer>
                                <v-btn-toggle
                                        v-model="sortDesc"
                                        mandatory
                                >
                                    <v-btn
                                            large
                                            depressed
                                            color="#54398B"
                                            :value="false"
                                    >
                                        <v-icon>{{icons.mdiChevronUp}}</v-icon>
                                    </v-btn>
                                    <v-btn
                                            large
                                            depressed
                                            color="#54398B"
                                            :value="true"
                                    >
                                        <v-icon>{{icons.mdiChevronDown}}</v-icon>
                                    </v-btn>
                                </v-btn-toggle>
                            </template>
                        </v-toolbar>
                    </template>

                    <template v-slot:default="props">
                        <v-row style="background-color: #BFABE8; padding: 0; margin: 0">
                            <v-col
                                    v-for="item in props.items"
                                    :key="item.name"
                                    cols="12"
                                    sm="6"
                                    md="4"
                                    lg="3"
                            >
                                <v-card>
                                    <v-card-title class="subheading font-weight-bold">{{ item.name }}</v-card-title>

                                    <v-divider></v-divider>

                                    <v-list dense>
                                        <v-list-item
                                                v-for="(key, index) in filteredKeys"
                                                :key="index"
                                        >
                                            <v-list-item-content :class="{ 'blue--text': sortBy === key }">{{ key }}:
                                            </v-list-item-content>
                                            <v-list-item-content class="align-end"
                                                                 :class="{ 'blue--text': sortBy === key }">{{
                                                item[key.toLowerCase()] }}
                                            </v-list-item-content>
                                        </v-list-item>
                                    </v-list>
                                </v-card>
                            </v-col>
                        </v-row>
                    </template>

                    <template v-slot:footer>
                        <v-row class="mt-2" align="center" justify="center">

                            <v-spacer></v-spacer>

                            <span
                                    class="mr-4
            grey--text"
                            >
            Page {{ page }} of {{ numberOfPages }}
          </span>
                            <v-btn
                                    fab
                                    dark
                                    color="#BFABE8"
                                    class="mr-1"
                                    @click="formerPage"
                            >
                                <v-icon>{{icons.mdiChevronLeft}}</v-icon>
                            </v-btn>
                            <v-btn
                                    fab
                                    dark
                                    color="#BFABE8"
                                    class="ml-1"
                                    @click="nextPage"
                            >
                                <v-icon>{{icons.mdiChevronRight}}</v-icon>
                            </v-btn>
                        </v-row>
                    </template>
                </v-data-iterator>
            </v-container>
            <v-row>

            </v-row>

        </v-container>
    </div>
</template>

<script>
    import {
        mdiBookAlphabet,
        mdiPlusCircle,
        mdiChevronRight,
        mdiChevronLeft,
        mdiChevronUp,
        mdiChevronDown
    } from '@mdi/js'

    export default {
        name: "WordsComponent",
        props: {
            width: {
                required: true,
                type: Number
            }
        },
        data() {
            return {
                icons: {
                    mdiBookAlphabet,
                    mdiPlusCircle,
                    mdiChevronRight,
                    mdiChevronLeft,
                    mdiChevronUp,
                    mdiChevronDown
                },
                word: '',
                definition: '',
                itemsPerPageArray: [4, 8, 12],
                search: '',
                filter: {},
                sortDesc: false,
                page: 1,
                itemsPerPage: 8,
                sortBy: 'name',
                keys: [
                    'Name',
                    'Calories',
                    'Fat',
                    'Carbs',
                    'Protein',
                    'Sodium',
                    'Calcium',
                    'Iron',
                ],
                items: [
                    {
                        name: 'Frozen Yogurt',
                        calories: 159,
                        fat: 6.0,
                        carbs: 24,
                        protein: 4.0,
                        sodium: 87,
                        calcium: '14%',
                        iron: '1%',
                    },
                    {
                        name: 'Ice cream sandwich',
                        calories: 237,
                        fat: 9.0,
                        carbs: 37,
                        protein: 4.3,
                        sodium: 129,
                        calcium: '8%',
                        iron: '1%',
                    },
                    {
                        name: 'Eclair',
                        calories: 262,
                        fat: 16.0,
                        carbs: 23,
                        protein: 6.0,
                        sodium: 337,
                        calcium: '6%',
                        iron: '7%',
                    },
                    {
                        name: 'Cupcake',
                        calories: 305,
                        fat: 3.7,
                        carbs: 67,
                        protein: 4.3,
                        sodium: 413,
                        calcium: '3%',
                        iron: '8%',
                    },
                    {
                        name: 'Gingerbread',
                        calories: 356,
                        fat: 16.0,
                        carbs: 49,
                        protein: 3.9,
                        sodium: 327,
                        calcium: '7%',
                        iron: '16%',
                    },
                    {
                        name: 'Jelly bean',
                        calories: 375,
                        fat: 0.0,
                        carbs: 94,
                        protein: 0.0,
                        sodium: 50,
                        calcium: '0%',
                        iron: '0%',
                    },
                    {
                        name: 'Lollipop',
                        calories: 392,
                        fat: 0.2,
                        carbs: 98,
                        protein: 0,
                        sodium: 38,
                        calcium: '0%',
                        iron: '2%',
                    },
                    {
                        name: 'Honeycomb',
                        calories: 408,
                        fat: 3.2,
                        carbs: 87,
                        protein: 6.5,
                        sodium: 562,
                        calcium: '0%',
                        iron: '45%',
                    },
                    {
                        name: 'Donut',
                        calories: 452,
                        fat: 25.0,
                        carbs: 51,
                        protein: 4.9,
                        sodium: 326,
                        calcium: '2%',
                        iron: '22%',
                    },
                    {
                        name: 'KitKat',
                        calories: 518,
                        fat: 26.0,
                        carbs: 65,
                        protein: 7,
                        sodium: 54,
                        calcium: '12%',
                        iron: '6%',
                    },
                ],
            }
        },
        computed: {
            numberOfPages() {
                return Math.ceil(this.items.length / this.itemsPerPage)
            },
            filteredKeys() {
                return this.keys.filter(key => key !== `Name`)
            },
        },
        methods: {
            nextPage() {
                if (this.page + 1 <= this.numberOfPages) this.page += 1
            },
            formerPage() {
                if (this.page - 1 >= 1) this.page -= 1
            },
            updateItemsPerPage(number) {
                this.itemsPerPage = number
            },
        },
    }
</script>

<style scoped>

</style>