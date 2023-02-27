// ==UserScript==
// @name         Douban2Mivie
// @name:en      Douban2Mivie
// @namespace    https://chat.openai.com/
// @version      0.9.9
// @author       ChatGPT & ilovemonkey
// @description  在豆瓣电影详情页加入搜索按钮，可以直接跳转至Mivie搜索资源。Written by ChatGPT, modified by ilovemonkey.
// @description:en Add a search button above Douban's movie info, allowing users to search for related resources on Mivie. Written by ChatGPT, modified by ilovemonkey.
// @match        https://movie.douban.com/subject/*
// @license      MIT
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  const cleanedTitle = document.title.replace(/\s*\(\s*豆瓣\s*\)\s*$/, '');
  const h1 = document.querySelector('h1');
  const match = h1 ? h1.textContent.match(/\((\d+)\)/) : null;
  const num = match ? match[1] : '';

  const searchUrl = `https://mivie.io/search?q=${cleanedTitle}%20y%3A${num}`;

  const button = document.createElement('button');
  button.style.width = '120px';
  button.style.height = '22px';
  button.style.left = '20px';
  button.style.top = '20px';
  button.style.background = 'linear-gradient(265.04deg, #2B2538 0.83%, #213552 99.5%)';
  button.style.boxShadow = '0px 1px 1px rgba(0, 0, 0, 0.5)';
  button.style.borderRadius = '4px';
  button.style.color = 'white';
  button.style.fontWeight = 'normal';
  button.style.textAlign = 'center';
  button.style.display = 'flex';
  button.style.alignItems = 'center';
  button.style.justifyContent = 'center';
  button.style.cursor = 'pointer'

  const searchInText = document.createTextNode('Search in\u00a0');
  const mivieText = document.createElement('span');
  mivieText.style.fontWeight = 'bold';
  mivieText.textContent = 'Mivie';
  button.appendChild(searchInText);
  button.appendChild(mivieText);

  let timeoutId;

  button.addEventListener('mouseover', () => {
    clearTimeout(timeoutId);
      button.style.transform = 'translateY(-3px)';
      button.style.boxShadow = '0px 3px 3px rgba(0, 0, 0, 0.25)';
      button.style.transition = 'transform 0.2s ease';
  });

  button.addEventListener('mouseout', () => {
    clearTimeout(timeoutId);
    button.style.transform = 'none';
    button.style.boxShadow = '0px 1px 1px rgba(0, 0, 0, 0.5)';
    button.style.transition = 'transform 0.2s ease';
  });

  button.addEventListener('click', () => {
    window.open(searchUrl, '_blank');
  });

  const info = document.getElementById('info');
  info.insertBefore(button, info.firstElementChild);
})();