# Permission modes

Say you ask Claude to rename a function across ten files. In one mode Claude stops before each edit and asks "Allow this change?" In another it makes all ten edits and tells you when it's done. The difference is the **permission mode**: a setting that decides which actions Claude can take on its own and which need your approval first.

## The four modes

| Mode | What Claude does without asking | What still needs your approval |
|------|---------------------------------|--------------------------------|
| **Manual** | Reads files and runs read-only shell commands (commands run in your terminal) | Every file edit and every other command |
| **Edit automatically** | Reads and edits files in your project, and runs basic file commands such as `mkdir`, `mv`, `cp` and `rm` there | Other shell commands |
| **Plan** | Reads and explores, then writes a plan | Every file edit, which stays blocked until you approve the plan |
| **Auto** | Most actions, including edits and commands | Nothing routine: a background safety check blocks risky actions instead of asking you |

Manual is the most careful mode and a good place to start in a project you don't know well. Auto is the most hands-off, and recent versions of Claude Code start new sessions in it when it's available. You can still press **Esc** at any time to interrupt Claude.

In the terminal, Edit automatically is labelled `accept edits on`.

## Cycling with Shift+Tab

Press **Shift+Tab** in the prompt box to switch to the next mode. The cycle runs Manual, Edit automatically, Plan, then Auto if it's available, and the current mode is shown just below the prompt box. A fifth mode, Bypass permissions, appears only if you start Claude Code with a special flag.

You can switch at any point in a session, even between two prompts about the same task. The new mode applies to what Claude does next.

A common mistake is forgetting which mode you're in. If Claude edits without asking when you expected a prompt, or the reverse, check the mode under the prompt box first.

If Auto doesn't appear when you cycle, your model may not support it, or a setting, possibly one your organization manages, may turn it off.

## Choosing a mode

1. Start in **Plan** for any change bigger than a small fix, so you can review the approach first.
2. Approving the plan switches the mode for you: pick **Yes, manually approve edits** to review each edit, or the other Yes option to review the finished diff (a view of every line added, changed or removed) instead.
3. Use **Manual** when you want to see every change and command as it happens.
4. Use **Auto** for longer tasks where stopping for approval would slow you down, and check the result when it finishes.

## Try it

1. Open a terminal in a practice project and run `claude`.
2. Press **Shift+Tab** a few times and watch the mode name below the prompt box change.
3. Switch to Plan and ask: "How would you add a README to this project?" Notice that Claude explores but doesn't edit anything.
4. Switch to Manual and ask Claude to create the README. Approve or reject the edit when it asks.

## Three things to remember

- The permission mode decides what Claude can do without asking you first.
- **Shift+Tab** cycles through the modes, and the current one is shown under the prompt box.
- Plan edits nothing until you approve, Manual asks about every edit and most commands, and Edit automatically and Auto ask less.
