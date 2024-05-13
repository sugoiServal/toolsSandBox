```bash
# install
tar -xzvf ideaIC-2024.1.1.tar.gz
sudo mv idea-IC-241.15989.150 /opt/
#.bashrc
alias idea='/opt/idea-IC-241.15989.150/bin/idea.sh'
alias ideacd='pwd | xargs /opt/idea-IC-241.15989.150/bin/idea.sh'
echo "alias idea='/opt/idea-IC-241.15989.150/bin/idea.sh'
alias ideacd='pwd | xargs /opt/idea-IC-241.15989.150/bin/idea.sh'" >> .bashrc
source .bashrc
```

```bash
# setting sync
sudo apt update
sudo apt install firefox
  # search browser, set path to the default: /usr/bin/firefox
  # then login in browser and do setting sync
```

- most used shortcuts: https://www.youtube.com/watch?v=QYO5_riePOQ
- debugger: https://www.youtube.com/watch?v=lAWnIP1S6UA

# visibility/Navigate
shift-esc: setting
alt-1: sidebar open/close
ctrl-`: terminal
alt-left/right: split/unsplit
` ctrl-shift-``,  shift-alt- ` : collapse all/ expand all
`ctrl-j/k`: arrow up/down alternative in pop-up

# Edit
`alt-enter`- quick fix
alt-a: comment out
ctrl-shift-v: paste
shift-v: paste from history
ctrl-d : add selection to next find match
- multi-line
  - ctrl-click: add cursor
  - ctrl-alt-up/down: vertical cursor
# search
ctrl-shift-f: search in project
- search

  - `ctrl-f`, `ctrl-shift-f`: search in file + replace/ search in scope
  - `shift *2`: search everything ❓

# TO Be Checked
alt-click: go to difinition
`F2`: jump to next warning/error line
- `ctrl-w`, `ctrl-shift-w`: expand/shrink selection
- `ctrl-alt-s`: surround code with block

# Java Utilities
`ctrl-shift-o`: override method

- `ctrl-shift-n`, `ctrl-n`, : go to file/class

`ctrl *2`: execute anything

- `ctrl-p`: parameter reload info








# intellicence

- iter - generate iteration
- sout - sysout

list symbols
debug experience
