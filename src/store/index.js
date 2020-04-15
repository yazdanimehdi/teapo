import Vue from "vue";
import Vuex from "vuex";
import time from './modules/time';
import reading from './modules/reading';
import mainTPO from "./modules/mainTPO";


Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

export default new Vuex.Store({
    modules: {
        time: time,
        reading:reading,
        mainTPO: mainTPO,
    },
    strict: debug
});