// realtime_views.js

function updateRealTimeViews() {
  var postId = "{{ page.id }}"; // 使用文章的唯一标识符
  $.ajax({
    url: "/api/get_real_time_views?post_id=" + postId, // 替换为你的实时浏览量 API
    method: "GET",
    dataType: "json",
    success: function(data) {
      var realTimeViews = data.views || 0;
      $("#real-time-views").text(realTimeViews + " 次");
    },
    error: function() {
      $("#real-time-views").text("无法获取实时访问量");
    }
  });
}

// 初始加载实时访问量
$(document).ready(function() {
  updateRealTimeViews();
  
  // 每隔一段时间更新实时访问量（例如，每30秒更新一次）
  setInterval(updateRealTimeViews, 30000);
});
