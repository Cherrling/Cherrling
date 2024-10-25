import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Cherrling 的内容归档😋",
  description: "克拉克三定律之⼀：任何足够先进的技术和魔法是不可区分的",
  lastUpdated: 'Last Updated',

  head: [['link', { rel: 'icon', href: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%221em%22 font-size=%2280%22>😋</text></svg>' }]],


  themeConfig: {

    // siteTitle:false,
    // logo:'docs/assets/README/6FE475F45003FA1E7961C5F6F1736203D7C120CD982A1A08A730B155D5336F0D.jpg',
    outline:'deep',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
    ],

    sidebar: [
      {
        text: '机场相关及使用说明',
        link: '/v2'
      },
      {
        text: 'linux命令速查',
        link: '/linux'
      },
      {
        text: 'TeamSpeak速通教程',
        link: '/ts'
      },
      {
        text: '什么是KillingHouse',
        link: '/killing-house'
      },
      {
        text: 'HTTPS与TLS证书链校验',
        link: '/ssl'
      },
      {
        text: 'Github教育资格申请速通',
        link: '/copilot'
      },
      {
        text: 'CNAME与根域名',
        link: '/cname'
      },
      {
        text: '计算机网络',
        link: '/hit-net'
      },
      {
        text: 'dns技术在代理环境中的应用',
        link: '/dns-技术在代理环境中的应用'
      },
      {
        text: 'Certbot安装证书',
        link: '/certbot'
      },
      {
        text: 'WireGuard',
        link: '/wg'
      },
      {
        text: 'Nvidia及Cuda驱动',
        link: '/nvidia'
      },
      {
        text: '折腾debian服务器',
        link: '/debian'
      },
      {
        text: '密码学中问题',
        link: '/cryptography'
      },
      {
        text: 'CSAPP',
        link: '/csapp'
      },
      {
        text: 'SSH中的正向/反向代理',
        link: '/ssh_forward'
      },
      {
        text: 'Tailscale自建Derp',
        link: '/derp'
      },
      {
        text: 'KMS一键激活Windows',
        link: '/kms'
      },
      {
        text: 'ZFS爆炸指北',
        link: '/zfs'
      },
      {
        text: 'Linux 开启 BBR 网络加速',
        link: '/bbr'
      },
      {
        text: 'CTF',
        link: '/ctf/',
        items: [
          {
            text: '20240615选修课',
            link: '/ctf/20240615-writeup'
          },
          {
            text: 'train2024',
            link: '/ctf/train2024'
          },
          {
            text: '春秋杯',
            link: '/ctf/ichunqiu'
          },
          {
            text: 'Crypto',
            link: '/ctf/crypto'
          },{
            text: '405 欢乐赛',
            link: '/ctf/405'

          }
        ]
      },
      {
        text: '我在PLCT',
        link: '/plct/',
        items: [
          {
            text: '梦开始的地方',
            link: '/plct/init'
          },
          {
            text: '第一个pr：工作流程概述',
            link: '/plct/first_pr'
          }
        ]
      },


    ],
    

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Cherrling/Cherrling' }
    ]
  }
})
