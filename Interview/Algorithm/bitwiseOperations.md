# bit operators

- [REF](https://www.baeldung.com/java-bitwise-operators)
- performing the manipulation of `int`

  - `int`: char, short, int, long
  - extension usage: Binary indexed tree

- why use bit operators
  - Speed: Bitwise operations are much faster than arithmetic operations
  - Space Optimization: Bitwise operations can be used to store multiple values in a single variable
  - Application Requirement: cryptography, error detection, compression, Securities.

```java
// logic operators and bit shift can use the assign opeator
int a = 5;
a |= 7;
a >>= 1;
```

### binary number basic

- types of int

  - uint32: Unsigned Integers: non negative, [0, 2^32-1] for 32bit
  - int32: signed int, at least 1 bit used for sign. in range [-2^31, 2^31-1] for 32bit
  - int64: signed int, at least 1 bit used for sign. in range [-2^63, 2^63-1] for 64bit

- Negative Integers representation: `2's complement`
  - find the positive binary number, use one more 0 to the left (12:= 01100)
  - flip all bits (10011)
  - add 1 (10100)
  - fill every bits to the left with 1 (1111111111110100)

```go
-12 // 1111111111110100, 16bit
-128 // 1111111110000000, 16bit
0 // 0000000000000000, 16bit
-2147483648 = -2^31  // 10000000000000000000000000000000, 32bit, 2^31, smallest negative int32 (MinInt32)
2147483647 = 2^31-1  // 01111111111111111111111111111111, 32bit, 2^31-1, largest int32 (MaxInt32)
```

### Bitwise operator

- Bitwise OR `|`

```java
int a = 5 = 0101 //(In Binary, skip first 28 bits)
int b = 7 = 0111 //(In Binary, skip first 28 bits)
    a | b = 0111 // 7
```

- Bitwise AND `&`

```java
a = 5 = 0101 //(In Binary, skip first 28 bit)
b = 7 = 0111 //(In Binary, skip first 28 bit)
a & b = 0101 // 5
```

- Bitwise XOR `^`: mark 1 for all different places
  - 1 if bits are different
  - 0 if bits are the same
- XOR is able to eliminate pair of repeated number in an array (Leetcode 136, 268)

```java
a = 5 = 0101 //(In Binary, skip first 28 bit)
b = 7 = 0111 //(In Binary, skip first 28 bit)
a ^ b = 0010 // 2

// properties
  // for any integer a
  a ^ a == 0
  a ^ 0 == a
  // Commutativity and Associativity
  a ^ b = b ^ a
  a ^ b ^ c = (a ^ b) ^ c = a ^ (b ^ c) = (a ^ c) ^ b
```

- Bitwise NOT `~`

```bash
a = 5 = 00000000 00000000 00000000 00000101 (In Binary, 32 bits)
  ~ a = 11111111 11111111 11111111 11111010 # -6
```

### Bit-Shift Operator:

- `>>` : shift bits to the right, for negative numbers (first bit is 1) fill 1s to the left. For positive numbers (first bit is 0) fill 0s to the left. (use `two's complement` negative system: binary -16 is: inverted binary 16 + 1)

  - `a >> k` Equivalent to `a / (2^k)`
  - `12 >> 2`: 01100 -> 00011 = 12 / (2^2) = 3
  - `-12 >> 2`: 10100 -> 11101 = -16 / (2^2) = -3

- `<<` : shift bits to left, fill 0s to the right.

  - `a << k` Equivalent to `a * (2^k)`
  - `5 << 2`: 101 -> 10100 = `5 * 2^2` = 20

- unsigned right shift (a >>> 3), less used
  - The empty spaces in the left are filled with 0 irrespective of whether the number is positive or negative.

# Applications

```java
// multiply/ division
  // Left shift (<<) can be used to multiply a number, by 2 ^ n.
  int result = 5 << 2;  // Equivalent to 5 * (2^2) = 20
  // Right shift (>>) can be used to divide a number, by 2 ^ n.
  int result = 16 >> 2;  // Equivalent to 16 / (2^2) = 4

// loop through the bits (count 1s in the bits)
int number = 6
int count = 0;
while number > 0 {
  count+= number&1
  number >>= 1;
}

// Check number features
  // Checking Even or Odd:
  (num & 1) == 0;  // number is even
  (num & 1) == 1;  // number is odd
  // Check if two numbers has different sign
  (x ^ y) < 0   // x and y have different sign
  (x ^ y) > 0   // x and y have same sign

// Setting/Clearing a Bit:
  // !!!!! Set the last '1' to '0'
  num &= (num - 1)
  boolean isPowerOf2 = (num & (num - 1)) == 0;   // Checking a positive number is power of 2:

  // Set the nth bit to 1:
  // num |= (1<<n-1)
  int num = 3;  // 011
  num |= (1 << 2); // 011 | 100 => 111, set third bit

  // Clear the nth bit (make it 0):
  // num &= (1<<n-1)
  num &= ~(1 << 1); // 011 & 01 => 001, clear second bit


// Swapping Values: Bitwise XOR (^) can be used to swap values without using a temporary variable.
a ^= b;
b ^= a;
a ^= b;

// string: switching between capital letter and smallcase letters
('d' ^ ' ') == 'D'
('D' ^ ' ') == 'd'
```
