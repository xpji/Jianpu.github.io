// update_views.js
document.addEventListener("DOMContentLoaded", function() {
    var postId = "{{ page.id }}"; // use a unique identifier for each post, e.g., post title or ID
    var views = localStorage.getItem("views_" + postId);
  
    if (!views) {
      views = 0;
      localStorage.setItem("views_" + postId, views);
    }
  
    document.getElementById("views-count").innerText = views;
  });
  