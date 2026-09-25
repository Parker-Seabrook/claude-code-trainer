# Claude Code Trainer

A small static site for learning Claude Code: Markdown lessons, a quiz per lesson, and progress saved in your browser. Plain HTML, CSS, and JavaScript, with no build step, so it can be hosted on GitHub Pages.

## Run it locally

The pages load lesson files with `fetch()`, which browsers block for `file://` pages, so serve the folder:

```
python -m http.server 8000
```

Then open http://localhost:8000.

## Add a lesson

1. Write `content/lessons/<id>.md`, for example `02-permissions.md`.
2. Write `content/quizzes/<id>.json`:

   ```json
   {
     "lesson": "<id>",
     "questions": [
       {
         "question": "…",
         "options": ["…", "…", "…"],
         "answer": "the exact text of the correct option",
         "explanation": "optional, shown after checking"
       }
     ]
   }
   ```

3. Add `{ "id": "<id>", "title": "…", "summary": "…" }` to `content/lessons.json`. The order of this list is the order on the home page.
4. Run the validator:

   ```
   python tools/validate_content.py
   ```

   It checks that each lesson has a quiz and each quiz has a lesson, that every quiz is well formed and every answer is one of its options, and that `lessons.json` matches the files. It exits with code 1 if anything is wrong.

## Progress

Completion is stored in `localStorage` under `cctrainer.progress.v1`. It lives only in the browser you use. **Reset progress** on the home page clears it.

## Deploy to GitHub Pages

Push the repo, then in **Settings → Pages** choose **Deploy from a branch**, pick `main` and `/ (root)`. The `.nojekyll` file stops GitHub from processing the files with Jekyll. All paths are relative, so the site works at `https://<user>.github.io/<repo>/`.

## Notes

- Markdown is rendered with [marked](https://marked.js.org/) 18.0.14 from jsDelivr.
- Lesson HTML is not sanitized because the lessons are your own files. If lessons ever come from other people, add [DOMPurify](https://github.com/cure53/DOMPurify) and wrap `marked.parse(...)` with `DOMPurify.sanitize(...)`.
