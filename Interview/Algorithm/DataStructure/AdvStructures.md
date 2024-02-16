# Union Find

<!-- [ref](https://labuladong.github.io/algo/di-yi-zhan-da78c/shou-ba-sh-03a72/bing-cha-j-323f3/) -->

- Given a graph of n nodes, there are a number of `connected components, CC` (aka sub graphs that does not connecte to each other)

- For any two nodes in a graph, `isConnected` relation property:
  - `p.isConnected(p)` is true
  - `p.isConnected(q) <=> q.isConnected(p)`, and p, q belongs to the same CC
  - if `a.isConnected(b) && b.isConnected(c) => a.isConnected(c)` is true
  -

```go
// apis
type UnionFind struct {
    // connect node p and node q
    func union(p int, q int)
    // determine if node p and node q are connected
    func isConnected(p int, q int) bool
    // return number of connected components
    func count() int
}
```

- implementation: trees (forest):

  - each connected component is represented by a tree
  - root of each tree points to itself, node inside the tree points to its parent
  - `findRoot(p)` root of node p by traverse through parent pointer to the root
  - if findRoot(p) == findRoot(q), node q, p are connected. And we can `union()` by modify the two roots
  - route compression: when `findRoot()` the root of any node, point all nodes along the route to the root of the tree, so that the height of the tree is minimized

- findRoot(): O(1) for already compressed node, O(logn) for balanced tree, or O(n) worst case
- union(): O(1) for already compressed node, otherwise equals to time of findRoot()
- isConnected(): O(1) for already compressed node, otherwise equals to time of findRoot()
- count(): O(1)

```java
class UnionFind {
    private int count;  // # of connect components
    private int[] parent;  // store parent node of each nodes

    // 1. constructor: initialize unionFind of n nodes, O(n)
    // initially each node points to itself
    public UnionFind(int n) {
        this.count = n;
        this.parent = new int[n];
        for (int i = 0; i < n; i++) {
            this.parent[i] = i;
        }
    }

    // 2. return root of any node, while compress the route to height of 1,
    // O(1) if alreay compressed, O(logn) for balanced tree, O(n) worst case
    // implement: recursively linked list traversal, while compress the tree
    public int findRoot(int x) {
        if (parent[x] != x) {             //!!!
            root = findRoot(parent[x])
            parent[x] = root;  //!!!
        }
        return parent[x];
    }

    // 3. connect node p and node q,
    // time equals to findRoot()
    public void union(int p, int q) {
        int rootP = findRoot(p);
        int rootQ = findRoot(q);

        if (rootP != rootQ) {
          // make tree(rootQ) to be a child of rootP
          parent[rootQ] = rootP;
          count--;
        }
    }

    // 4. determine if node p and node q are connected:
    // time equals to findRoot()
    public boolean isConnected(int p, int q) {
        int rootP = findRoot(p);
        int rootQ = findRoot(q);
        return rootP == rootQ;
    }

    // 5. return # of CC: O(1)
    public int count() {
        return count;
    }
}
```

# Trie (Prefix Tree)

- A `trie` (pronounced as "try") or prefix tree is

  - a `tree` data structure. `Node{char, isEndofWord, childNodes}`
  - efficiently check if a string is a prefix of another string, or get a list of strings with a prefix.
  - various applications such as autocomplete and spellchecker.

- apis

```go
type TrieNode struct {
	Children map[byte]*TrieNode
	isEndOfWord    bool
}

type Trie struct {
	Start *TrieNode
}


// Initializes the trie object.
Trie() Trie:

// Inserts the string word into the trie.
addWord(String word):

// delete a word from trie
deleteWord(String word):

// Returns true if the string word is in the trie (i.e., was inserted before), and false otherwise.
search(String word) bool:

// Returns true if there is a previously inserted string word that has the prefix prefix, and false otherwise.
isPrefix(String prefix) bool

// Returns true if the string word is in the trie. Word may contain dots '.' where dots can be matched with any letter.
searchFuzzy(String word) bool

// Returns true if there is a previously inserted string word that has the prefix prefix, and false otherwise.
isPrefixFuzzy(String prefix) bool
```

- implemetation: traverse
- ref:
  - [211.design-add-and-search-words-data-structure](https://github.com/sugoiServal/leetCode/blob/master/LeetCode_Go/dataStructures/211.design-add-and-search-words-data-structure.go)
  - [208.implement-trie-prefix-tree.go](https://github.com/sugoiServal/leetCode/blob/master/LeetCode_Go/dataStructures/208.implement-trie-prefix-tree.go)

```go
func Constructor() Trie {
	return Trie{
		Start: &TrieNode{
			Children: make(map[byte]*TrieNode),
			isEnd:    false,
		},
	}
}

// Inserts the string word into the trie.
func (this *Trie) addWord(word string) {
	curNode := this.Start
	for i, _ := range word {
		char := word[i]

		if child, exists := curNode.Children[char]; !exists {
			newNode := &TrieNode{
				Children: make(map[byte]*TrieNode),
			}
			curNode.Children[char] = newNode
			curNode = newNode
		} else {
			curNode = child
		}
	}
	curNode.isEnd = true
}

// delete a word from trie

func (this *Trie) deleteWord(word string) {
	curNode := this.Start
	nodeStack := []*TrieNode{}
	charStack := []byte{}

	// Step 1: Traverse the tree to find the word
	for i, _ := range word {
		char := word[i]
		if _, exist := curNode.Children[char]; !exist { // word not in trie
			return
		}
		nodeStack = append(nodeStack, curNode)
		charStack = append(charStack, char)
		curNode = curNode.Children[char]
	}

	if !curNode.IsEndOfWord { // word not in trie
		return
	}

	// Step 2: delete the word: delete all leaf && non-end nodes from the stack
	curNode.IsEndOfWord = false // Mark the last node as not end of word
	for len(nodeStack) > 0 {
		// pop stacks
		parentNode := nodeStack[len(nodeStack)-1]
		delChar := charStack[len(charStack)-1]
		nodeStack = nodeStack[:len(nodeStack)-1]
		charStack = charStack[:len(charStack)-1]

		delNode := parentNode.Children[delChar]
		if len(delNode.Children) > 0 || delNode.IsEndOfWord {
			break
		}
		delete(parentNode.Children, delChar)
	}

}

// Returns true if the string word is in the trie (i.e., was inserted before), and false otherwise.
func (this *Trie) Search(word string) bool {
	curNode := this.Start

	for i, _ := range word {
		char := word[i]
		if child, exists := curNode.Children[char]; exists {
			curNode = child
		} else {
			return false
		}
	}
	return curNode.isEnd
}

// Returns true if the string word is in the trie. Word may contain dots '.' where dots can be matched with any letter.
func (this *Trie) searchFuzzy(word string) bool {
	var dfs func(curNode *TrieNode, word *string, start int) bool
	dfs = func(curNode *TrieNode, word *string, start int) bool {
		for i := start; i < len(*word); i++ {
			char := (*word)[i]
			if char == '.' {
				for _, node := range curNode.Children {
					if dfs(node, word, i+1) {
						return true
					}
				}
				return false
			}

			if child, exists := curNode.Children[char]; exists {
				curNode = child
			} else {
				return false
			}
		}
		return curNode.IsEndOfWord
	}
	node := this.Start
	return dfs(node, &word, 0)
}

// Returns true if there is a previously inserted string word that has the prefix prefix, and false otherwise.
func (this *Trie) isPrefix(prefix string) bool {
	curNode := this.Start

	for i, _ := range prefix {
		char := prefix[i]
		if child, exists := curNode.Children[char]; exists {
			curNode = child
		} else {
			return false
		}
	}
	return true
}
```

# Heap

- `heap`: complete binary with constraints, capably to get max/min value in O(logn)

  - `max heap`: parent > child, heap top element (aka root) is always the maximum
  - `min heap`: child > parent, heap top element (aka root) is always the minimal (similar, not discuss below)

- `Priority Queue`: an abstract data type (ADT), such that each data has a priority, and elements with higher priority are dequeued before elements with lower priority.

  - can be implemented with max heap

- APIs
  - sink: recursive going down with choose: the larger subtree
  - float: iteratively going up
  - `insert at the end` and float
  - `pop/pull at the top` and use the last element to sink

```go
// O(n): build Priority Queue from unsorted array
buildMaxHeap(arr):

// O(logn): if the root `n` is not the max in a tree, sink it to the right position
sink(n):

// O(logn): if a node `n` is greater than its parents, float it to the right position
float(n):

// O(logn): insert a new node to priority queue
insert(val)

// O(logn): pull max from priority queue
pullMax()
```

- implementation:
  - as a complete binary tree, use an array `heap` to store the `tree's BFS sequence` => we can find parent or children of a node in O(1)
  - n's children: `n*2`， `n*2+1`
  - n's parents: `floor(n/2)`

![](https://imgur.com/MEFttfJ.jpg)

```go
// O(1) get parent, left/right child of a node
n.Parent(): return n/2    // n is int
n.Left(): return n*2
n.Right(): return n*2+1


// O(logn): if the root `n` is not the max in a tree, sink it to the right position
  // 1.if root is not the argmax(root, root.left, root.right), find the larger among the three and swap with root
  // 2.recursive sink the swapped position

sink(root, heap) {
  if heap[root.Left] < heap[root] && heap[root.Right] < heap[root]: return // already satisfied max heap
  else {
    newRoot = root.Left if heap[root.Left] > heap[root.Right] else root.Right
    swap(heap[newRoot], heap[root])
    sink(newRoot, heap)
  }
}

// O(logn): if a node `n` is greater than its parents, float it to the right position
  // iteratively swap the node with its parent until its parent is greater than it

float(node, heap) {
  for heap[node.Parent] < heap[node] {
    swap(heap[node.Parent], heap[node])
    node = node.Parent
  }
}

// O(logn): insert a new node to priority queue
  // append the new node to the priority queue (at the end), then float it to the correct position
insert(val, heap) {
  heap.append(val)
  newNode = len(heap)-1
  float(newNode, heap)
}

// O(logn): pull max from priority queue
  // get the max value from heap top: heap[0]
  // delete the last node and assign its value to the root position
  // sink(root, heap)
pullMax(heap) {
  max = heap[0]
  heap[0] = heap[len(heap)-1]  // reassign heap top with the heap bottom's value
  heap = heap[:len(heap)-1]  // delete the last node
  sink(0, heap)
  return max
}

// O(n): build Priority Queue from unsorted array
// implement 1
buildMaxHeap(array) {
    for i from len(array)/2 to 1 {
      sink(i, array)
    }
    return array
}

// implement 2
buildMaxHeap(array) {
    heap = []
    for num in array {
      insert(num, heap)
    }
    return heap
}
```

- bouns: heapSort(): O(nlogn)
  - inplace O(nlogn) sorting algorithm

```go
heapSort(array) {
  array = buildMaxHeap(array)
  for i = len(array) - 1; i >= 0; i-- {
    swap(array[0], array[i])
    heap = array[:i]  // exclude last element from heap
    sink(0, heap)  // sink the root (just swapped) in the shortened heap
  }
}
```

# BST: binary search tree

### what is it

- a binary tree
  - key, left, right, parent
    - key: the value
    - left, right, parent: all pointers
- satisfy the **binary-search-tree property**:
  - Let $x$ be a node in a binary search tree. If $y$ is a node in the left subtree of $x$, then $y.key\leq x.key$. If $y$ is a node in the right subtree of $x$, then $y.key \geq x.key$.
  - 就是说
    - root 的值总是大于等于左子树中任意 Node 值
    - root 的值总是小于等于右子树中任意 Node 值

![a](https://imgur.com/Wmi5V8H.jpg)

### by the definition, we have

1.  通过中序遍历(inorder traverse/tree walk), 可以得到由小到大排序过的序列. time: O(n)
2.  对于 BST 的每一个节点 node，它的左侧子树和右侧子树都是 BST (也就是递归的)

### BST 的递归结构

![](https://imgur.com/NlbmByX.jpg)

## operations（全是 O(h)）:

### 使用

- searching (O(h), h 是树高): 在树中查找一个值, 返回 node 指针.
- argmin/ argmax (O(h), h 是树高): 返回 argmin 和 argmax 的 node
- Successor/ predecessor (O(h), h 是树高): input 任意 node, 返回他在中序遍历返回的 sorted list 中的下一个、上一个 node

### 维护

- insertion (O(h), h 是树高): 插入一个 node, 维持 BST 性质
- deletion (O(h), h 是树高): 删除一个 node, 维持 BST 性质

## algorithms:

### search()

- 有点像 2 分搜索但是数据结构已经帮你分好了

```python
def BSTsearch(root, val):
  if root is None or x.key == val:
    return x
  if  x.key > val:
    return BSTsearch(root.left, val)
  if  x.key < val:
    return BSTsearch(root.right, val)
```

### argmin/ argmax:

- 找到最靠左或最靠右的 Node

```python
def BSTargmin(root):
  while root.left is not None:
    root = root.left
  return root

def BSTargmax(root):
  while root.right is not None:
    root = root.right
  return root
```

### Successor/ predecessor

- Successor:
  - case1: 如果 x 的右子树非空, x 的 succssor 是它右子树中最左端 Node, 即 BSTargmin(x.right)
  - case2: 如果 x 的右子树空, x 有可能是某一个左子树中的最右端的 Node。 所以我们要向上找到 $y$
    - $y$ is the lowest ancestor of $x$ whose left child is also an ancestor of $x$
      ![](https://imgur.com/vAgXE2T.jpg)
    - 例如上图中 13, 我们要找的是 15： left child 6 is also ancestor of 13
- predecessor 是对称操作

```py
def BSTSuccessor(x):
  if x.right is not None:
    return BSTargmin(x.right)
  else:
    y = x.parent
    while (y is not None) and (x is y.right):
      # should break when x is not y.right, but y.left
      x = y
      y = y.parent
    return y
```

```py
def BSTPredecessor(x):
  if x.left is not None:
    return BSTargmax(x.left)
  else:
    y = x.parent
    while (y is not None) and (x is y.left):
      # should break when x is not y.left, but y.right
      x = y
      y = y.parent
    return y
```

- 因为只需要在树上向上或向下走并且最大的高度不会超过 h, 所以复杂度 O(h)

### BSTinsertion(root, newNode)

- 把新的值为 newNode.val 的 newNode 插入到合适位置，维持 BST 性质：

```python
def BSTinsertion(root, newNode):
    # empty tree
    if root is None:
        root = newNode
        return
    y = None
    x = root
    while x is not None:
        xLast = x  # 结束时x is None, xLast是x变为None前最后的位置
        if newNode.key < x.key:
            x = x.left
        if newNode.key >= x.key:
            x = x.right
    # 此时 xLast 是 newNode 的parent的位置，newNode应该放在x变为None的位置
        newNode.parent = xLast
        if newNode.key < xLast.key:
            xLast.left = newNode
        if newNode.key >= xLast.key:
            xLast.right = newNode
    return
```

### deletion()

- !!!!!!!递归解在 leetcode 450
- 删除时，删除的点 delNode 可能有 3 种情况，分别有 3 种不同的对应方法
  1. delNode 是叶子，没有子树(left = right = None)
     - 直接删除即可
  2. delNode 有单个子树
     - 删除掉以后用子树替代掉它的位置就可以
     - (更改 delNode.parent 的指针，更改 delNode.child 的指针)
  3. delNode 有两个子树
     - 在 delNode 的右子树中找到它的 successor(left-most node)。 successor 必定只有 right 没有 left 子树
     - 如果 successor == delNode.right ((c) case)
       - 删除 delNode, 用 delNode.right/successor 代替 delNode 的位置
     - 如果 successor != delNode.right ((d) case)
       - 删除 delNode, 用 successor 代替 delNode 的位置
       - 用 successor.right 代替 successor 原来的位置

![](https://imgur.com/1aCiGRQ.jpg)

- 使用一个辅助函数 transplant(delNode, replaceNode):
  - 把 replaceNode 作为树根的任意树代替 delNode 位置
    - 修改 delNode.parent 关系
    - 修改 replaceNode.parent 关系
    - 不修改 delNode.children

```python
def transplant(delNode, replaceNode):
    if (delNode.parent is None):
        return
    if(delNode is delNode.parent.left):
        delNode.parent.left = replaceNode
    elif(delNode is delNode.parent.right):
        delNode.parent.right = replaceNode

    if (replaceNode is not None):
        replaceNode.parent = delNode.parent
```

```python
def BSTdeletion(delNode):
    # cover first two cases
    if (delNode.left is None):
        transplant(delNode, delNode.right)
    elif (delNode.right is None):
        transplant(delNode, delNode.left)
    # third case
    else:
        successor = BSTsuccessor(delNode)
        if (successor is delNode.right):
            transplant(delNode, successor)
            # deal with delNode children: only left
            successor.left = delNode.left
            delNode.left.parent = successor
        else:
            transplant(successor, successor.right)
            transplant(delNode, successor)
            # deal with delNode children: left and right
            successor.left = delNode.left
            delNode.left.parent = successor
            successor.right = delNode.right
            delNode.right.parent = successor
```

## final note:

Randomly built binary search tree does not guarantee to be balanced (ie: height = log(n)). In the worst case the height of the tree is n. To achieve guaranteed balanced tree there are data structures like

- AVL tree: first balanced binary
- B tree: ideal for disk storage、数据索引和数据库索引。 (avoid highly expensive IO operation)
- Red-Black Tree: 广泛运用 RAM solution，例如 c++ STL map/
- Trie Tree(字典树): 用在统计和排序大量字符串，如自动机, 搜索关键词提示

# Red-Black Tree (RBT):

红黑树是 balanced binary search tree，

- 它引入了更多的数据结构规则和更复杂的插入/删除算法
- 但是它保证了近似搜索树平衡性: aka height $h == logn$
- 它保持了插入/删除/查找的的时间效率 O(logn)

与 AVL 树的不同：

- AVL 树是 hard constraint： 任意节点的左右子树的高度差的绝对值不大于 1。 hard constraint 导致基本每次进行插入/删除节点都会破坏平衡性质，导致插入/删除平均性能较差；
- 红黑树是一种大致平衡的二叉搜索树(loose constraint)（叶子到根的最大长度不大于其最小长度之两倍。因此 插入、删除等操作相对不频繁需要 fix. ==> 比 AVL 树更好的 write 性能。 代价是相对较弱的查找速度

红黑树结点数与树高的约束：lg(n+1) >= h/2

应用：例如 C++11 STL 里 set, map，multiset、multimap 的实现

### rules of red-black tree: **red-black properties**

1. Every node is either red or black
2. root and NIL-leaves of the tree are black
3. if a node is red, both of its children is black
4. from arbitrary node, the path from itself to any NIL-leaves contain the same number of black nodes.
   - the number is refered as blackHeight(node)

- 相比 BST, 每个 node 多用一个 field(binary)记录 red/black

### operations

- 搜索的功能与 BST 完全一致，但是 insertion 和 deletion 为了维持红黑性质，与 BST 不同
- search: O(logn)
- insertion: O(logn)
- deletion: O(logn)

## algorithms

### rotation:

- rotation goal: decrease the height of the tree
  - by move large subtrees up, move small subtrees down
  - rotation should not alter the BST property: small left tree and large right tree
- two types of rotations: left-rotation; right-rotation
  - 2 个的算法是对称的
  - time: O(1), 只有修改指针的操作

```python
def leftRotation(x):
    # x.right.left becomes x.right
    newXright = x.right.left
    x.right = newXright
    if newXright is not None:
        newXright.parent = x

    # x.right becomes the root, and x is its left child
    newRoot = x.right
    newRoot.parent = x.parent
    if (x == x.parent.left):
        x.parent.left = newRoot
    elif (x == x.parent.right)
        x.parent.right = newRoot
    newRoot.left = x
    x.parent = newRoot
```

![](https://imgur.com/CtTEm7J.jpg)
![](https://imgur.com/nsHMGKJ.jpg)

### insertion: O(logn)

- insertion must preserve BST and red-black properties
- strategy
  - insert newNode (according to BSTinsertion) and color it red
  - recolor and rotate nodes to fix violations
    - two possible violations:
      >
          1. root and NIL-leaves of the tree are black
          2. if a node is red, both of its children is black
  - move the pointer up to the next violated tree, and fix new violation. iterate until all violations are fixed
    - this is done by the main iteration, it like the following code

```python
# O(logn)
def RBTinsertion(root, newNode):
BSTinsertion(root, newNode)
newNode.color = RED
# fix part
curNode = newNode
while (curNode.parent is not None) and (curNode.parent.color is RED): # curNode is not root yet; AND there is a violation
    if Cases2AndFixes(): # uncle red case
        curNode = curNode.p.p # make curNode its grandparent after fixing case2
    elif Cases3AndFixes():  # triangle case
        curNode = curNode.parent # the original parent
        fixCases4AndFixes():  # case4 must occur in curNode's original parent after fixing case3
    elif Cases4AndFixes() # line caseL just fix it
    if curNode.parent is None:
        break # escape when reach the root of tree
tree.root.color = BLACK # the case1
```

- 4 only violation scenarios after: insert newNode and color it red
  1. newNode is root
  2. newNode.uncle is red
  3. newNode.uncle is black(triangle)
  4. newNode.uncle is black(line)

### 1. newNode is root

- flip the color to black

### 2. newNode.uncle is red

- flip z.uncle, z.parent and z.parent.parent

| before                             | after                              |
| ---------------------------------- | ---------------------------------- |
| ![](https://imgur.com/1cRwd1y.jpg) | ![](https://imgur.com/t3iexeb.jpg) |

### 3. newNode.uncle is black(triangle)

- newNode, newNode.parent, newNode.grandparent form right triangle:
  - do rightRotation(newNode.parent)

| before                             | after                              |
| ---------------------------------- | ---------------------------------- |
| ![](https://imgur.com/waaASsA.jpg) | ![](https://imgur.com/TpzncF5.jpg) |

- newNode, newNode.parent, newNode.grandparent form left triangle:
  - do ieftRotation(newNode.parent)

| before                             | after                                                                      |
| ---------------------------------- | -------------------------------------------------------------------------- |
| ![](https://imgur.com/br4ikl7.jpg) | Z took the place of c!!!!! the image is missing this is a just placeholder |

### 4. newNode.uncle is black(line)

- newNode, newNode.parent, newNode.grandparent form right-direction line:
  - do leftRotation(newNode.grandparent)
  - swap color of original newNode.parent and newNode.grandparent

| before                             | after rot                          | after color                        |
| ---------------------------------- | ---------------------------------- | ---------------------------------- |
| ![](https://imgur.com/uGC0F7u.jpg) | ![](https://imgur.com/8ZshrT9.jpg) | ![](https://imgur.com/1E5hw7l.jpg) |

- newNode, newNode.parent, newNode.grandparent form left-direction line:
  - do rightRotation(newNode.grandparent)
  - swap color of original newNode.parent and newNode.grandparent
  - not image this time

#### case 3 and 4 can be unified into do rotation of (parent/ grandparent) in the **OPPOSITE DIRECTION OF newNode**

### deletion: O(logn)

-------TODO

```python
def RBTdeletion(delNode):
    delNode_originColor = delNode.color
    delNodeReplacement = BSTdeletion(delNode)
    # (delNodeReplacement is the successor/ or L,R tree that took delNode's position)
    if (delNode_originColor is BLACK):
        RBTdeletionFix(delNodeReplacement)

```
