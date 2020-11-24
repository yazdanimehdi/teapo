<template>
  <v-app>
    <div style="width: 100%">
      <div class="toolbar">
        <br>
        <v-layout column justify-center align-space-between fill-height>
          <v-layout justify-space-between fill-height>
            <v-spacer></v-spacer>
            <img class="btn" src="../../assets/continue.png" @click="goToNext">
          </v-layout>
        </v-layout>
      </div>
      <v-container fluid style="background-color: rgb(231, 214, 206)" :style="{'height': `${height - 110}px`}">
        <v-row align="center" justify="center">
          <v-col sm="6" md="6" cols="6" lg="6" xl="6" :style="{'padding-top': `${(height - 110)/2}px`}">
            <div class="direction">
              <div class="text">
                <p>Your time has ended for answering the questions in this section of the test</p>
              </div>
            </div>
          </v-col>

        </v-row>
      </v-container>
    </div>
  </v-app>
</template>

<script>
import {mapGetters} from 'vuex'
import {NEXT_SECTION} from "@/store/actions/mainTPO";
import {LISTENING_TIME_ENDED} from "@/store/actions/listening";
import {GET_USER_DATA} from "@/store/actions/user";

export default {
  name: "TimeEnded",
  computed: {
    ...mapGetters(['currentSection'])
  },
  data() {
    return {
      width: 0,
      height: 0,
    }
    },
  created() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
    this.$store.dispatch(GET_USER_DATA)
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    goToNext() {
      console.log('salam')
      if (this.currentSection === 'Reading') {
        this.$store.dispatch(NEXT_SECTION)
      }
      if (this.currentSection === 'Listening') {
        this.$store.dispatch(LISTENING_TIME_ENDED)
      }
    },
    handleResize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
    },
  }
}
</script>

<style scoped>
.toolbar {
  height: 110px;
  width: 100%;
  background: linear-gradient(to right, rgb(61, 83, 135), rgb(113, 53, 60));

}

.btn {
  height: 42px;
  width: auto;
  bottom: 10px;
  position: relative;
  right: 10px;

}

.text {
  font-family: Verdana;
  font-weight: bold;
  font-size: 18px;
}
</style>
