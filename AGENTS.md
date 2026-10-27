# Project conventions

- Use the shared DryerControlConsole on the dedicated drying controls page only; keep session state and device callbacks in their existing hooks so visual updates cannot change session behavior.
- Scope control-console design tokens locally to preserve the public website and other dashboard screens.