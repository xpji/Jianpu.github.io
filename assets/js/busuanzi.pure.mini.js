// busuanzi.js
var bszCaller = {
  fetch: function (a, b) {
    var c = "BusuanziCallback_" + Math.floor(1099511627776 * Math.random());
    window[c] = this.evalCall(b);
    a = a.replace("=BusuanziCallback", "=" + c);
    scriptTag = document.createElement("SCRIPT");
    scriptTag.type = "text/javascript";
    scriptTag.defer = !0;
    scriptTag.src = a;
    document.getElementsByTagName("HEAD")[0].appendChild(scriptTag);
  },
  evalCall: function (a) {
    return function (b) {
      ready(function () {
        try {
          a(b);
          scriptTag.parentElement.removeChild(scriptTag);
        } catch (c) {
          bszTag.hides();
        }
      });
    };
  },
};

bszCaller.fetch("//busuanzi.ibruce.info/busuanzi?jsonpCallback=BusuanziCallback", function (a) {
  document.getElementById("busuanzi_value_site_pv").innerText = a.site_pv;
});
