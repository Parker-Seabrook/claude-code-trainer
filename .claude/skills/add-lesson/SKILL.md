---
description: Add a new lesson and quiz to Claude Code Trainer. Use when asked to add, create, or write a lesson.
argument-hint: [lesson-id] [topic]
disable-model-invocation: true
---

Add a lesson with id `$0` about: $1

1. Use the Read tool, never cat or any shell command, to open content/lessons/01-getting-started.md and content/quizzes/01-getting-started.json. Reading them this way loads the lesson conventions and the quiz rules. Follow both.
2. Write content/lessons/$0.md following the lesson conventions.
3. Write content/quizzes/$0.json following the quiz rules. Every answer must match its option text exactly.
4. Add an entry for $0 to content/lessons.json, in numbered order, with a one-sentence summary.
5. Run python tools/validate_content.py. If it reports problems, fix them and run it again until it exits 0.
6. Report the lesson's word count and paste the validator output. Do not commit.
