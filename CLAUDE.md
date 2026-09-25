# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Claude Code Trainer: a static site (plain HTML, CSS and JavaScript) of Markdown lessons, each with a multiple-choice quiz, and progress saved in the browser. It is hosted on GitHub Pages from `main`, served from the repository root, at https://parker-seabrook.github.io/claude-code-trainer/.

**Hard constraints:** no build step, no Node, no npm. Don't add a bundler, a `package.json` or ES-module tooling. The only external runtime dependency is marked.js from jsDelivr, pinned in `lesson.html`. Version 18 has no root `marked.min.js`, so the script loads `lib/marked.umd.js`, which provides a global `marked`.

## Commands

```
python tools/validate_content.py   # content checks; exits 1 and lists every problem
python -m http.server 8000         # serve locally, then open http://localhost:8000
```

There is no test suite or linter. The validator plus a manual check in the browser are the verification. Pages must be served over HTTP: `fetch()` fails on `file://`. Python's standard library is the only tooling available, so keep `validate_content.py` free of third-party packages.

## Architecture

**Content is data, and `content/lessons.json` is the index.** A static host can't list a directory, so the browser only knows about lessons listed in that file. Its order sets the home-page order and the previous/next links. A lesson's `id` is the file stem shared by three things, which must stay in sync:
- `content/lessons.json`: an entry `{ "id", "title", "summary" }`
- `content/lessons/<id>.md`
- `content/quizzes/<id>.json`: `{ "lesson": "<id>", "questions": [{ "question", "options", "answer", "explanation"? }] }`

`answer` is the **exact text** of the correct option, not an index. Scoring in `js/lesson.js` compares option strings, and the validator checks that `answer` is one of `options`, so editing an option's wording means updating `answer` to match. After any content change, run the validator. It checks all three pieces against each other in both directions.

**Pages and scripts.** Plain `<script>` tags with no modules. Each HTML page loads `js/progress.js` first, then its page script, which is wrapped in an immediately invoked function.
- `js/progress.js` defines the global `Progress` object. It is the **only** code that touches `localStorage` (key `cctrainer.progress.v1`, value `{ "completed": { "<id>": "<ISO date>" } }`), and every access is wrapped in try/catch. It also defines the global `fetchContent(path, asJson)`, which throws on HTTP errors. Both pages use it.
- `index.html` and `js/home.js` show the lesson list, completion marks, the "N of M completed" line and the reset button.
- `lesson.html?id=<id>` and `js/lesson.js`: the id is checked against the manifest **before** any lesson file is fetched, and unknown or missing ids show an error. The script then renders the Markdown with `marked.parse` and builds the quiz. A lesson is marked complete only when every answer is correct.

**Conventions that matter for GitHub Pages:** all paths are relative (`content/...`, never `/content/...`), because the site lives under `/claude-code-trainer/`. `.nojekyll` must stay. Quiz and list text is built with `textContent` and DOM calls. Lesson Markdown goes in via `innerHTML` without sanitizing, because lessons are author-written. If lessons ever come from other people, add DOMPurify, as the README notes.
