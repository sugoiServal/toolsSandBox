# find network password
```bash
Netsh wlan show profile name=<Wi-Fi-name> key=clear
# refer to: Security settings --> Key Content
```


# add exe to run as service on start up
> [6,8 in this article](https://www.makeuseof.com/windows-11-open-windows-terminal/#:~:text=Press%20the%20Ctrl%20%2B%20Alt%20%2B%20W%20hotkey%20to%20open%20Windows%20Terminal.)
- win + R: shell:startup => open Startup folder
- cp "shortcut_to_the_exe" "Startup"
- xxx-Shortcut => \<right-click> => properties => Shortcut => Run:Minimized
- set Keyboard shortcut to call Up:
  -  (some app offer toogle window shortcut in setting)
  -  or: xxx-Shortcut => \<right-click> => properties => Shortcut => Shortcut key: