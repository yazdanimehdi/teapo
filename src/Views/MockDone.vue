<template>
  <v-app>
    <v-app-bar absolute
               color="#1C0153"
               dark
               :height="height*0.1"

               src="../assets/icon_group.png"
               style="padding-top:8px;margin: 0;position: fixed; z-index: 10; font-family: Kalam">
      <div style="font-weight: bold; font-size: 20px">Mock</div>
      <v-spacer></v-spacer>
      <v-btn icon @click="goToDashboard">
        <v-icon>{{ icons.mdiChevronRight }}</v-icon>
      </v-btn>
    </v-app-bar>
    <div
        :style="{'font-family':'kalam', 'margin-left':`${width*0.06}px`, 'margin-right': '50px', 'margin-top': `${height*0.03 + height*0.1}px`}">
      <div v-if="loading" style="text-align: center; margin-top: 200px">
        <h1>We Are Sending Your Answers</h1>
        <h2>Please Be Patient</h2>
        <h3>Do Not Leave This Page!</h3>
        <v-progress-circular indeterminate size="50" style="margin-top: 20px"></v-progress-circular>
      </div>
      <div v-else style="text-align: center">
        <div v-if="done">
          <h2>Your Answers Submitted To The Server!</h2>
          <h3>Your Results Will Be Available In Mock Test Tab</h3>
          <v-btn color="#1C0153" large style="font-weight: bold; font-size: 16px; color: white"
                 @click="goToDashboard">Go To Dashboard
          </v-btn>
        </div>
        <div v-else>
          <h2>Something Went Wrong</h2>
          <h3>Try Again</h3>
          <v-btn color="#1C0153" large style="font-weight: bold; font-size: 16px; color: white"
                 @click="sendAgain">Send Again
          </v-btn>
        </div>
      </div>
    </div>
  </v-app>
</template>

<script>
import {END_MOCK_EXAM} from "@/store/actions/mockExams";
import {mdiChevronRight} from "@mdi/js";

export default {
  name: "MockDone",
  data() {
    return {
      loading: true,
      done:false,
      width: 0,
      height: 0,
      icons: {
        mdiChevronRight,
      }
    }
  },
  created() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
    let self = this;
    this.$store.dispatch(END_MOCK_EXAM).then(()=>{
      self.loading = false;
      self.done = true;
    }).catch((err) => {
      console.log(err)
      self.loading = false;
      self.done = false;
    })
  },
  methods: {
    handleResize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
    },
    goToDashboard() {
      this.$router.push('/')
    },
    sendAgain(){
      let self = this;
      this.done = false;
      this.loading = true;
      this.$store.dispatch(END_MOCK_EXAM).then(()=>{
        self.loading = false;
        self.done = true;
      }).catch((err) => {
        console.log(err)
        self.loading = false;
        self.done = false;
      })
    }
  },

}
</script>

<style scoped>

</style>