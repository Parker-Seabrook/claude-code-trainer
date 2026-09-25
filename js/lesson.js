// Lesson page: render the lesson Markdown, run its quiz, and record completion.
(function () {
  var id = new URLSearchParams(location.search).get("id");
  var errorBox = document.getElementById("error");
  var article = document.getElementById("lesson");
  var quizSection = document.getElementById("quiz-section");
  var quizStatus = document.getElementById("quiz-status");
  var form = document.getElementById("quiz");
  var result = document.getElementById("result");
  var pager = document.getElementById("pager");

  function showError(message) {
    errorBox.hidden = false;
    errorBox.textContent = message;
  }

  function updateStatus() {
    var date = Progress.completedOn(id);
    quizStatus.textContent = date
      ? "✓ Completed on " + new Date(date).toLocaleDateString() + ". You can retake the quiz any time."
      : "Answer every question correctly to complete this lesson.";
  }

  function renderPager(lessons, index) {
    [index - 1, index + 1].forEach(function (i) {
      var other = lessons[i];
      if (!other) return;
      var link = document.createElement("a");
      link.href = "lesson.html?id=" + encodeURIComponent(other.id);
      link.textContent = i < index ? "← " + other.title : other.title + " →";
      link.className = i < index ? "prev" : "next";
      pager.appendChild(link);
    });
  }

  function renderQuiz(quiz) {
    quiz.questions.forEach(function (q, qi) {
      var fieldset = document.createElement("fieldset");
      fieldset.className = "question";

      var legend = document.createElement("legend");
      legend.textContent = (qi + 1) + ". " + q.question;
      fieldset.appendChild(legend);

      q.options.forEach(function (option) {
        var label = document.createElement("label");
        var input = document.createElement("input");
        input.type = "radio";
        input.name = "q" + qi;
        input.value = option;
        label.appendChild(input);
        label.appendChild(document.createTextNode(" " + option));
        fieldset.appendChild(label);
      });

      var feedback = document.createElement("p");
      feedback.className = "feedback";
      feedback.hidden = true;
      fieldset.appendChild(feedback);

      form.appendChild(fieldset);
    });

    var submit = document.createElement("button");
    submit.type = "submit";
    submit.className = "button";
    submit.textContent = "Check answers";
    form.appendChild(submit);

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var correct = 0;

      quiz.questions.forEach(function (q, qi) {
        var chosen = form.querySelector('input[name="q' + qi + '"]:checked');
        var fieldset = form.children[qi];
        var feedback = fieldset.querySelector(".feedback");
        var right = chosen !== null && chosen.value === q.answer;
        if (right) correct++;

        fieldset.classList.toggle("right", right);
        fieldset.classList.toggle("wrong", !right);
        feedback.hidden = false;
        feedback.textContent = (right ? "Correct. " : chosen ? "Not quite. " : "No answer chosen. ") +
          (q.explanation || "");
      });

      var total = quiz.questions.length;
      result.hidden = false;
      if (correct === total) {
        Progress.markComplete(id);
        result.className = "result pass";
        result.textContent = "All " + total + " correct. Lesson complete!";
      } else {
        result.className = "result fail";
        result.textContent = correct + " of " + total + " correct. Review the lesson and try again.";
      }
      updateStatus();
    });

    quizSection.hidden = false;
    updateStatus();
  }

  fetchContent("content/lessons.json", true)
    .then(function (lessons) {
      var index = lessons.findIndex(function (l) { return l.id === id; });
      if (index === -1) {
        throw new Error(id ? 'There is no lesson called "' + id + '".' : "No lesson was chosen.");
      }
      document.title = lessons[index].title + " · Claude Code Trainer";
      renderPager(lessons, index);

      return Promise.all([
        fetchContent("content/lessons/" + id + ".md", false),
        fetchContent("content/quizzes/" + id + ".json", true)
      ]);
    })
    .then(function (parts) {
      // Lesson Markdown is trusted, author-written content, so it isn't sanitized.
      article.innerHTML = marked.parse(parts[0]);
      renderQuiz(parts[1]);
    })
    .catch(function (err) {
      showError(err.message);
    });
})();
