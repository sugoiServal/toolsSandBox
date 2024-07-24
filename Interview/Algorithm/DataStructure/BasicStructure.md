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

  - sorted array or a monotonic function
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

### Interval Problems

- Interval Problems can usually be solved with sorting, or a Greedy algorithm
- two tricks:
  - sort interval array by start_i, secondary sort by end_i
  - draw and determine difference possible ways of interval overlapping

# Binary Tree

- tree facts
  - tree and graph difference: tree does not contain cycles
  - depth of binary tree: O(logn) for balanced trees, O(n) worst case

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

  - all nodes in the left are smaller than the root, and all nodes in the right are greater than the root
    - left subtree contains only nodes with values less than the root's value
    - right subtree contains only nodes with values greater than the root's value

- features:

  - `in-order traverse` of a Binary Search Tree returns an `ordered` sequence
  - `O(logn)` best case insertion/deletion and search for a value
  - In a standard BST each node has `unique value` in the tree.

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

### Greedy problems

- Greedy Problems are special case DP problems:

  - reduce the time complexity
  - only for problems that satisfy property: local optimal lead to global optimal

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

### Permutations

# Graph

- two implementations to graph (for avoiding repeated storage)
  - `adjacent list`: more space friendly for sparse graphs
    - more frequently seen in algorithm problems
  - `adjacent matrix`: not efficient for sparse graph (always `n*n` space),
    - pro 1: can know if i and j are connect in O(1)
    - pro 2: in graph theory some graph properties can be calculated through matrix arithmetic

```go
// 图节点的逻辑结构
type Vertex struct {
    id        int
    neighbors []*Vertex
}

// adjacent list: n*? for n vertex
// graph[i] store all neighbors of vertex i
var graph [][]int

// adjacent matrix: n*n for n vertex
// if vertex i connects to vertex j, matrix[i][j] = true
var matrix [][]bool
```

### DFS, BFS

- graph `traverse`: DFS, BFS + visited. O(n)

  - since graph typically contains cycles (you will go back to where you started), graph traverse need to `record visited`

```go
// - DFS of graph -
// https://labuladong.github.io/algo/images/%E8%BF%AD%E4%BB%A3%E9%81%8D%E5%8E%86%E4%BA%8C%E5%8F%89%E6%A0%91/1.gif

// vertex that has been visited (alt: hashmap)
var visited []bool

// simulate traverse logic (eg. cycle detection, track paths)
var onPath []bool

func traverse(graph Graph, s int) {
    // mark visited
    visited[s] = true

    // traverse logic
    onPath[s] = true

    for _, neighbor := range graph.neighbors(s) {
        if !visited[s]: traverse(graph, neighbor)
    }
    // undo travserse logic if necessary
    onPath[s] = false
}
```

- BFS: Queue TBD

## Cycle detection:

- based on DFS + trace, O(V+E)
- based on Union Find

### based on DFS + trace, O(V+E)

- use hashset or []bool `trace` to record nodes alone the visit trace: add at preorder, remove at postorder.

  - If a current node is already in `trace`, there is a cycle.

- use `visited` to reduce redundant traversal: when a DFS(node), we mark it as visited and next time we can skip it when visit it again

```go
func detectCycle(graph [][]int, node int, trace []bool, visited []bool) bool {
	// if a node is seen before, there is a cycle
	if trace[node] {
		return true
	}

	// skip node that has been DFS, and apparently doesn't detected a cycle
	if visited[node] {
		return false
	}

	// preorder
	trace[node] = true
	visited[node] = true
	for _, neighbor := range graph[node] {
		if detectCycle(graph, neighbor, trace, visited) {
			return true
		}
	}
	trace[node] = false
	return false
}
```

### based on Union Find

- `O(E * α(V))`, where α is the inverse Ackermann function, which grows very slowly.
- algorithm
  - add all node to Union Find data structure
  - for each edge,
    - check if the two nodes are already in the same Connect Component, if so, return true
    - otherwise connect the two nodes

## Topological Sort: based on DFS

- problem description

  - given a DAG, flatten it so that every edge is from left to right. Then the node order is topological sorted.
  - the order such that every nodes a node depends on must be traversed before the node.

- solution
  - `A cyclic graph cannot be topological sorted`. A DAG must be able to be topological sorted.
  - 1. `traverse the graph in postorder. 2. reverse the postorder traverse result` => topological sorted result.

```go
// reuse cycle detection algorithm, and add the postorder record
postorder = []int
for node in graph.nodes():
    if detectCycleAndSort(node, postorder, trace, visited) {
      return []int{}
    }
return reverse(postorder)


func detectCycleAndSort(node, postorder []int, trace []bool, visited []bool) bool {
	// if a node is seen before, there is a cycle
	if trace[node]: return true

	// skip node that has been DFS, and apparently doesn't detected a cycle
	if visited[node]: return false

	// preorder
	trace[node] = true
	visited[node] = true
	for neighbor in node.neighbors() {
		if detectCycle(neighbor, trace, visited) {
			return true
		}
	}
  // postorder add the node to answer: postorder
  postorder.append(node)
	trace[node] = false
	return false
}
```

### Union Find [ref](https://labuladong.github.io/algo/di-yi-zhan-da78c/shou-ba-sh-03a72/bing-cha-j-323f3/)

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

## Minimum Spanning Tree

- Minimum Spanning Tree

  - given an connected graph with weighted edges, and might contains cycles
  - generate a tree from a` subset of edges` in a graph, and `all nodes`, such that the `sum(weight(edge)) in the tree is minimized`
  - note that tree := a connected graph containing no cycles

- algorithms: Prim/ Kruskal

### Kruskal algorithm (Minimum Spanning Tree): Union find + Greedy

- Kruskal: Union find + Greedy algorithm:

```go
// Input: edges, nodes
unionFind.add(nodes)
edges.sort()
mstWeight = 0
for edge in edges {
  if unionFind.isConnected(edge.node1, edge.node2): continue
  else:
    unionFind.union(edge.node1, edge.node2)
    mstWeight+=edge.weight
}
```

### Dijkstra

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
