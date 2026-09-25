"""Check that lessons, quizzes, and the lesson manifest are consistent.

Run from the repo root:  python tools/validate_content.py
Exits 0 when everything is valid, 1 when any problem is found.
"""

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONTENT = ROOT / "content"
LESSONS_DIR = CONTENT / "lessons"
QUIZZES_DIR = CONTENT / "quizzes"
MANIFEST = CONTENT / "lessons.json"


def rel(path):
    return path.relative_to(ROOT).as_posix()


def load_json(path, errors):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        errors.append(f"{rel(path)}: cannot read JSON ({exc})")
        return None


def check_pairs(lesson_ids, quiz_ids, errors):
    for lesson_id in sorted(lesson_ids - quiz_ids):
        errors.append(f"{rel(LESSONS_DIR / (lesson_id + '.md'))}: no matching quiz "
                      f"{rel(QUIZZES_DIR / (lesson_id + '.json'))}")
    for quiz_id in sorted(quiz_ids - lesson_ids):
        errors.append(f"{rel(QUIZZES_DIR / (quiz_id + '.json'))}: no matching lesson "
                      f"{rel(LESSONS_DIR / (quiz_id + '.md'))}")


def check_quiz(path, errors):
    quiz = load_json(path, errors)
    if quiz is None:
        return 0
    where = rel(path)
    if not isinstance(quiz, dict):
        errors.append(f"{where}: top level must be an object")
        return 0

    if quiz.get("lesson") != path.stem:
        errors.append(f"{where}: \"lesson\" is {quiz.get('lesson')!r}, expected {path.stem!r}")

    questions = quiz.get("questions")
    if not isinstance(questions, list) or not questions:
        errors.append(f"{where}: \"questions\" must be a non-empty list")
        return 0

    for n, q in enumerate(questions, start=1):
        label = f"{where}: question {n}"
        if not isinstance(q, dict):
            errors.append(f"{label}: must be an object")
            continue
        text = q.get("question")
        if not isinstance(text, str) or not text.strip():
            errors.append(f"{label}: \"question\" must be a non-empty string")
        options = q.get("options")
        if (not isinstance(options, list) or len(options) < 2
                or not all(isinstance(o, str) and o.strip() for o in options)):
            errors.append(f"{label}: \"options\" must be a list of at least 2 non-empty strings")
            options = None
        elif len(set(options)) != len(options):
            errors.append(f"{label}: \"options\" contains duplicates")
        answer = q.get("answer")
        if not isinstance(answer, str):
            errors.append(f"{label}: \"answer\" must be a string")
        elif options is not None and answer not in options:
            errors.append(f"{label}: answer {answer!r} is not one of the options")
    return len(questions)


def check_manifest(lesson_ids, quiz_ids, errors):
    manifest = load_json(MANIFEST, errors)
    if manifest is None:
        return 0
    where = rel(MANIFEST)
    if not isinstance(manifest, list):
        errors.append(f"{where}: top level must be a list")
        return 0

    seen = set()
    for n, entry in enumerate(manifest, start=1):
        if not isinstance(entry, dict):
            errors.append(f"{where}: entry {n} must be an object")
            continue
        entry_id = entry.get("id")
        if not isinstance(entry_id, str) or not entry_id:
            errors.append(f"{where}: entry {n} needs a non-empty \"id\"")
            continue
        if not isinstance(entry.get("title"), str) or not entry["title"].strip():
            errors.append(f"{where}: {entry_id!r} needs a non-empty \"title\"")
        if entry_id in seen:
            errors.append(f"{where}: duplicate id {entry_id!r}")
        seen.add(entry_id)
        if entry_id not in lesson_ids:
            errors.append(f"{where}: {entry_id!r} has no lesson file")
        if entry_id not in quiz_ids:
            errors.append(f"{where}: {entry_id!r} has no quiz file")

    for lesson_id in sorted(lesson_ids - seen):
        errors.append(f"{where}: lesson {lesson_id!r} is missing from the manifest")
    return len(manifest)


def main():
    errors = []
    lesson_ids = {p.stem for p in LESSONS_DIR.glob("*.md")}
    quiz_paths = sorted(QUIZZES_DIR.glob("*.json"))
    quiz_ids = {p.stem for p in quiz_paths}

    check_pairs(lesson_ids, quiz_ids, errors)
    question_count = sum(check_quiz(p, errors) for p in quiz_paths)
    manifest_count = check_manifest(lesson_ids, quiz_ids, errors)

    if errors:
        print(f"Found {len(errors)} problem(s):")
        for error in errors:
            print(f"  - {error}")
        return 1

    print(f"OK: {len(lesson_ids)} lesson(s), {len(quiz_paths)} quiz(zes), "
          f"{question_count} question(s), {manifest_count} manifest entr(ies).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
