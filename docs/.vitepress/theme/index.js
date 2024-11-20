// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import avatarlayout  from './avatar.vue'
import { onMounted, watch, nextTick } from 'vue' 
import { useRoute } from 'vitepress'
import mediumZoom from 'medium-zoom'

import './style.css'


/** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  // Layout: () => {
  //   return h(DefaultTheme.Layout, null, {
  //     // https://vitepress.dev/guide/extending-default-theme#layout-slots
  //   })
  // },
  setup() {
    const route = useRoute()
    const initZoom = () => {
      //mediumZoom('[data-zoomable]', { background: 'var(--vp-c-bg)' })
      mediumZoom('.main img', { background: 'var(--vp-c-bg)' })
    };
    onMounted(() => {
      initZoom()
    })
    watch(
      () => route.path,
      () => nextTick(() => initZoom())
    )
  },
  Layout: avatarlayout,
  enhanceApp({ app, router, siteData }) {
    // ...
  }
}
