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

## Movement

- `hjkl`
  - `5j`, `5k`: vertical multiple lines

```
           ↑
     ← h j k l →
         ↓
```

- `w`/ `b`: word movement

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

  - `r`: chae one char
  - `x`: delete one char

- delete (`c`) - (also `d` - stay Normal)

  - delete words

    - `caw`, `c2w` - word
    - `cc, 2cc, dd` - line
    - `cap`, `c2p` - paragraph
    - `ci[`, `ci{` - inner
      - `cit`: change in HTML/XML tag

  - delete directional

    - `ct <char>`: till char
    - `cf <char>`: till char (incl)
    - `c/ {pattern}`: till pattern
    - `C`: till end of line

- `gg + dG`: clear document

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

## special

- `.`: repeat the last insert/delete/cp/indent operation
- `n`: repeat the last search
- `u`: undo
- `Ctrl-u`: redo

```typescript
// change courteous to polite: /co<ENTER>cfspolite<ESC>n.
const courteousSalute = "I courteously salute you good person.";
```

- misc(略)
  - gd: go to `definition` of an token
  - `%` jump to matching `({[]})`.

## Advanced

### Register

- The **unnamed register** `"` The default register (typically last yank/delete)
- The **named registers** `a-z` are free use register, `A-Z` append new yank to register `a-z`
- The **yank register** `0` stores the last yank
- The **delete register** `-` stores the last delete
- 存疑
  - The **cut registers** `1-9` store the last 9 cut ❓

# Bounus: Command Line edit

- `ctrl-a/e`: go to start/end of line

- delete(cut)

  - `alt-backspace/d`: delete word backward/forward
  - `ctrl-k`: delete till end
  - `ctrl-u`: delete till begining

- paste

  - `ctrl-y`: paste cut text

- `clear`: clear screen

Ctrl-A: Move the cursor to the beginning of the line.
Ctrl-E: Move the cursor to the end of the line.
Ctrl-U: Delete from the cursor position to the beginning of the line.
Ctrl-K: Delete from the cursor position to the end of the line.
Ctrl-W: Delete the word to the left of the cursor.
Alt-B or Esc-B: Move the cursor backward one word.
Alt-F or Esc-F: Move the cursor forward one word.
Editing Text:

Ctrl-L: Clear the screen (similar to the clear command).
Ctrl-Y: Paste the last text that was cut or deleted.
Alt-D or Esc-D: Delete the word to the right of the cursor.
Cut and Copy:

Ctrl-K: Cut (kill) text from the cursor position to the end of the line.
Ctrl-U: Cut (kill) text from the cursor position to the beginning of the line.
Ctrl-Y: Paste (yank) the last cut or deleted text.
Search and Replace:

Ctrl-R: Start a reverse search for previously executed commands. Repeatedly press Ctrl-R to cycle through results.
Ctrl-G or Enter: Exit the search.
Alt-. or Esc-.: Paste the last argument from the previous command.
History Navigation:

Up Arrow or Ctrl-P: Navigate backward through command history.
Down Arrow or Ctrl-N: Navigate forward through command history.
Ctrl-O: Execute the next command from the history and advance the cursor to the next line.
Miscellaneous:

Ctrl-C: Terminate the current command or process.
Ctrl-D: Logout or exit the shell (if the command line is empty).
Ctrl-Z: Suspend the current process (usually followed by fg to bring it back to the foreground).
These shortcuts can significantly improve your efficiency when working in the Bash console by allowing you to quickly navigate, edit, and manipulate command lines. You can also customize these shortcuts in your .inputrc configuration file to suit your preferences.
