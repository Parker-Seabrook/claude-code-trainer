# Getting started with Claude Code

Claude Code is an AI coding assistant that runs in your terminal (and in IDEs, a desktop app, and the web). It can read your project, edit files, run commands, and explain what it's doing — always within the permissions you allow.

## Starting a session

Open a terminal in your project folder and run:

```
claude
```

Claude Code starts an interactive session scoped to that folder. It can read files there and ask permission before it makes changes or runs commands.

## Running shell commands with `!`

Type `!` at the start of a prompt to run a shell command directly, without asking Claude to do it. The output lands in the conversation, so Claude can see it too.

```
! python --version
```

Use **one** `!` per line. If you type `!` and then paste a line that also starts with `!`, the shell receives `!python --version` and replies `command not found`.

## Slash commands

Prompts that start with `/` are commands for Claude Code itself, not requests to Claude:

| Command   | What it does                          |
|-----------|---------------------------------------|
| `/help`   | Lists available commands              |
| `/clear`  | Starts a fresh conversation           |
| `/config` | Opens settings such as theme and model |

## Plan mode

For anything bigger than a small fix, ask Claude to **plan first**. In plan mode Claude only reads and researches. It writes a plan for you to review and makes no edits until you approve it. Press **Shift+Tab** to cycle through permission modes, including plan mode.

A good workflow:

1. Describe what you want and your constraints.
2. Review the plan and ask for changes.
3. Approve it, then let Claude build.
4. Check the result, for example by running tests or opening the app.
