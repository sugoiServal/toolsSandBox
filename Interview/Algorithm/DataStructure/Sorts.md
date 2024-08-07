# quickSort(), in-place, average O(nlogn)

### QuickSort(A, left, right)

- input: list A, left, right 定义想要排序的 A 子数组区间
  - left = 0, right = len(A)-1 就是整个数组

### partition(A, left, right) -> mid

- 通过 partition 方法，在 A 中 [left, right] 区间找到一个归位元素 index mid: 使得 mid 满足
  - 对任意在 A[left, mid-1] 中元素 q, A[q] < A[mid]
  - 对任意在 A[mid+1, right] 中元素 q, A[mid] < A[q]
- 此时 mid 应该是在 output 的 sorted 数组中相同的位置： 归位

- partition 算法
  - A[mid] 使用的值是初始 A[right]的值 (pivot value)
  - 双指针算法：pEdit 和 pSearch
    - pSearch 每回合++寻找比 pivot 小的元素, 如果找到了就与当前的 pEdit 交换， 并且 pEdit++
    - pEdit 永远都指向 pivot 小的元素区域的最前端 (因为 pEdit 只有在 pSearch 找到的回合向前走)

```py
def partition(A, left, right):
    pivot = A[right]
    pEdit = pSearch = 0
    while (pSearch < right):
      if (A[pSearch] < pivot):
        swap (A[pEdit], A[pSearch])
        pEdit+=1
      pSearch+=1

    swap(A[pEdit], A[right])  # 最后使pivot归位
    return pEdit
```

### QuickSort(): divide and conquer

- divide: 通过 partition(A, left, right) 找到一个归位元素， 并且将 A 分解为 L1: [left, mid-1] L2: [mid+1, right]
- conquer: QuickSort(L1)和 QuickSort(L2)
- combine: 因为是原址排序并不需要 combine，每一次调用 QuickSort()都会有一个元素归位

```py
def QuickSort(A, left, right):
    if left >= right: return None
    mid = partition(A, left, right)
    QuickSort(A, left, mid-1)
    QuickSort(A, mid+1, right)
QuickSort(A, 0, len(A)-1)
```

### complexity:

最差 O(n^2)
平均 O(nlogn)
空间 O(1)

# mergeSort(), not in-place, O(nlogn)

- divide：divide probem by two half (left L1/right L2)
- conquer:
  - mergeSort(L1)
  - mergeSort(L2)
- Operation:

  - merge(L1, L2)

- T(n) = 2T(n/2) + O(n) ==> O(nlogn)
- Auxiliary Space: O(n)

```py
# also leetCode [21]
from math import floor
def mergeTwoSortedList(L1, L2):

  # 2个指针分别指向2个数组头，
  # 每次向output里面插入2个中较小的一个argmin， 并移动argmin的指针
  # 如果其中一个指针遍历完了就把另一个指针剩下的元素全部插入到output中

    p1 = p2 = 0
    output = []
    while (p1 < len(L1) and p2 < len(L2)):
        if (L1[p1] <= L2[p2]):
            output.append(L1[p1])
            p1+=1
        else:
            output.append(L2[p2])
            p2+=1
    if (p1 == len(L1)):
        output.extend(L2[p2:len(L2)])
    elif (p2 == len(L2)):
        output.extend(L1[p1:len(L1)])
    return output

def mergeSort(L):
    # unit case
    if(len(L)<=1): return L

    # divide
    mid = floor((0+len(L)-1)/2)
    L1 = L[0:mid+1]
    L2 = L[mid+1:len(L)]

    # conquer sub problem
    L1 = mergeSort(L1)
    L2 = mergeSort(L2)

    # combine solution
    L = mergeTwoSortedList(L1, L2)
    return L
```

# Bucket sort O(n + k), O(n)

- think a Bar chart.

  - Use an array `buckets` to store expandable lists, of elements in an interval (eg, for positive integer sort, buckets[0] for inteval (1,1), buckets[1] for (2,2),... buckets[100] for (99,99)),
  - then iterate over the input array and append element to the intervals's end (O(1))
  - finally append all non-empty arrays in `buckets` follow the index sequence

