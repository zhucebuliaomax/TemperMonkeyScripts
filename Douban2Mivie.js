// ==UserScript==
// @name           Douban2EXT
// @name:en        Douban2EXT
// @namespace
// @version        1.1.1
// @author         ilovemonkey
// @description    在豆瓣电影详情页加入搜索按钮，可以直接跳转至EXT搜索资源；在EXT详情页可以跳转豆瓣。
// @description:en Add a search button above Douban's movie info, allowing users to search for related resources on EXT.
// @match          https://movie.douban.com/subject/*
// @match          https://ext.to/*
// @license        MIT
// @grant          none
// ==/UserScript==

(function() {
  'use strict';

  const url = window.location.href;

  // ==========================================
  // 逻辑块 1：在豆瓣页面，注入 EXT 搜索按钮
  // ==========================================
  if (url.indexOf('https://movie.douban.com/subject/') !== -1) {
    let checkCount = 0;
    const maxChecks = 50;

    const checkInterval = setInterval(() => {
      const info = document.getElementById('info');

      if (info) {
        clearInterval(checkInterval);

        const imdbLink = info.querySelector('a[href*="imdb.com/title/tt"]');
        const imdbId = imdbLink?.textContent?.trim() || '';

        if (imdbId) {
          const searchUrl = `https://ext.to/browse/?imdb_id=${imdbId}`;

          const button = document.createElement('button');
          button.style.cssText = `
            width: 120px;
            height: 22px;
            margin-top: 5px;
            margin-bottom: 5px;
            background: linear-gradient(265.04deg, #2B2538 0.83%, #213552 99.5%);
            box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.5);
            border-radius: 4px;
            color: white;
            font-family: 'Segoe UI';
            font-weight: normal;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          `;

          const searchInText = document.createTextNode('Search in\u00a0');
          const extText = document.createElement('span');

          extText.style.cssText =
            'background-image: url(https://s2.loli.net/2023/02/27/qvZXiaKgsU2Ocnd.gif);' +
            'background-size: cover;' +
            'background-repeat: no-repeat;' +
            'background-position: 50% 50%;' +
            'background-clip: text;' +
            '-webkit-background-clip: text;' +
            '-webkit-text-fill-color: transparent;' +
            'color: rgb(136, 136, 136);' +
            'font-weight: bold;' +
            'display: inline-block;';

          extText.textContent = 'EXT';
          button.append(searchInText, extText);

          let timeoutId;
          const mouseOverHandler = () => {
            clearTimeout(timeoutId);
            button.style.transform = 'translateY(-3px)';
            button.style.boxShadow = '0px 3px 3px rgba(0, 0, 0, 0.25)';
            button.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
          };

          const mouseOutHandler = () => {
            clearTimeout(timeoutId);
            button.style.transform = 'none';
            button.style.boxShadow = '0px 1px 1px rgba(0, 0, 0, 0.5)';
            button.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
          };

          button.addEventListener('mouseover', mouseOverHandler);
          button.addEventListener('mouseout', mouseOutHandler);
          button.addEventListener('click', () => window.open(searchUrl, '_blank'));

          info.insertBefore(button, info.firstElementChild);
        }
      }

      checkCount++;
      if (checkCount >= maxChecks) {
        clearInterval(checkInterval);
        console.warn('Douban2EXT: 豆瓣脚本等待超时，页面未加载出 #info 元素');
      }
    }, 100);
  }

  // ==========================================
  // 逻辑块 2：在 EXT 页面，注入跳转豆瓣按钮
  // ==========================================
  else if (url.indexOf('https://ext.to/') !== -1) {
    let extCheckCount = 0;
    const extMaxChecks = 50;

    const extCheckInterval = setInterval(() => {
      const copyBtn = document.querySelector('.copy-magnet-btn');

      if (copyBtn) {
        clearInterval(extCheckInterval);

        const doubanBtn = document.createElement('a');
        doubanBtn.href = "javascript:void(0);";

        doubanBtn.className = "btn btn-primary detail-download-link";

        doubanBtn.style.cssText = `
          background-color: rgb(240, 243, 245) !important;
          border-color: rgb(240, 243, 245) !important;
          margin-left: 5px;
        `;

        const doubanImg = document.createElement('img');
        doubanImg.src = "https://files.seeusercontent.com/2026/07/02/Y0om/2b76429.png";

        doubanImg.style.cssText = "height: 16px; width: auto; object-fit: contain; margin: 0; vertical-align: middle;";

        doubanBtn.appendChild(doubanImg);

        doubanBtn.addEventListener('mouseover', () => {
          doubanBtn.style.setProperty('background-color', 'rgb(220, 224, 227)', 'important');
          doubanBtn.style.setProperty('border-color', 'rgb(220, 224, 227)', 'important');
        });

        doubanBtn.addEventListener('mouseout', () => {
          doubanBtn.style.setProperty('background-color', 'rgb(240, 243, 255)', 'important');
          doubanBtn.style.setProperty('border-color', 'rgb(223, 227, 240)', 'important');
        });

        doubanBtn.addEventListener('click', () => {
          const imdbLinkExt = document.querySelector('.movie-info a[href*="imdb.com/title/tt"]');
          let searchQuery = '';

          if (imdbLinkExt) {
            const match = imdbLinkExt.href.match(/tt\d+/);
            if (match) searchQuery = match[0];
          }

          if (!searchQuery) {
            const h1 = document.querySelector('h1');
            searchQuery = h1 ? h1.textContent.trim() : document.title;
          }

          const doubanSearchUrl = `https://search.douban.com/movie/subject_search?search_text=${encodeURIComponent(searchQuery)}`;
          window.open(doubanSearchUrl, '_blank');
        });

        copyBtn.parentElement.appendChild(doubanBtn);
      }

      extCheckCount++;
      if (extCheckCount >= extMaxChecks) {
        clearInterval(extCheckInterval);
        console.warn('Douban2EXT: EXT脚本等待超时，未找到原有的按钮定位点');
      }
    }, 100);
  }

})();