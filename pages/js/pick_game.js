document.addEventListener("DOMContentLoaded", function () {
    const gamePages = ["trace", "moving_target", "fruit_catch"];
    const randomIndex = Math.floor(Math.random() * gamePages.length);
    const pageUrl = gamePages[randomIndex];
  
    window.location.href = pageUrl;
  });
  