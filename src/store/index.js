import Vue from "vue";
import Vuex from "vuex";
import time from './modules/time';
import reading from './modules/reading';
import listening from "./modules/listening";
import speaking from "@/store/modules/speaking";
import writing from "@/store/modules/writing";
import mainTPO from "./modules/mainTPO";


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

    },
    strict: debug
});