<template>
    <span>
    <component
            :is="currentComponent"
    />
        </span>
</template>

<script>
    import { mapState } from 'vuex'
    import ReadingSummary from "@/Views/Reading/ReadingSummary";
    import ReadingNormalQuestion from './Reading/ReadingNormalQuestion'
    import ReadingInsertion from './Reading/ReadingInsertion'
    import ReadingPassage from './Reading/ReadingPassage'
    import TimeEnded from './TimeEnded'
    import ReviewReading from "@/Views/Reading/ReviewReading";
    import {GET_DATA_READING} from "@/store/actions/reading";
    import {COMPUTE_TIME} from "@/store/actions/time";

    export default {
        name: "tpoExam",
        components: {
            ReadingInsertion,
            ReadingNormalQuestion,
            ReadingPassage,
            ReadingSummary,
            TimeEnded,
            ReviewReading
        },
        data(){
            return{
                dialog: true,
            }
        },
        computed:{
            ...mapState({
                currentComponent: state => state.mainTPO.currentComponent
            }),
        },

        mounted() {
            this.$store.dispatch(GET_DATA_READING, 'tpo1');
        },
        created(){
            let self = this;
            setInterval(function() {
                self.$store.dispatch(COMPUTE_TIME)
            }, 1000)

        }
    }
</script>

<style scoped>

</style>