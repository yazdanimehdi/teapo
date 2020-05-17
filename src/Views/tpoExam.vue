<template>
    <span >
    <component
            style="background-color: white"
            :is="currentComponent"
    />
        </span>
</template>

<script>
    import { mapState } from 'vuex'
    import ReadingSummary from "./Reading/ReadingSummary";
    import ReadingNormalQuestion from './Reading/ReadingNormalQuestion'
    import ReadingInsertion from './Reading/ReadingInsertion'
    import ReadingPassage from './Reading/ReadingPassage'
    import ReadingDirection from "./Reading/ReadingDirection";
    import ReviewReading from "./Reading/ReviewReading";

    import TimeEnded from './TimeEnded';

    import ListeningDirection from "./Listening/ListeningDirection";
    import ListeningQuestions from "@/Views/Listening/ListeningQuestions";
    import Player from "./Listening/Player";
    import QuotePlayer from "./Listening/QuotePlayer";

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
            ReviewReading,
            ReadingDirection,
            ListeningDirection,
            Player,
            ListeningQuestions,
            QuotePlayer

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