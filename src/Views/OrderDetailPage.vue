<template>
  <v-app>
    <v-app-bar absolute
               color="#1C0153"
               dark
               :height="height*0.1"

               src="../assets/icon_group.png"
               style="padding-top:8px;margin: 0;position: fixed; z-index: 10; font-family: Kalam">
      <div style="font-weight: bold; font-size: 20px">Order Details</div>
      <v-spacer></v-spacer>
      <v-btn icon @click="goToDashboard">
        <v-icon>{{ icons.mdiChevronRight }}</v-icon>
      </v-btn>
    </v-app-bar>
    <div
        :style="{'font-family':'kalam', 'margin-left':`${width*0.06}px`, 'margin-right': '50px', 'margin-top': `${height*0.08 + height*0.1}px`}">
      <div v-if="loading" style="text-align: center; margin-top: 100px">
        <v-progress-circular indeterminate size="50"></v-progress-circular>
      </div>
      <div v-else>
        <h2>Order Details</h2>
        <v-card style="background-color: #CDBFE9; border-radius: 20px; margin-top: 20px; padding: 40px" height="100%"
                width="100%">
          <div style="font-size: 20px; margin-bottom: 10px">
            <v-container style="padding: 0; margin: 0">
              <v-row style="margin: 0">
                <v-col sm="6" md="6" lg="6" xl="6" cols="6" style="padding: 0">
                  <span style="font-weight: bold">Id:</span> {{ reviewModel.id }}
                </v-col>
                <v-col sm="6" md="6" lg="6" xl="6" cols="6" style="padding: 0">
                  <v-btn color="#1C0153" large style="font-weight: bold; font-size: 16px; color: white"
                         @click="openReview(reviewModel['local_user_test_id'])">Review Answers
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </div>
          <div style="font-size: 20px; margin-bottom: 10px"><span style="font-weight: bold">Date:</span>
            {{ reviewModel.date | formatDate }}
          </div>
          <div style="font-size: 20px; margin-bottom: 10px"><span style="font-weight: bold">Status:</span>
            {{ reviewModel.state === 0 ? 'InProgress' : 'Completed' }}
          </div>
          <div style="font-size: 20px; margin-bottom: 10px"><span style="font-weight: bold">Assigned Corrector:</span>
            {{ reviewModel.assigned_corrector === "" || reviewModel.assigned_corrector === null? 'Not Determined' : reviewModel.assigned_corrector }}
          </div>
          <div style="font-size: 20px; margin-bottom: 10px"><span style="font-weight: bold">Score:</span>
            {{ reviewModel.score === null || reviewModel.score === '' ? 'Not Available' : reviewModel.score }}
          </div>
          <div style="font-size: 20px; margin-bottom: 10px"><span style="font-weight: bold">Corrector's Comment:</span>
            {{ reviewModel.comment === "" || reviewModel.comment === null ? 'Not Available' : reviewModel.comment }}
          </div>
          <div style="font-size: 20px; margin-bottom: 10px"><span style="font-weight: bold; margin-right: 20px">Correction Files:</span>
            <span v-if="reviewModel.related_file === null || reviewModel.related_file === '' ">'-'</span>
            <v-btn v-else @click="myUrlSaveAs(`http://127.0.0.1:8000${reviewModel.related_file}`)">Download</v-btn>
          </div>
        </v-card>
        <div style="margin-top: 20px; font-size: 20px">Please give us feedback about your corrector</div>
        <v-card color="#C6E8B3" height="200" width="100%" style="margin-bottom: 30px; border-radius: 20px; margin-top: 20px"></v-card>
      </div>
    </div>

  </v-app>
</template>

<script>
import {mdiChevronRight, mdiChevronDown, mdiCheckboxBlankOutline, mdiCheckboxMarkedOutline} from '@mdi/js'
import {GET_CORRECTION_REVIEW_DATA} from "@/store/actions/correctionReview";
import {mapGetters} from 'vuex';
import {SET_REVIEW_USER_TEST_ID} from "@/store/actions/reviewExam";

export default {
  name: "OrderDetailPage",
  data() {
    return {
      icons: {
        mdiChevronRight,
        mdiChevronDown,
        mdiCheckboxBlankOutline,
        mdiCheckboxMarkedOutline
      },
      width: 0,
      height: 0,
      loading: true
    }
  },
  created() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
    let self = this;
    this.$store.dispatch(GET_CORRECTION_REVIEW_DATA).then(() => {
      self.loading = false
    })
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  },
  computed: {
    ...mapGetters(['reviewModel'])
  },
  methods: {
    goToDashboard() {
      this.$router.push('/')
    },
    handleResize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
    },
    openReview(userTestId) {
      this.$store.dispatch(SET_REVIEW_USER_TEST_ID, userTestId)
      this.$router.push('/review')
    },
    myUrlSaveAs(remoteUrl) {
      const {app, dialog} = require('electron').remote;
      const path = require('path');
      let toLocalPath = path.resolve(app.getPath("desktop"), path.basename(remoteUrl));

      let userChosenPath = dialog.showSaveDialog({defaultPath: toLocalPath});
      userChosenPath.then((pathChosen) => {
        this.download(remoteUrl, pathChosen, this.myUrlSaveAsComplete)
      })
    },

    myUrlSaveAsComplete(err) {
      console.log(err)
      alert("done");
    },

    download(url, dest, cb) {
      const fs = require('fs')
      let file = fs.createWriteStream(dest.filePath);
      let http = require('http');
      http.get(url, function (response) {
        response.pipe(file);
        file.on('finish', function () {
          file.close(cb); // close() is async, call cb after close completes.
        });
      }).on('error', function (err) { // Handle errors
        fs.unlink(dest.filePath); // Delete the file async. (But we don't check the result)
        if (cb) cb(err.message);
      });
    }
  }
}
</script>

<style scoped>

</style>