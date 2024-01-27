# algorithm design

- recursion: 给递归函数一个合适的定义，然后用函数的定义来解释你的代码；如果你的逻辑成功自恰，那么说明你这个算法是正确的。

  - entry point(func signature): one entry/ multiple entries?
  - recursion return
  - operation in recursion
  - base case

- DFS, backtracking, memoization, DP
  - `DFS` is brute force state space traverse(w/ recursion)
  - `backtracking` is `DFS + pruning`: brute force state space traverse(w/ recursion) with pruning
  - `memoization` is record previously solution when there are overlapping subproblems. memoization can be apply to backtracking/DFS.
  - `DP` is problem with `overlapping subproblems`.
    - DP is implemented through either top-down or bottom-up approach
      - top-down DP is essentially DFS/backtracking + memoization
      - bottom-up DP is like building DP table from scratch, through iteration. Sometime it is possible to implement a bottom-up DP from top-down DP, sometimes it is not possible.

# List

- list(array)

  - 连续的存储空间, (有可能 长度不是动态的，需要处理扩容缩容的问题)
  - O(1) 随机访问
  - 扩容和 Insertion/Deletion 麻烦
    - 扩容：O(n), 需要将整个数组复制到新建的另外一个内存区域
    - Insertion/Deletion: O(n), 大量的 element 移动

- LinkedList (与数组全部正好相反)
  - 非连续的存储空间，动态长度
  - 不能随机访问
  - 扩容/增加和删除非常容易 O(1)

```go
// list
arr []int

// LinkList
type ListNode struct {
    val int
    next *ListNode
}
```

### LinkedList

- `dummyNode` tricks (dummyNode.next is the solution)

  - when: when you need to build solution from more than one input
  - purpose: avoid write complex edge cases (input is null)

```go
// dummy always point to the start of solution
dummy := &ListNode{-1, nil}
// tail start from dummy, and populate the solution
tail := dummy
```

- how is the solution built?

  - populate solution
  - concatenate multiple solution

### Multi-pointers

- how should the pointers behave?

  - how many pointers
  - different speed,
  - different start positions,
  - different direction
  - reset pointer location

### Sliding Window

- The window as a whole moves in one direction (e.g. right). When the window needs to be enlarged, increase the right boundary, when the window needs to be shrinked, increase to the left boundary

  - careful about the boundary in implementation. eg. shrink/expand window before or after an operation. print and log can help you find issues.

- O(n): since the window needs as a whole move in one direction, each element only enter and exit the window once

