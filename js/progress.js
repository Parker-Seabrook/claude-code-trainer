// Lesson completion, stored in localStorage. This is the only file that touches storage.
// Format: { "completed": { "<lesson id>": "<ISO date>" } }
var Progress = (function () {
  var KEY = "cctrainer.progress.v1";

  function load() {
    try {
      var data = JSON.parse(localStorage.getItem(KEY));
      if (data && typeof data.completed === "object" && data.completed !== null) {
        return data;
      }
    } catch (e) {
      // Corrupt data or blocked storage: fall through to empty progress.
    }
    return { completed: {} };
  }

  function save(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch (e) {
      // Storage unavailable (private window, blocked site data); progress won't persist.
    }
  }

  return {
    isComplete: function (id) {
      return Object.prototype.hasOwnProperty.call(load().completed, id);
    },
    completedOn: function (id) {
      return load().completed[id] || null;
    },
    markComplete: function (id) {
      var data = load();
      data.completed[id] = new Date().toISOString();
      save(data);
    },
    reset: function () {
      try {
        localStorage.removeItem(KEY);
      } catch (e) {
        // Nothing to clear if storage is unavailable.
      }
    }
  };
})();

// Shared helper: fetch JSON or text and fail loudly on HTTP errors.
function fetchContent(path, asJson) {
  return fetch(path).then(function (res) {
    if (!res.ok) {
      throw new Error("Could not load " + path + " (HTTP " + res.status + ")");
    }
    return asJson ? res.json() : res.text();
  });
}
