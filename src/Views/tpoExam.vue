<template>
    <span>
    <component
            :is="currentComponent"
    />
        </span>
</template>

<script>
    import { mapState } from 'vuex'
    import ReadingSummary from "@/Views/ReadingSummary";
    import ReadingNormalQuestion from './ReadingNormalQuestion'
    import ReadingInsertion from './ReadingInsertion'
    import ReadingPassage from './ReadingPassage'
    import TimeEnded from './TimeEnded'
    import ReviewReading from "@/Views/ReviewReading";

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
            ...mapState(['currentComponent', 'questionNumber']),
        },
        methods:{
            // timeUpdate(val){
            //     this.$store.dispatch('updateTimes', val)
            // }
        },
        mounted() {
            this.$store.dispatch('getDataReading', 'tpo1');
        },
        created(){
            let self = this;
            setInterval(function() {
                self.$store.dispatch('timeComputeAction')
            }, 1000)

        }
    }
</script>

<style scoped>

</style>