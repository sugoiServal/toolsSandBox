### java naming conventions 
- variables, methods: varName/myMethod
- classes interfaces, annotations, enums, records: TomcatServer, RestController
- constants: NESTED_PROPERTY_SEPARATOR


### editor
- auto import: SHIFT+ ALT + O
- Java code generator(vscode): generate boilerplate code


### how-tos 
- identity:
  - 使用 == 判断`两个reference是否指向同一对象`
  - 使用 Object.equal() 判断 `两个Object内容是否相同` (注意不同的类可能有不同的equal实现方法。
  - hashCode() get an `unique` id of the object

- `declare multiple varable` at a time
```java
int x = 5, y = 6, z = 50;  // declare multiple of same type in a line
x = y = z = 50;  // assign the same value to multiple
```

- `test null`: 
```java
int array[];
if (array == null) {
    System.out.println("Array unusable. Nothing to do.");
    return;
}
```

# Utility Classes
### UUID 
- `java.util.UUID` Class(universally unique identifier)
  - used generating unique identifiers/ session tokens/ object id..
  - UUIDs are generated using a combination of unique values, eg: current timestamp, MAC address...

```java
import java.util.UUID;
public class UUIDExample {
    public static void main(String[] args) {
        UUID uuid = UUID.randomUUID();
        System.out.println(uuid.toString());  // be96b784-0c13-4930-a0a4-d610a296b0df
    }
}
```

# misc
- 没有设置初始值时new object variable的默认值:
  - int: 0, double:0.0
  - bool: false
  - reference: null