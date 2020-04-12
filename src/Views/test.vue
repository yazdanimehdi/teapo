<template>
  <div>
      <v-btn @click="get_readings"></v-btn>
      <p id="result"></p>
  </div>
</template>

<script>
    const electron = require("electron");
    const ipc = electron.ipcRenderer;

    export default {
        name: "test",
        methods:{
            get_readings(){

                    ipc.send("Reading", "tpo1");
                    ipc.on("resultSent", function(evt, result){
                        let resultEl = document.getElementById("result");
                        resultEl.innerHTML += result + "<br/>";

                    });

            }
        }
    }
</script>

<style scoped>

</style>