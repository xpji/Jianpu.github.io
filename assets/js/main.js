// main.js

document.addEventListener("DOMContentLoaded", function() {
    // 初始化 highlight.js
    hljs.initHighlightingOnLoad();
  
    // 初始化 clipboard.js
    var clipboard = new ClipboardJS(".btn-copy");
    clipboard.on("success", function(e) {
      e.clearSelection();
    });
  });
  