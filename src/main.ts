const debounce = (callback: Function, delay: number) => {
  let tid: any;
  return function (...args: any[]) {
    const ctx = self;
    tid && clearTimeout(tid);
    tid = setTimeout(() => {
      callback.apply(ctx, args);
    }, delay);
  };
};

const _ResizeObserver = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends _ResizeObserver {
  constructor(callback: ResizeObserverCallback) {
    callback = debounce(callback, 16);
    super(callback);
  }
};

import { VueQueryPlugin } from "@tanstack/vue-query";
import { createApp } from "vue";
import App from "./App.vue";

// 🌟 1. ดึง CSS ของ Vuetify ขึ้นมาให้โหลดก่อนเพื่อนเลย
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";

// 🌟 2. ดึง Custom CSS ของคุณไว้ท้ายสุด เพื่อให้มีพลังการทับ (Override) มากที่สุด!
import "./style.css";

import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, mdi } from "vuetify/iconsets/mdi";

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },  
  theme: {
    defaultTheme: "dark",
      themes: {
      dark: {
        colors: {
          primary: "#2196F3", // 🌟 บังคับประกาศไปเลยว่า primary คือสีฟ้านี้
        },
      },
    },
  },
});

createApp(App)
  .use(VueQueryPlugin)
  .use(vuetify)
  .mount("#app");