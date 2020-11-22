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
        :style="{'font-family':'kalam', 'margin-left':`${width*0.06}px`, 'margin-right': '50px', 'margin-top': `${height*0.03 + height*0.1}px`}">
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
            {{
              reviewModel.assigned_corrector === "" || reviewModel.assigned_corrector === null ? 'Not Determined' : reviewModel.assigned_corrector
            }}
          </div>
          <div style="font-size: 20px; margin-bottom: 10px"><span style="font-weight: bold">Score:</span>
            {{ reviewModel.score === null || reviewModel.score === '' ? 'Not Available' : reviewModel.score }}
          </div>
          <div style="font-size: 20px; margin-bottom: 10px"><span style="font-weight: bold">Corrector's Comment:</span>
            {{ reviewModel.comment === "" || reviewModel.comment === null ? 'Not Available' : reviewModel.comment }}
          </div>
          <div style="font-size: 20px; margin-bottom: 10px"><span style="font-weight: bold; margin-right: 20px">Correction Files:</span>
            <span v-if="reviewModel.related_file === null || reviewModel.related_file === '' ">-</span>
            <v-btn v-else @click="myUrlSaveAs(`http://127.0.0.1:8000${reviewModel.related_file}`)">Download</v-btn>
          </div>
        </v-card>
        <template v-if="reviewModel.state === 1">
          <div style="margin-top: 20px; font-size: 20px">Please give us feedback about your corrector</div>
          <v-card color="#C6E8B3" height="200" width="100%"
                  style="margin-bottom: 30px; border-radius: 20px; margin-top: 20px">
            <v-container fluid>
              <v-row style="padding: 5px">
                <v-col cols="4" sm="4" md="4" lg="3" xl="3">
                  <div style="font-weight: bold; font-size: 20px; text-align: center">
                    Corrector rate
                  </div>
                  <div style="text-align: center">
                    <v-rating
                        :empty-icon="icons.mdiStarOutline"
                        :full-icon="icons.mdiStar"
                        v-model="rating"
                        color="#1C0153"
                        length="5"
                        size="40"
                    ></v-rating>
                  </div>

                </v-col>
                <v-col cols="6" sm="6" md="6" lg="7" xl="7">

                  <v-textarea
                      solo
                      name="input-7-4"
                      label="Comment"
                      v-model="comment"
                      :prepend-icon="icons.mdiComment"
                      style="border-radius: 20px"
                      rows="5"
                      auto-grow
                      height="100%"
                  ></v-textarea>


                </v-col>
                <v-col cols="2" sm="2" md="2" lg="2" xl="2" style="padding-top: 60px">
                  <v-btn height="40" color="#1C0153" style="color: white; font-weight: bold; font-size: 16px" @click="sendReview">
                    Send
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </template>

      </div>
    </div>
    <v-snackbar
        v-model="snackbar"
        :timeout="2000"
        :color="snackbarColor"
    >
      {{ snackbarText }}

      <template v-slot:action="{ attrs }">
        <v-btn
            color="#1C0153"
            text
            v-bind="attrs"
            @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>

  </v-app>
</template>

<script>
import {
  mdiChevronRight,
  mdiChevronDown,
  mdiCheckboxBlankOutline,
  mdiCheckboxMarkedOutline,
  mdiStarOutline,
  mdiStar,
  mdiComment
} from '@mdi/js'
import {GET_CORRECTION_REVIEW_DATA, SEND_CORRECTOR_REVIEW} from "@/store/actions/correctionReview";
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
        mdiCheckboxMarkedOutline,
        mdiStarOutline,
        mdiStar,
        mdiComment
      },
      width: 0,
      height: 0,
      loading: true,
      rating: 3,
      comment: '',
      snackbar: false,
      snackbarText: '',
      snackbarColor: '',
    }
  },
  created() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
    let self = this;
    this.$store.dispatch(GET_CORRECTION_REVIEW_DATA).then(() => {
      self.loading = false
      self.rating = self.reviewModel['user_rating']
      self.comment = self.reviewModel['user_review']
    })
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  },
  computed: {
    ...mapGetters(['reviewModel', 'correctionType'])
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
    },
    sendReview(){
      let self = this;
      this.$store.dispatch(SEND_CORRECTOR_REVIEW, {
        'id': this.reviewModel.id,
        'type': this.correctionType,
        'comment': this.comment,
        'rating': this.rating
      }).then((resp)=>{
        if(resp.status === 200){
          self.snackbar = true;
          self.snackbarText = 'Your Review Submitted Successfully';
          self.snackbarColor = 'success';
        }
      }).catch((err)=>{
        console.log(err)
        self.snackbar = true;
        self.snackbarText = 'Something Went Wrong';
        self.snackbarColor = 'error';
      })
    }
  }
}
</script>

<style scoped>

</style>