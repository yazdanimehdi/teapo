<template>
  <div id="app">
      <router-view />
  </div>
</template>

<script>

import {mapGetters} from 'vuex'
export default {
  name: 'app',
  components: {
  },
  computed:{
    ...mapGetters(['isAuthenticated'])
  },
  watch: {
    isAuthenticated(newVal){
      if(newVal === false){
        this.$router.push('/register_login')
      }
    }
  },
  created(){
  }
}
</script>

<style>
  #app{
    font-family: "Roboto", sans-serif;
  }
</style>
