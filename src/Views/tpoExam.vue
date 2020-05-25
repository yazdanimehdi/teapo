<template>
    <span>
    <component
            style="background-color: white"
            :is="currentComponent"
    />
        </span>
</template>

<script>
    import {mapState} from 'vuex'
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

    import SpeakingDirections from "@/Views/Speaking/SpeakingDirections";
    import DirectionSpeaking from "@/Views/Speaking/DirectionSpeaking";
    import Recorder from "@/Views/Speaking/Recorder";
    import SpeakingPlayer from "@/Views/Speaking/SpeakingPlayer";
    import SpeakingReading from "@/Views/Speaking/SpeakingReading";

    import WritingDirection from "@/Views/Writing/WritingDirection";
    import IndependentWritingDirection from "@/Views/Writing/IndependentWritingDirection";
    import IntegratedWritingDirection from "@/Views/Writing/IntegratedWritingDirection";
    import WritingIndependent from "@/Views/Writing/WritingIndependent";
    import WritingIntegrated from "@/Views/Writing/WritingIntegrated";
    import WritingPlayer from "@/Views/Writing/WritingPlayer";
    import WritingReading from "@/Views/Writing/WritingReading";

    import {COMPUTE_TIME} from "@/store/actions/time";

    import {START_TPO} from "@/store/actions/mainTPO";

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
            QuotePlayer,
            SpeakingDirections,
            DirectionSpeaking,
            Recorder,
            SpeakingPlayer,
            SpeakingReading,
            IndependentWritingDirection,
            IntegratedWritingDirection,
            WritingIndependent,
            WritingIntegrated,
            WritingPlayer,
            WritingReading,
            WritingDirection
        },
        data() {
            return {
                dialog: true,
            }
        },
        computed: {
            ...mapState({
                currentComponent: state => state.mainTPO.currentComponent
            }),
        },

        mounted() {
            this.$store.dispatch(START_TPO, {
                'examArray': ['Reading', 'Listening', 'Speaking', 'Writing'],
                'TPO': 'tpo1'
            })
        },
        created() {
            let self = this;
            setInterval(function () {
                self.$store.dispatch(COMPUTE_TIME)
            }, 1000)

        }
    }
</script>

<style scoped>
</style>