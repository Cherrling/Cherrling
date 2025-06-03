# 妙妙工具们


## GitHub PR Links Extractor

在 GitHub PR 页面上提取所有 PR 链接，并以 Markdown 格式输出，支持一键复制。

```javascript
// ==UserScript==
// @name         GitHub PR Links Extractor
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  提取GitHub PR页面的所有PR链接并以Markdown格式输出
// @author       You
// @match        https://github.com/pulls*
// @match        https://github.com/pulls?*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    window.addEventListener('load', function() {
        // 获取所有PR链接元素
        const prLinks = document.querySelectorAll('.js-navigation-container a.js-navigation-open.markdown-title');

        // 如果没有找到PR链接，直接返回
        if (prLinks.length === 0) {
            console.log('No PR links found on this page.');
            return;
        }

        // 创建输出容器
        const outputDiv = document.createElement('div');
        outputDiv.style.margin = '20px';
        outputDiv.style.padding = '15px';
        outputDiv.style.border = '1px solid #e1e4e8';
        outputDiv.style.borderRadius = '6px';
        outputDiv.style.backgroundColor = '#f6f8fa';
        outputDiv.style.color = "green"

        // 添加标题
        const title = document.createElement('h3');
        title.textContent = 'Extracted PR Links (' + prLinks.length + ')';
        title.style.marginTop = '0';
        outputDiv.appendChild(title);

        // 创建包含所有链接的pre元素
        const pre = document.createElement('pre');
        pre.style.whiteSpace = 'pre-wrap';
        pre.style.wordWrap = 'break-word';

        // 收集所有链接的Markdown格式
        let markdownOutput = '';
        prLinks.forEach(link => {
            const title = link.textContent.trim();
            const href = link.href;
            markdownOutput += `[${title}](${href})\n`;
        });

        // 将输出添加到pre元素
        pre.textContent = markdownOutput;

        // 添加复制按钮
        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy to Clipboard';
        copyButton.style.marginTop = '10px';
        copyButton.style.padding = '5px 10px';
        copyButton.style.backgroundColor = '#2ea44f';
        copyButton.style.color = 'white';
        copyButton.style.border = 'none';
        copyButton.style.borderRadius = '4px';
        copyButton.style.cursor = 'pointer';

        copyButton.addEventListener('click', function() {
            navigator.clipboard.writeText(markdownOutput).then(() => {
                copyButton.textContent = 'Copied!';
                setTimeout(() => {
                    copyButton.textContent = 'Copy to Clipboard';
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
                copyButton.textContent = 'Error copying';
            });
        });

        // 将元素添加到输出容器
        outputDiv.appendChild(pre);
        outputDiv.appendChild(copyButton);

        // 将输出容器添加到页面底部
        const mainContent = document.querySelector('.application-main') || document.body;
        mainContent.appendChild(outputDiv);
    });
})();
```



## Debian Tracker H1 和 DSC 链接复制器

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