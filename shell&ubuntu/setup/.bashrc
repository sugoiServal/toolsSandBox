# add to the end

alias rm='rm -I --preserve-root'
alias lm='ls -al'
cdw(){ wspth=$(wslpath "$1"); wspth=${wspth//' '/'\ '}; eval "cd $wspth";}
alias grep='grep --extended-regexp'
export EDITOR="/bin/vim"



alias gitlog='git  log --all --graph --decorate'
alias codecd='pwd | xargs code'
alias h=history