- key is to determine the number of buckets

- Bucket sort is most effective when the input is uniformly distributed over a range. It has a time complexity of O(n + k) and Space complexity of O(n). n is input size and k is the number of buckets.

```go
// A contain natural numbers
bucketSort(array A):

  // Determine the number of buckets
  num_buckets = max(A) - min(A) + 1

  // Create an array of empty buckets
  buckets = make([][]int, num_buckets)

  // Distribute elements into buckets
  for i from 0 to n - 1:
      buckets[A[i] - min_val].append(A[i])

  // Concatenate the sorted buckets to obtain the sorted array
  sorted_array = []int
  for i from 0 to num_buckets - 1:
      sorted_array.append(buckets[i])
```

# insertion sort (O(n^2)): brute force

- 将链表划分为 2 块，前半为有序区后半为无序区。算法的目的是由初始：len==1 增长有序区，每次从无序区添加一个 element 将它插入到有序区中正确的位置。

```js
insertion sort()
    for: D[i], i == 2 to D.len
        将D[i]插入到有序区中正确的位置()
```

- 将 D[i]插入到有序区中正确的位置(), 是通过将 D[i]与之前有序区的, 由大到小每一个 Element 进行比较。如有序区中比较对象较大，将该对象向右移一位。停止条件：D[i]正确的位置找到（aka 序区中比较对象较小）。之后将 D[i]插入正确的位置

```js
将D[i]插入到有序区中正确的位置()
    for: D[j], j == i-1 to 0
        terminate when:
            D[j] <= D[i]
            OR j == 0
        move value of D[j] to D[j+1]
    set D[j+1] to D[i]
```

```java
// Java program for implementation of Insertion Sort
public class InsertionSort {
	/*Function to sort array using insertion sort*/
	void sort(int arr[])
	{
		int n = arr.length;
		for (int i = 1; i < n; ++i) {
			int key = arr[i];
			int j = i - 1;

			/* Move elements of arr[0..i-1], that are
			greater than key, to one position ahead
			of their current position */
			while (j >= 0 && arr[j] > key) {
				arr[j + 1] = arr[j];
				j = j - 1;
			}
			arr[j + 1] = key;
		}
	}
};
```
# 选择排序 selectionSort()
- 每轮归位一个elem。扩张sorted subarray.
- 每轮scan unsorted， 在unsorted中寻找最小元素（从左到右），之后与unsorted[0] 交换， 并扩张sorted, shrink unsorted
- complexity: n*(n+1)/2
```java
// check not null, etc
int n = arr.length
// expand sorted
for (i from 0 to n-1) {
  // find the argmin in unsorted (arr[i+1:])
  int argmin = i; // argmin is the start of the current unsorted
  for (j from i+1 to n-1) {
    if (arr[j] < arr[argmin]) {
      argmin = j;
    } 
  }
  // swap j and argmin
  int temp = arr[j];
  arr[j] = arr[argmin];
  arr[argmin] = temp;
}
```

# 冒泡排序 bubbleSort() 
- 从最大（最右）侧开始扩张 sorted subarray
  - 有序区大小 i from 0 to n-1
  - 无序区 idx j from 0 to n-1-i
- 不断地遍历无序区，只要j and j+1有顺序不同，就进行交换. 一次遍历后必可以使有序区扩张1
- 如果在一次外层循环中没有进行任何交换操作，说明数组已经是有序的，因此可以提前结束排序。

```java
// check not null, etc
static void bubbleSort(int[] arr) {
    if (arr == null || arr.length == 0) {
        return;
    }
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        boolean swapped = false;
        for (int j = 0; j < n - 1 - i; j++) { // 使用 < n-1 是因为要access arr[j+1], 如使用 < n 会溢出
            if (arr[j] > arr[j + 1]) {
                // swap the two and mark swapped
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = true;
            }
        }
        if (!swapped) {
            return;
        }
    }
}
```

# heapSort()

see [here](../DataStructure/AdvStructures.md#Heap)
