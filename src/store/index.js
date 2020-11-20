import Vue from "vue";
import Vuex from "vuex";
import time from './modules/time';
import reading from './modules/reading';
import listening from "./modules/listening";
import speaking from "@/store/modules/speaking";
import writing from "@/store/modules/writing";
import mainTPO from "./modules/mainTPO";
import dictionary from "@/store/modules/dictionary";
import studyWords from "@/store/modules/studyWords";
import dashboard from "@/store/modules/dashboard";
import TPOPage from "@/store/modules/TPOPage";
import auth from "@/store/modules/auth";
import signup from "@/store/modules/signup";
import user from "@/store/modules/user";
import download from "@/store/modules/download";
import analytics from "@/store/modules/analytics";
import reviewExam from "@/store/modules/reviewExam";
import correction from "@/store/modules/correction";
import correctionReview from "@/store/modules/correctionReview";


Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

export default new Vuex.Store({
    modules: {
        time: time,
        reading:reading,
        mainTPO: mainTPO,
        listening: listening,
        speaking: speaking,
        writing: writing,
        dictionary: dictionary,
        studyWords: studyWords,
        dashboard: dashboard,
        TPOPage: TPOPage,
        auth: auth,
        signup: signup,
        user: user,
        download: download,
        analytics: analytics,
        reviewExam: reviewExam,
        correction: correction,
        correctionReview: correctionReview,
    },
    strict: debug
});