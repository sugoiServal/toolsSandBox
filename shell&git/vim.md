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

- char

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

- Copy/Paste

  - `yy, 3yy`: copy one/multiple line
  - `P/p, 5p`: paste before/after cursor or line
  - Registers:
    - `:registers`: list registers
    - `"1yy`: yank line to register 1
    - `c` or `d` operation also cut to register
    - `"1p`: paste from register 1

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
