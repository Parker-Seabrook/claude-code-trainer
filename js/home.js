// Home page: list lessons from the manifest and show which are complete.
(function () {
  var list = document.getElementById("lesson-list");
  var summary = document.getElementById("summary");
  var errorBox = document.getElementById("error");
  var lessons = [];

  function render() {
    list.textContent = "";
    var done = 0;

    lessons.forEach(function (lesson) {
      var complete = Progress.isComplete(lesson.id);
      if (complete) done++;

      var item = document.createElement("li");
      item.className = "lesson-item" + (complete ? " complete" : "");

      var link = document.createElement("a");
      link.href = "lesson.html?id=" + encodeURIComponent(lesson.id);
      link.textContent = lesson.title;

      var status = document.createElement("span");
      status.className = "status";
      status.textContent = complete ? "✓ Completed" : "Not started";

      item.appendChild(link);
      item.appendChild(status);
      if (lesson.summary) {
        var desc = document.createElement("p");
        desc.className = "muted";
        desc.textContent = lesson.summary;
        item.appendChild(desc);
      }
      list.appendChild(item);
    });

    summary.textContent = done + " of " + lessons.length + " completed";
  }

  document.getElementById("reset").addEventListener("click", function () {
    if (confirm("Clear all lesson progress?")) {
      Progress.reset();
      render();
    }
  });

  fetchContent("content/lessons.json", true)
    .then(function (data) {
      lessons = data;
      render();
    })
    .catch(function (err) {
      summary.textContent = "";
      errorBox.hidden = false;
      errorBox.textContent = err.message +
        ". If you opened this file directly, serve the folder instead: python -m http.server";
    });
})();
