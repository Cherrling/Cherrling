<script setup>
import DefaultTheme from 'vitepress/theme'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #sidebar-nav-before>
        <a href="/">
            <!-- <img style='border-radius: 50%;margin: 10px;' src="https://docsify-archive.cherrling.pages.dev/docs/assets/README/6FE475F45003FA1E7961C5F6F1736203D7C120CD982A1A08A730B155D5336F0D.jpg" alt=""> -->
            <img style='border-radius: 50%;margin: 10px;'  src="https://img.923329.xyz/api/cfile/AgACAgQAAyEGAASRzsK6AAIBJGcqbY6Yqn34Zg63rlZBHAlwTpG1AAJRxTEbMilYUUENPyqPRrjEAQADAgADbQADNgQ">
            <div style="text-align: center;font-size: larger;"><span>Cherrling</span></div>
        </a>
    </template>
    <template #layout-bottom>
        <div style="z-index: 100;text-align: center;padding: 10px;">
          <a href="https://icp.gov.moe/?keyword=20252233" target="_blank">萌ICP备20252233号</a>
        </div>
        
    </template>
  </Layout>
</template>