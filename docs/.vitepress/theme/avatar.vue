<script setup>
import DefaultTheme from 'vitepress/theme'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #sidebar-nav-before>
        <a href="/">
            <img style='border-radius: 50%;margin: 10px;' 
            src="https://docsify-archive.cherrling.pages.dev/docs/assets/README/6FE475F45003FA1E7961C5F6F1736203D7C120CD982A1A08A730B155D5336F0D.jpg" 
            alt="">
            <div style="text-align: center;font-size: larger;"><span>Cherrling</span></div>
        </a>
    </template>
  </Layout>
</template>