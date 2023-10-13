- TODO: map CAPSLOCK to both ESC and CTRL(hold down). Through hardware.
- TODO: learn vimrc: https://www.youtube.com/results?search_query=vimrc

```
Command - what does it do?
=============================
j - down
k - up
h - left
l - right
o - down append
O - up append
a/i - insert (append/prepend)
A/I - append/prepend to line
gg - home
G - end
21gg - to 21
dd, cc - d line
D, C - d till end
/? - search down/up
n - next search
. repeat oper
caw, c5w, ci{, cf<char>, ct<char>, c/{pattern}
w, b - word movement
```

- .vimrc

```bash
echo 'set number' >> .vimrc
```

## Movement

- `hjkl`
  - `5j`, `5k`: vertical multiple lines

```
           ↑
     ← h j k l →
         ↓
```

- `w`/ `b`: word movement(to beginning of word)

- `{`, `}`, jumps to prev/next code block

- `11gg`/ `Ctrl-o`: jump to/ trace back position

- `gg`/ `G`: top/end of file

- search

  - `f/F <char>`: jump to next/prev occurance of <char> `in a line`
  - `/{pattern}`, `?{pattern}`, `Enter`: search forward/backward
    - `n`: jump to the next(/)/prev(?) occurance of the pattern

## Edit

- enter Insert

  - `i`/`a`: insert mode (prepend/ append)
  - `I`, `A`: prepend/ append to line
  - `o`, `O`: new line

- edit char

  - `r`: change one char
  - `x`: delete one char

- delete (`c`) - (also `d` - stay Normal)

  - delete words

    - `caw`, `c2w` - word
    - `cc, 2cc, dd` - line
    - `cap`, `c2p` - paragraph
    - `ci[`, `ci{` - inner
      - `cit`: change in HTML/XML tag

  - insert mode (same in bash)

    - `ctrl-w`: d one word
    - `ctrl-u`: d til the begining

  - delete directional

    - `ct <char>`: till char, `T` backward
    - `cf <char>`: till char (incl), `F` backward
    - `c/ {pattern}`: till pattern
    - `C`: till end of line

- `gg-dG`: clear document

- Copy/Paste

  - `yy, 3yy`: copy one/multiple line
  - `yaw, y3w`: copy one/multiple word
  - `P/p, 5p`: paste before/after cursor or line
  - Registers:
    - `:reg`: list registers
    - `"ayy`: yank line to register `a`
    - `"ap`: paste from register `a`
    - `c` or `d` operation also cut to register `1-9`

- indent/unindent

  - `3>>` - indent 3 line below
  - `3<<` - unindent 3 line below

## Visual Mode

- visual mode = mouse drag

  - `v` for character-wise visual mode
  - `V` for line-wise visual mode
  - `Ctrl-v` for block-wise visual mode
    - `I/A, <insert>, ESC` prepend/append to multi-curosr location
    - `$, A, <insert>, ESC` append to the end of multi-lines

- `substitute command`: `s` can be used to insert (or replace) text
  - `^/$`: means the beginning/end of line
  - `\/`, `\^`, `\$`: escape signs
  - eg:
    - `:s/^/<comment>/` : comment out selection
    - `:s/^<comment>/` : uncomment selection
    - `:s/Hello world$/` : remove "Hello world" at the end of each line
- in VSCode-vim:
  - you can chain visual block with multi-cursor(`I, A`)
  - I have mapped `ctrl-v` to `alt-v`

## special

- `.`: repeat the last insert/delete/cp/indent operation
- `n`: repeat the last search
- `u`: undo
- `Ctrl-u`: redo

```typescript
// change courteous to polite: /co<ENTER>cfspolite<ESC>n.
const courteousSalute = "I courteously salute you good person.";
// (/cu<ENTER>dawn.n..n.)
cucumber carrot lettuce
cabbage carrot lettuce cucumber
cucumber cucumber carrot
kale cucumber kale
```

- misc(略)
  - gd: go to `definition` of an token
  - `%` jump to matching `({[]})`.

## :commands

- `:wq` : write quit
- `:qa!`: Force close the current file without saving changes
- `:e!`: Discard changes and reload the current file.
- `:sav fname`: Save the current file as a new file.
- `:r filename`: Read the contents of a file into the current document.
- `:set number`: display number

:replace/search/replace/flags: Replace occurrences of a search pattern with a replacement.
:!command: Execute a shell command from within Vim.

## Advanced

# Bounus:

### Register

- The **unnamed register** `"` The default register (typically last yank/delete)
- The **named registers** `a-z` are free use register, `A-Z` append new yank to register `a-z`
- The **yank register** `0` stores the last yank
- The **delete register** `-` stores the last delete
- 存疑
  - The **cut registers** `1-9` store the last 9 cut ❓

## Command Line

- `ctrl-a/e`: go to start/end of line
- `ctrl-shift-c/v`: copy/paste

- delete(cut)

  - `alt-backspace/d`: delete word backward/forward
  - `ctrl-w`; delete/cut word
  - `ctrl-k`: delete/cut till end
  - `ctrl-u`: delete/cut till begining
  - `ctrl-y`: paste cut text

- `clear`: clear screen
