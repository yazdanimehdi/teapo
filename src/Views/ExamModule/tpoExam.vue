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
    import ListeningQuestions from "./Listening/ListeningQuestions";
    import Player from "./Listening/Player";
    import QuotePlayer from "./Listening/QuotePlayer";

    import SpeakingDirections from "./Speaking/SpeakingDirections";
    import DirectionSpeaking from "./Speaking/DirectionSpeaking";
    import Recorder from "./Speaking/Recorder";
    import SpeakingPlayer from "./Speaking/SpeakingPlayer";
    import SpeakingReading from "./Speaking/SpeakingReading";

    import WritingDirection from "./Writing/WritingDirection";
    import IndependentWritingDirection from "./Writing/IndependentWritingDirection";
    import IntegratedWritingDirection from "./Writing/IntegratedWritingDirection";
    import WritingIndependent from "./Writing/WritingIndependent";
    import WritingIntegrated from "./Writing/WritingIntegrated";
    import WritingPlayer from "./Writing/WritingPlayer";
    import WritingReading from "./Writing/WritingReading";
    import TimeEndedWriting from "@/Views/ExamModule/Writing/TimeEndedWriting";

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
            WritingDirection,
            TimeEndedWriting,
        },
        data() {
            return {
                dialog: true,
              interval: '',
            }
        },
        computed: {
            ...mapState({
                currentComponent: state => state.mainTPO.currentComponent,
                mode: state => state.mainTPO.mode
            }),
        },

        created() {
            let self = this;
            if(this.mode !== 'reviewMode'){
              this.interval = setInterval(function () {
                self.$store.dispatch(COMPUTE_TIME)
              }, 1000)
            }
        },
      beforeDestroy() {
          clearInterval(this.interval)
      }
    }
</script>

<style scoped>
</style>