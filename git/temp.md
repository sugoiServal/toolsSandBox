# git explained
## what is git
- version control system: track and rollback changes in files in a filesystem
- how it is done:
  - capture whole filesystem as a series of snapshot and maintain a history of those snapshots(and meta data for management)
## why git are useful
- some scenerio:
  - keep a bcakup version and then dev new features, then update to a new branch
  - go back in history to
    -  look for the source of a bug 
    -  understand how feature was development 
  - work in a group, members work in parallel with different features, then resolve conflicts and merge the code


# git in action
- **all git commands are just manipulating the underlying DAG model(local) + remote functions**
1. element/terms:
   - ID: vanilla hash, references (HEAD, MASTER, ORIGIN, etc...)
   - repo(Repositories): combination of the storages of git object, and set of IDs. Data is stored in .git
   - Node alias
     - HEAD: the current node you are in (master or through checkout)
     - master: the lattest version

   - .gitignore: sepecify the files that will be ignored
  
2. common rules:
   - add (staging) before commit
   - size limitation: git should have file size limitation, because blobs in each commit are actually binaries stored in the disk

3. commands
- setup
``` bash
git config --global user.email "urEmail@gmail.com"
git config --global user.name "urName"
```
- basics, info
``` bash
git init # creates a new git repo, with data stored in the .git directory
git help <command>
git status # status summary
git log, gitlog # list all history commits in DAG
git branch -vv # list all branches in current repo
```
- traverse
``` bash
git checkout <hash> # updates HEAD to another node
git checkout -f <hash> # force checkout, ignore all changes made to current node
```
- commit
``` bash
git add <filename>  #  adds files to staging area
git add *, git add :/  #  adds all files, everything from top level
git commit # commit
```
- branching 
  - we refer branch node with custom reference name <name>, usage just like 'master'
  - after a branch \<br> is made,
    - the HEAD still point to current commit
    - if we checkout \<br>, any new commit will be made along \<br> branch
    - if we dont checkout \<br>, any new commit will be made along current branch (typically 'master')
    - we can make another branch \<cr>, same logic, change will be made on \<cr> only if we checkout \<cr>
    - now there are three branches: 'master', \<br>, \<cr>
  -  **checkout branch won't discard change you have made to current filesystem, it is not like checkout commit**, when you commit these changes they will be made on new branch
``` text
    master  <br>                    
     /      /                     
--- o <-- o 
     ^      <cr>    
      \     /     
       --- o 
```

``` bash
# branching
git branch <name>   # create a branch <name> from current commit
git checkout -b <name> # creates a branch <name> and then switches to it
```
- merging 
``` bash
git merge <name>

git diff <filename> # show changes you made to <filename>, relative  to current commit
git diff <revision> <filename> # show changes you made to <filename>, relative to commit <revision>
```
# git bottom-up
## snapshot model
### 1)filesystem
- elements
  - tree: a folder, 
  - blob: a file (essentially binary chunk)
  - snapshot: a commit, a record of the whole directories of interest
  - tree and folder, blob and file, snapshot and commit, these names are used interchangeably
- rules:
  - tree can contain tree or blob
  - blob cannot contain tree
```text
[snapshot] (commit)
|
<root> (tree)
|
+- foo (tree)
|  |
|  + bar.txt (blob, contents = "hello world")
|
+- baz.txt (blob, contents = "git is wonderful")
```

### 2)data structure of commit (snapshot)
- elements (bottom-up, in pseudocode):
``` python
type blob = array<byte>  # a file is a bunch of bytes
type tree = map<string, tree | blob> # a directory contains files and directories. tree object := a mapping from directory name to tree objects and blobs
# a commit has parents, metadata, and the top-level tree
type commit = struct {
    parents: array<commit>
    metadata: {    
        author: string
        message: string
    }
    snapshot: tree
}
```
- commit storage and key:
  - blob, tree, commit, (array, mapping of them) are treated the same as object
  - each object has an ID, which is its SHA-1 HASH
  - objects are stored in a dictionary like structure: objects are indices, retrieved with its HASH ID
``` python
storage = map<string, object>  # the storage
# member methods
    # add object to the storage 
    def store(object):
        id = sha1(object)
        storage[id] = object
    # access an object
    def load(id):
        return storage[id]
```

## git model: directed acyclic graph
- elements
  - 'o' represent commits (snapshot) and metadata
  - <- point directly to the commit that is been modified (been worked with)
- rules:
  - **checkout**: user may land freely on any commit (snapshot), and work from the state of the commit. 
  - **commit**: user may create new snapshot and add it to the history: create a new node
  - **branch**: user may branch from current node into two nodes, and then work on one of the branch
  - **merge**: user may merge two branches into single node, provided that conflicts of the two versions are resolved
  - commits are immutable: any node being created is carved in history
- references:
  - The current node the user are working with is called **HEAD**
  - the latest version (node) of the project being developed is called **master**
``` text
                        HEAD, master
                           / 
o <-- o <-- o <-- o <---- o
            ^            /
             \          v
              --- o <-- o
```

## staging area
- what is staging:
  - only selected files (being added) will be commited to the new commit. In other word, files that has not been added, even though they may be modified, will not be added.
- why staging?
  - scenerio 1: 
    - same file, 2 modification. one for debug (messy) and the other for release. We only add the second file. 
  - scenerio 2: 
    - files that are purposed to testing, data, etc. can be exclude to the release
  - scenerio 3: 
    - it not sure whether a file is modified, but we are sure that the file in the last commit is correct. Thus we ignore the file in the next commit.

- how: git add before commit