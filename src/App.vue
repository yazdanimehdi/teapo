<template>
  <div id="app">
    <router-view v-if="!dialog"/>
    <div style="text-align: center; font-family: kalam; height: 300px; width: 600px; background-color: white; border-radius: 20px;" v-else>
      <h2>Please Be Patient!</h2>
      <h3 style="margin: 20px;">Downloading The Dictionary</h3>
      <div style="margin: 50px" v-if="!tryAgain">
        <v-progress-linear
            :value="Math.ceil((receivedBytes/this.totalBytes)*100)"
            :query="true"
            height="15"
            striped
            rounded
            color="green"
            background-color="gray"
        ><strong>{{ Math.ceil((receivedBytes / this.totalBytes) * 100) }}%</strong></v-progress-linear>
      </div>
      <div v-else>
        <v-btn @click="download">
          Try Again
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>

import {mapGetters} from 'vuex'
import fs from "fs";

export default {
  name: 'app',
  data() {
    return {
      dialog: false,
      receivedBytes: 0,
      totalBytes: 254300000,
      downloadValue: 0,
      tryAgain: false,
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated']),
  },
  watch: {
    isAuthenticated(newVal) {
      if (newVal === false) {
        this.$router.push('/register_login')
      }
    },
    receivedBytes(newVal) {
      this.downloadQuery = false
      this.downloadValue = (newVal / this.totalBytes) * 100
    }
  },
  created() {
    let self = this
    let app = require('electron').remote.app
    const dictDir = require('path').join(app.getPath('userData'), 'longman.sqlite');
    let fs = require('fs')
    if (!fs.existsSync(dictDir)) {
      this.dialog = true;
      let url = 'http://127.0.0.1:8000/media/Dictionary/longman.sqlite3'
      let file = fs.createWriteStream(dictDir);
      let http = require('http');
      http.get(url, function (response) {
        response.pipe(file)
        response.on('data', function (chunk) {
          // Update the received bytes
          self.receivedBytes += chunk.length;
        });
        file.on('finish', function () {
          if(self.receivedBytes < 254000000){
            fs.unlink(dictDir, function (){
              self.dialog = true
              self.tryAgain = true
            })
          }
          else {
            self.dialog = false
            file.close();
          }
        });
      }).on('error', function () { // Handle errors
        fs.unlink(dictDir,function (){
          self.dialog = true
          self.tryAgain = true
        }); // Delete the file async. (But we don't check the result)
      });
    }
    else{
      let stats = fs.statSync(dictDir)
      if(stats.size < 254000000){
        fs.unlink(dictDir, function (){
          self.dialog = true
          self.tryAgain = true
        })
      }
    }
    if (this.isAuthenticated === false) {
      this.$router.push('/register_login')
    }
  },
  methods:{
    download: async function () {
      this.tryAgain = false
      let self = this
      let app = require('electron').remote.app
      const dictDir = require('path').join(app.getPath('userData'), 'longman.sqlite');
      let fs = require('fs')
      if (fs.existsSync(dictDir)) {
        await fs.unlink(dictDir, function (){
        })
        this.dialog = true;
        let url = 'http://main.teapo.ir/media/Dictionary/longman.sqlite3'
        let file = fs.createWriteStream(dictDir);
        let http = require('http');
        http.get(url, function (response) {
          response.pipe(file)
          response.on('data', function (chunk) {
            // Update the received bytes
            self.receivedBytes += chunk.length;
          });
          file.on('finish', function () {
            if (self.receivedBytes < 230000000) {
              fs.unlink(dictDir).then(() => {
                self.dialog = true
                self.tryAgain = true
              });
            } else {
              self.dialog = false
              file.close();
            }
          });
        }).on('error', function () { // Handle errors
          fs.unlink(dictDir).then(() => {
            self.dialog = true
            self.tryAgain = true
          }); // Delete the file async. (But we don't check the result)
        });
      }
      else{
        this.dialog = true;
        let url = 'http://main.teapo.ir/media/Dictionary/longman.sqlite3'
        let file = fs.createWriteStream(dictDir);
        let http = require('http');
        http.get(url, function (response) {
          response.pipe(file)
          response.on('data', function (chunk) {
            // Update the received bytes
            self.receivedBytes += chunk.length;
          });
          file.on('finish', function () {
            if (self.receivedBytes < 230000000) {
              fs.unlink(dictDir).then(() => {
                self.dialog = true
                self.tryAgain = true
              });
            } else {
              self.dialog = false
              file.close();
            }
          });
        }).on('error', function () { // Handle errors
          fs.unlink(dictDir).then(() => {
            self.dialog = true
            self.tryAgain = true
          }); // Delete the file async. (But we don't check the result)
        });
      }
    }
  }
}
</script>

<style>
#app {
  font-family: "Roboto", sans-serif;
}
</style>
