# 妙妙工具们

油猴脚本，在 `https://tracker.debian.org/pkg/*` 页面上添加一键复制包名和 dget 链接的按钮。

```javascript
// ==UserScript==
// @name         Debian Tracker H1 and DSC Links Copier
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Copy H1 content and .dsc links from Debian Tracker pages
// @author       Cherrling
// @match        https://tracker.debian.org/pkg/*
// @grant        GM_setClipboard
// ==/UserScript==

(function() {
    'use strict';

    // 获取 h1 标签的内容
    const h1 = document.querySelector('h1');
    if (!h1) {
        console.warn('未找到 h1 标签');
        return;
    }

    const PKG = h1.textContent.trim();

    // 创建复制 PKG 按钮
    const pkgButton = document.createElement('button');
    pkgButton.textContent = 'copy';
    pkgButton.style.marginLeft = '10px';
    pkgButton.style.cursor = 'pointer';

    // 设置 PKG 按钮点击事件
    pkgButton.addEventListener('click', function() {
        GM_setClipboard(PKG);
        console.log(`已复制: ${PKG}`);
    });

    // 将 PKG 按钮添加到 h1 标签内
    h1.appendChild(pkgButton);

    // 遍历所有 class 为 versioned-links-icon 的 span 元素
    const spans = document.querySelectorAll('span.versioned-links-icon');
    spans.forEach(span => {
        const link = span.querySelector('a');
        if (link && link.href.endsWith('.dsc')) {
            const dscLink = link.href;

            // 创建复制链接按钮
            const linkButton = document.createElement('button');
            linkButton.textContent = 'copy';
            linkButton.style.marginLeft = '5px';
            linkButton.style.cursor = 'pointer';

            // 设置链接按钮点击事件
            linkButton.addEventListener('click', function() {
                GM_setClipboard(dscLink);
                console.log(`已复制: ${dscLink}`);
            });

            // 将按钮添加到 span 中
            span.appendChild(linkButton);
        }
    });

})();
```