- design
  - think in the window.
    - what is a window, what state the window maintains, are there special position in the window.
    - key is to define the validity condition of the window, and how to check the validity (container to store the window's state, update of the state...)
  - decide when (during expanding or shrinking), to update the solution

```go
left, right := 0, 0
window := container of slide window
while (left < right && right < array.size()) {
    // enlarged window
    window.add(array[right]);
    right++;  // windows' indexabe range is [left, right-1], ie. not include the right

    while (left < right && window needs shrink) {
        // shrink window
        window.remove(array[left]);
        left++;
    }
}
```

### Binary Search

- sign of binary search:

  - sorted array/ a monotonic function
  - a clear criteria when to search in left, and when to search in right

- two implementations:

  - both-closed interval implementation: does not handle the
    - left, right := 0, len(nums)-1
    - while left <= right
  - right-open interval implementation: (also sliding window)
    - left, right := 0, len(nums)
    - while left < right

- Binary Search Variations:
  - find the target,
  - find left/right boundaries of the target
  - find the nearest element that is smaller/larger to the target

```go
// suppose we want to search for left boundary
left, right := 0, len(nums)-1
found := -1
for left <= right {
  mid := left + (right-left)/2
  if need to search in right {
    left = mid + 1 // search in right
  } else if need to search in left {
    found = mid    // save for boundary search
    right = mid - 1 // search in left
  }
}
```

# Binary Tree

```go
type TreeNode struct {
    val int
    left *TreeNode
    right *TreeNode
}
```

- traverse (DFS):

  - `Pre-order` Traversal: Root -> Left -> Right
  - `In-order` Traversal: Left -> Root -> Right
    - have left subtree processed
  - `Post-order` Traversal: Left -> Right -> Root
    - have left and right subtrees processed

- traverse (BFS): `level order` traverse

- Binary Tree traverse is done primarily with `recursive approach` as the is no easy way to define a iterative approach

```go
func traverse(root *TreeNode) {
    if root == nil {
        return
    }
    // Pre-order
    traverse(root.Left)
    // In-order
    traverse(root.Right)
    // Post-order
}
```

### Design

- DFS or BFS

- which traverse pattern
- what to do (operation) in each tree node
- what external states/ state tables

- ! use more than the root node in recursive definitions:
  - be greedy! how about traverse(root, root.left, root.right)
  - more arguments means more combinations options in the recursive call

### Serialization/Deserialization

- without nil nodes, inorder + preorder/postorder traversal can uniquely identify a binary tree
- with nil nodes, preorder or postorder traversal can uniquely identify a binary tree
  - nil + inorder is not sufficient to encode a binary tree ([1,1],[1,null,1] have the same sequence: `#,1,#,1,#,`)

### Binary Search Tree(BST)

- Binary Search Tree: for each node (recursive definition)

  - left subtree of contains only nodes with values less than the node's value
  - right subtree of contains only nodes with values greater than the node's value

- features:

  - all nodes in the left are smaller than the root, and all nodes in the right are greater than the root
  - In a standard BST each node has `unique value` in the tree.
  - `in-order traverse` of a Binary Search Tree returns an `ordered` sequence
  - `O(logn)` best case insertion/deletion and search for a value

- BST extension (balanced Search trees):

  - AVL tree, red-black tree, B+ tree
  - All three tree structures provide efficient search, insertion, and deletion operations in O(log n)

- operations
  - add/remove/search: O(logn)
  - isBST

# DP

- most DP is finding a optimal (max/min...) substructure

- try brute force solution/recursionTree to find out if there is overlapping subproblems.

- two implementations

  - top-down => recursion: 对于复杂问题 (例如二维 DP table) 有实现复杂性优势
  - bottom-up => iteration： 效率更好，简单问题 (一维 DP table, 直观转移方程) 可以直接写

- DP table: array(1-D, 2-D...), or hashmap

- optimize DP table size: 我们发现每次状态转移只需要 DP table 中的一部分，那么可以尝试缩小 DP table 的大小，只记录必要的数据, 并及时更新数据

## Design Strategy

- 这是一个推理试错的过程。 可能要反复推翻 1,2 直到找到一个自洽的解法
- 尽量不要用直觉的方法试，尝试抽象问题

1. 试图定义问题、子问题， DP table 和解增长方式(例如，向前，向后)。
2. 求状态转移方程，有两种策略

- 按照解的定义，假设我在求解一个新的问题时已经知道之前解的答案。我可以利用之前解的答案做些什么（递归思想）=> 状态转移方程
- 在最 base 的几个 case 上试着解问题，找到随着问题规模增大，解变化的规律。 => 状态转移方程

3. optimize： 优化 DP table, 重写 recursion 为 iteration 等等

### iteration implementation

- it is common to pad the DP table by 1 row and 1 column
- it common to fill the DP table with know information before iterating. Usually the last/first column and row

### Subsequence Problems

- generally O(n^2) problems
- 2D scenerios
  - two strings (common subsequence, edit distance...), s1[i:], s2[j:]
  - two pointers (PalindromeSubseq...), s[start: end]

# Backtracking

- `backtracking` is DFS over `choice set` -- a `pruned state space`

  - basecase/stop criteria
  - compute current choice set
  - recursion over choice set

- design
  - draw the backtracking tree first
  - the key is to design the state needed for backtracking and the choiceSet

```python
result = []
def backtrack(curSol, choiceSet):
    if basecase/stop criteria:
        result.add()
        return
    for choice in choiceSet:
        # do choice
        curSol.add(choice)
        choiceSet.remove(choice)
        # DFS
        backtrack(curSol, choiceSet)
        # undo choice
        curSol.remove(choice)
```

### Combination/Subset

- combination problem is the same problem as allSubsets, combination is merely subset of len(k)
- the backtrack state records the index to start iteration, we never look back in the recursion stack

```go
func backtrack(start, subset) {
    // in allSubsets, each recursion function is an subset;
    saveToAnswer(subset)
    // Optional 1: in combination problem, check then length before saving
    if (len(subset) == target) {
        saveToAnswer(subset)
    }

    for i := start; i < len(nums); i++ {  // iterate over the index of nums
        // Optional 2: for input that includes duplicated number, sort the input, then prune and skip duplicated numbers
        if i > start && nums[i] == num[i-1] {
            continue
        }
        subset.append(nums[i])
        backtrack(i+1, subset)
        // Optional 3: for DFS that allows unlimited choice of the same number, start from the same position
        backtrack(i, subset)

        subset.remove(-1)
    }
}
```

# Graph

- visited

# misc

### Hash Table(dictionary):

- operation: insert/delete/search
- average search time O(1)
  - worst case O(n)
- Hash Table vs dictionary
  - dictionary: Generic way to map key-value pair. might have different implementation
  - hash table: it's a specific implementation of dictionary

-----TODO
理解思想即可
基本没有实现/算法需求

### Stack

- append to the end, pop at the end
- traverse: process item when it is popped
