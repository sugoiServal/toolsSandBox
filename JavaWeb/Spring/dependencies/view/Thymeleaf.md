# Thymeleaf: a simple UI library
- able to bind `Model` to `spring html template`  

### Expressions
```html
<!-- Variable -->
<td th:text="${grade}"></td> 
<td th:text="${grade.name}"></td> 

<!-- Link expression: specify an URL endpoint/path, eg. including external .css style-->
<link th:href="@{/grade-stylesheet.css}" rel="stylesheet">

<!-- Selection expression: select a field from previously bound object -->
<tr th:object="${grade}">
    <td th:text="*{name}"></td>
</tr>
```

### Thymeleaf conditions

```html
<!--  T/F/ternary -->
<p th:if="${age > 18}"> content </p>       <!--  render if true -->
<p th:unless="${age == 18}"> content </p>    <!--  render if false -->
<td th:text="${age > 18} ? 'val1' : 'val2'"> content </td>  <!--  ternary render  -->
<!--  switch -->
<div th:switch="${age}">
    <p th:case="'val1'">val1</p>
    <p th:case="'val2'">val2</p>
    <p th:case="*">anything</p>
</div>
```

### Thymeleaf Loops
- generate html from a collection
```html
<div th:each="entry : ${collection}">
    <td th:text="${entry.name}"></td>
</div>
```
### Thymeleaf utiizy classes (略)
- wide range of `functions` that can handle `attributes content`
```html
"${#class.method(target, other params)}"
```
### Form



