# insertion sort
## type: brute force
- worst case $O(N^2)$
   
>I: A[1..n]

>O: A[1..n] sorted (incr)

```js
for (let i = 1; i < D.length; i++) {
  const key = D[i];
  let j;
  for (j = i - 1; (j >= 0) && (D[j] > key); j--) {
    D[j + 1] = D[j];
  }
  D[j + 1] = key;
}
```

- 将链表划分为2块，前半为有序区后半为无序区。算法的目的是由初始：len==1 增长有序区，每次从无序区添加一个element将它插入到有序区中正确的位置。

```js
insertion sort()
    for: D[i], i == 2 to D.len
        将D[i]插入到有序区中正确的位置()
```
- 将D[i]插入到有序区中正确的位置(), 是通过将D[i]与之前有序区的, 由大到小每一个Element进行比较。如有序区中比较对象较大，将该对象向右移一位。停止条件：D[i]正确的位置找到（aka序区中比较对象较小）。之后将D[i]插入正确的位置
```js
将D[i]插入到有序区中正确的位置()
    for: D[j], j == i-1 to 0
        terminate when: 
            D[j] <= D[i]  
            OR j == 0     
        move value of D[j] to D[j+1]
    set D[j+1] to D[i]
```

# merge sort
## type: Divide n Conquer