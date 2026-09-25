# Permission modes

Say you ask Claude to rename a function across ten files. In one mode Claude stops before each edit and asks "Allow this change?" In another it makes all ten edits and tells you when it's done. The difference is the **permission mode**: a setting that decides which actions Claude can take on its own and which need your approval first.

## The four modes

| Mode | What Claude does without asking | What still needs your approval |
|------|---------------------------------|--------------------------------|
| **Manual** | Reads files | Every file edit and every shell command (a command run in your terminal) |
| **Edit automatically** | Reads and edits files in your project, and runs basic file-housekeeping commands such as `mkdir`, `mv`, `cp` and `rm` | Other shell commands |
| **Plan** | Reads and researches, then writes a plan | Everything else. It makes no changes until you approve the plan |
| **Auto** | Most actions, including edits and commands | Actions a background safety check flags as risky, which it blocks |

Manual is the most careful mode and a good place to start in a project you don't know well. Auto is the most hands-off: Claude keeps working without stopping for approvals, but you can still press **Esc** at any time to interrupt it.

## Cycling with Shift+Tab

Press **Shift+Tab** in the prompt box to switch to the next mode. Each press moves one step along the cycle, and the current mode is shown just below the prompt box. Keep pressing to get back to where you started.

You can switch at any point in a session, even between two prompts about the same task. The new mode applies to what Claude does next.

A common mistake is forgetting which mode you're in. If Claude edits files you expected it to ask about, or stops to ask when you expected it to just work, check the mode shown under the prompt box before anything else.

If Auto doesn't appear when you cycle, it may not be available on your account or may be turned off in your settings.

## Choosing a mode

1. Start in **Plan** for any change bigger than a small fix, so you can review the approach first.
2. When you approve the plan, switch to **Edit automatically** if you trust the plan and want to review the finished diff (a view of every line added, changed or removed) rather than each edit.
3. Use **Manual** when you want to see every change and command as it happens.
4. Use **Auto** for longer tasks where stopping for approval would slow you down, and check the result when it finishes.

## Try it

1. Open a terminal in a practice project and run `claude`.
2. Press **Shift+Tab** a few times and watch the mode name below the prompt box change.
3. Switch to Plan and ask: "How would you add a README to this project?" Notice that Claude only reads files.
4. Switch to Manual and ask Claude to create the README. Approve or reject the edit when it asks.

## Three things to remember

- The permission mode decides what Claude can do without asking you first.
- **Shift+Tab** cycles through the modes, and the current one is shown under the prompt box.
- Plan changes nothing until you approve, Manual asks about every edit and command, and Edit automatically and Auto ask less.
