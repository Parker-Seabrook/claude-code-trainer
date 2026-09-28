# The context window

Suppose you ask Claude to read five large files, run the test suite twice, and then fix a bug. Everything from that work, including every file's contents and every line of test output, is now in the conversation Claude is working from. That working space is the **context window**: the text Claude can see at once. It has a fixed size, and a long session can fill it.

## What fills it

Each of these takes up space in the context window:

- Your prompts and Claude's replies
- Files Claude reads, in full
- Output from commands, including anything you run with `!`
- Your `CLAUDE.md` files, which are instructions Claude Code loads at the start of every session
- Tool definitions, such as those from connected MCP servers (add-ons that give Claude extra tools)

The rule: anything Claude sees stays in the window until the conversation is cleared or compacted. A common mistake is pasting a huge log or asking Claude to read a whole folder "just in case". It works, but it uses space you may need later.

## Checking and freeing space

Run `/context` to see how full the window is. It shows a breakdown by category, such as system instructions, tools, memory files and messages, so you can see what is taking up the room.

`/compact` replaces the conversation so far with a summary. Claude keeps the gist, such as decisions made, files changed and what's left to do, and drops the details, such as old file contents and test output. You can tell it what to keep:

```
/compact keep the list of failing tests and the fix we agreed on
```

When the window gets close to full, Claude Code compacts automatically. Use `/compact` yourself when you're at a natural break in a task. Use `/clear` instead when you're starting something unrelated: it throws the conversation away rather than summarizing it.

## Why CLAUDE.md survives compaction

Say that early in a session you typed "always use tabs in this project". After a compaction, that sentence exists only as part of a summary, and details can get lost. Now say the same rule is in `CLAUDE.md`. Claude Code reads that file from disk and loads it fresh after compaction, so the rule comes back word for word.

The rule: a summary can lose instructions you typed into the chat, but `CLAUDE.md` is reloaded from disk. If an instruction must hold for the whole project, put it in `CLAUDE.md`, not in a chat message.

## Try it

1. Start a session in a project with `claude`.
2. Run `/context` and note how much space is already used before you've typed anything.
3. Ask Claude to read two or three files, then run `/context` again and compare.
4. Run `/compact keep a one-line summary of each file`, then run `/context` a third time.
5. Ask Claude about something in your `CLAUDE.md`, and check that it still knows.

## Three things to remember

- Everything Claude reads or runs takes up space in the context window, so check with `/context`.
- `/compact` summarizes the conversation to free space, and `/clear` starts over.
- Put rules that must last in `CLAUDE.md`, because it is reloaded after compaction and chat messages are only summarized.
