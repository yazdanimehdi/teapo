<template>
  <div id="app">
      <router-view />
        <v-dialog persistent width="300" v-model="dialog">
          <v-card width="600" height="300" style="text-align: center; font-family: kalam">
            <h2>Please Be Patient!</h2>
            <h3 style="margin: 20px;">Downloading The Dictionary</h3>
            <div style="margin: 50px">
              <v-progress-linear
                  :value="Math.ceil((receivedBytes/this.totalBytes)*100)"
                  :query="true"
                  height="15"
                  striped
                  rounded
                  color="green"
              ><strong>{{ Math.ceil((receivedBytes/this.totalBytes)*100) }}%</strong></v-progress-linear>
            </div>
          </v-card>
        </v-dialog>
  </div>
</template>

<script>

import {mapGetters} from 'vuex'
export default {
  name: 'app',
  data(){
    return{
      dialog: false,
      receivedBytes: 0,
      totalBytes: 254300000,
      downloadValue: 0,
    }
  },
  computed:{
    ...mapGetters(['isAuthenticated']),
  },
  watch: {
    isAuthenticated(newVal){
      if(newVal === false){
        this.$router.push('/register_login')
      }
    },
    receivedBytes(newVal){
      this.downloadQuery = false
      this.downloadValue = (newVal/this.totalBytes)*100
    }
  },
  created(){
    let self = this
    let app = require('electron').remote.app
    const dictDir = require('path').join(app.getPath('userData'), 'longman.sqlite');
    let fs = require('fs')
    if(!fs.existsSync(dictDir)){
      console.log('salam')
      this.dialog = true;
      let url = 'http://127.0.0.1:8000/media/Dictionary/longman.sqlite3'
      let file = fs.createWriteStream(dictDir);
      let http = require('http');
      http.get(url, function (response) {
        response.pipe(file)
        response.on('data', function(chunk) {
          // Update the received bytes
          self.receivedBytes += chunk.length;
        });
        file.on('finish', function () {
          self.dialog = false
          file.close(); // close() is async, call cb after close completes.
        });
      }).on('error', function () { // Handle errors
        fs.unlink(dictDir); // Delete the file async. (But we don't check the result)
      });
    }
    if(this.isAuthenticated === false){
      this.$router.push('/register_login')
    }
  }
}
</script>

<style>
  #app{
    font-family: "Roboto", sans-serif;
  }
</style>
