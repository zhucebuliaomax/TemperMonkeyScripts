// ==UserScript==
// @name           Douban2Mivie
// @name:en        Douban2Mivie
// @namespace      https://chat.openai.com/
// @version        0.9.10
// @author         ChatGPT & ilovemonkey
// @description    在豆瓣电影详情页加入搜索按钮，可以直接跳转至Mivie搜索资源。Written by ChatGPT, modified by ilovemonkey.
// @description:en Add a search button above Douban's movie info, allowing users to search for related resources on Mivie. Written by ChatGPT, modified by ilovemonkey.
// @match          https://movie.douban.com/subject/*
// @match          https://m.douban.com/movie/subject/*
// @license        MIT
// @grant          none
// ==/UserScript==

(function() {
  'use strict';

  const cleanedTitle = document.title.replace(/\s*\(\s*豆瓣\s*\)\s*$/, '');
  const h1 = document.querySelector('h1');
  const num = h1?.textContent.match(/\((\d+)\)/)?.[1] || '';

  const searchUrl = `https://mivie.io/search?q=${cleanedTitle}%20y%3A${num}`;

  const button = document.createElement('button');
  button.style.cssText = `
    width: 120px;
    height: 22px;
    left: 20px;
    top: 20px;
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
  const mivieText = document.createElement('span');
    mivieText.style.cssText = 'background-image: url(https://framerusercontent.com/images/kp45FttH7EwX4Y1bwjSWn5f7Ws4.gif);' +
    'background-size: 100%;' +
    'background-repeat: no-repeat;' +
    'background-position: 50% 50%;' +
    'background-clip: text;' +
    '-webkit-background-clip: text;' +
    '-webkit-text-fill-color: transparent;' +
    'text-fill-color: transparent;' +
    'color: rgb(136, 136, 136);' +
    'font-weight: bold;';
    mivieText.textContent = 'Mivie';
  button.append(searchInText, mivieText);

  let timeoutId;

  const mouseOverHandler = () => {
    clearTimeout(timeoutId);
    button.style.transform = 'translateY(-3px)';
    button.style.boxShadow = '0px 3px 3px rgba(0, 0, 0, 0.25)';
    button.style.transition = 'transform 0.2s ease';
  };

  const mouseOutHandler = () => {
    clearTimeout(timeoutId);
    button.style.transform = 'none';
    button.style.boxShadow = '0px 1px 1px rgba(0, 0, 0, 0.5)';
    button.style.transition = 'transform 0.2s ease';
  };

  button.addEventListener('mouseover', mouseOverHandler);
  button.addEventListener('mouseout', mouseOutHandler);
  button.addEventListener('click', () => window.open(searchUrl, '_blank'));

  const info = document.getElementById('info');
  const subMeta = document.querySelector('.sub-meta');

  if (info) {
    info.insertBefore(button, info.firstElementChild);
  }
  // 如果没有 id="info" 的元素，则添加到 class="sub-meta" 的元素的后面
  else if (subMeta) {
    subMeta.parentNode.insertBefore(button, subMeta.nextSibling);
  }
})();