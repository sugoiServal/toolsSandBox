# platform: wsl

# list
    1. nodejs, nvm, npm
       1. nodemon | live node server
       2. lodash
       3. express
    2. tldr
    3. git
    4. tree
    5. locate
    6. autojump
    7. gcc
    8. cmake
    9.  Anaconda
    10. unzip


# do this first
sudo apt update

# nodejs & npm
    #ref: https://docs.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-wsl
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
    nvm install --lts

# tldr: Collaborative cheatsheets for console commands
    npm install -g tldr

# git

# tree

# locate
sudo apt install mlocate

# autojump
sudo apt install autojump
sudo echo ". /usr/share/autojump/autojump.bash" >> ~/.bashrc && sudo source ~/.bashrc

# gcc
sudo apt install gcc
