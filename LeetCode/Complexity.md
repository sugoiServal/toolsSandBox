- To be an Algorithm
  - solve the problem
  - terminate
  - be Efficient => Order (O)
  - limit of effiency (P!=NP)

- Rules
  - Two different implementations of the same algorithm will not differ
in efficiency by more than some multiplicative constant.
# O-notation
![img](https://imgur.com/GOprVsk.jpg)

- 这里我们衡量函数（aka算法）$f$的时间复杂度

- 函数$g$是衡量的基准:
  - 通用的基准有：
   $O(1)(or O(c)) < O(logn)< O(n^{1/2})<O(n)<O(nlogn)<O(n^2)<O(n^3)<O(2^n)<O(n!)$
    - $O(logn)$和$(Onlogn)$中的底并不重要
    - 超过$O(2^n)$问题成为polynominial

- $n$可以理解为问题的规模
- O-notation当问题的规模超过某一个限度$k$, 算法$f$再坏也不会超过函数$g$ multiply a Constant $c$.
  - In other world the complexity of $f$ is limited by function $g$

# Limit Criterion
## two more notations
- $\Omega$ notation
   - basically means that even in the somewhat better cases, when problem size is big enough, the algorithm $f$ time must exceed criterion $g$
  
![a](https://imgur.com/tKLRsKc.jpg)

- $\Theta$ notation
  - basically means that the limit of time $f$ (when n approach +inf, basically means ANY input) can be squeezed to a function $g$

![a](https://imgur.com/ZRY3KnJ.jpg)

## the limit theorem
![a](https://imgur.com/OLz1jmp.jpg)

# unfolding