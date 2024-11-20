
# Vitepress 实现图片放大


http://www.freeendless.com/misc/vitepress/image-zoom.html

https://github.com/vuejs/vitepress/issues/854


## 效果示例

点击即可放大

![alt text](assets/image-zoom/photo_2024-11-20_16-05-29.jpg)



## 安装medium-zoom

```shell
pnpm add -D medium-zoom
```

## 配置文件

在 `docs/.vitepress/theme/index.ts` 中添加以下代码：

```javascript
import DefaultTheme from 'vitepress/theme'
import { onMounted, watch, nextTick } from 'vue' // [!code focus:3]
import { useRoute } from 'vitepress'
import mediumZoom from 'medium-zoom'
import './global.css'

export default {
  extends: DefaultTheme,
  
  setup() {// [!code focus:14]
    const route = useRoute()
    const initZoom = () => {
      // 为所有图片增加缩放功能
      mediumZoom('.main img', { background: 'var(--vp-c-bg)' })
    }
    onMounted(() => {
      initZoom()
    })
    watch(
      () => route.path,
      () => nextTick(() => initZoom())
    )
  }
}
```

修改 `docs/.vitepress/theme/global.css` ，记得在`docs/.vitepress/theme/index.ts`中引入：
    
```css
.medium-zoom-overlay {
  background-color: var(--vp-c-bg) !important;
  z-index: 100;
}

.medium-zoom-overlay ~ img {
  z-index: 101;
}

.medium-zoom--opened .medium-zoom-overlay {
  opacity: 0.9 !important;
}
```
