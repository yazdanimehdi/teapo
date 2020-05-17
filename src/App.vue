<template>
  <div id="app">
      <router-view />
  </div>
</template>

<script>

import {GET_DATA_LISTENING} from "@/store/actions/listening";
import {GET_DATA_SPEAKING} from "@/store/actions/speaking"

export default {
  name: 'app',
  components: {
  },
  created(){
      this.$store.dispatch(GET_DATA_LISTENING, 'tpo1');
      this.$store.dispatch(GET_DATA_SPEAKING, 'tpo1');
  }
}
</script>

<style>
  #app{
    font-family: "Roboto", sans-serif;
  }
</style>
