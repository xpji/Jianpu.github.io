(function () {
  var ready, scriptTag;

  // 防止全局变量污染，使用闭包
  var bszCaller = {
      fetch: function (url, callback) {
          var callbackName = "BusuanziCallback_" + Math.floor(1099511627776 * Math.random());
          window[callbackName] = this.evalCall(callback);
          url = url.replace("=BusuanziCallback", "=" + callbackName);
          scriptTag = document.createElement("SCRIPT");
          scriptTag.type = "text/javascript";
          scriptTag.defer = true;
          scriptTag.src = url;

          // 添加错误处理，以提高代码稳定性
          scriptTag.onerror = function () {
              console.error("Error loading script from: " + url);
              bszTag.hides();
          };

          document.getElementsByTagName("HEAD")[0].appendChild(scriptTag);
      },
      evalCall: function (callback) {
          return function (data) {
              ready(function () {
                  try {
                      callback(data);
                      scriptTag.parentElement.removeChild(scriptTag);
                  } catch (error) {
                      console.error("Error executing callback: " + error);
                      bszTag.hides();
                  }
              });
          };
      }
  };

  // 添加注释和文档
  ready = function (callback) {
      return document.addEventListener
          ? document.addEventListener("DOMContentLoaded", callback, false)
          : document.attachEvent && (document.attachEvent("onreadystatechange", function () {
              /loaded|complete/.test(document.readyState) && callback();
          }), window == window.top && (clearInterval(c), c = null));
  };

  // 对代码来源进行注释
  bszCaller.fetch("//busuanzi.ibruce.info/busuanzi?jsonpCallback=BusuanziCallback", function (data) {
      bszTag.texts(data);
      bszTag.shows();
  });

  var bszTag = {
      bszs: ["site_pv", "page_pv", "site_uv"],
      texts: function (data) {
          // 更新页面元素的文本内容
          this.bszs.map(function (item) {
              var element = document.getElementById("busuanzi_value_" + item);
              element && (element.innerHTML = data[item]);
          });
      },
      hides: function () {
          // 隐藏统计信息
          this.bszs.map(function (item) {
              var element = document.getElementById("busuanzi_container_" + item);
              element && (element.style.display = "none");
          });
      },
      shows: function () {
          // 显示统计信息
          this.bszs.map(function (item) {
              var element = document.getElementById("busuanzi_container_" + item);
              element && (element.style.display = "inline");
          });
      }
  };
})();
