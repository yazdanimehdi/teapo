<template>
  <div style="width: 100%">
    <div class="toolbar">
      <br>
      <v-layout column justify-center align-space-between fill-height>
        <v-layout justify-space-between  fill-height>
          <v-spacer></v-spacer>
          <img class="btn" src="../assets/continue.png" @click="goToNext">
        </v-layout>
      </v-layout>
    </div>
    <div  style="background-color: rgb(231, 214, 206); height: 1000px">
      <v-layout column fill-height>
        <div style="height: 10%"></div>
        <div class="direction">
          <div class="text">
            <p>Your time has ended for answering the questions in this section of the test</p>
          </div>
        </div>
      </v-layout>

    </div>
  </div>
</template>

<script>
  export default {
    name: "TimeEnded",
    methods:{
      goToNext(){
        this.$store.dispatch('timeEnded')
      }
    }
  }
</script>

<style scoped>
  .toolbar{
    height:110px;
    width: 100%;
    background: linear-gradient(to right, rgb(61,83,135), rgb(113,53,60)) ;

  }
  .btn{
    height: 42px;
    width: auto;
    bottom: 10px;
    position: relative;
    right: 10px;

  }
  .text{
    font-family: Verdana;
    font-size: 16px;
    font-weight: bold;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 18px;
  }
</style>
