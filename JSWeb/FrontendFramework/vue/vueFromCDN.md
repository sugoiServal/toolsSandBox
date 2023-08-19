- Using Vue from CDN

```html

```

- In-DOM Root Component Template
    - it is `common Vue+CDN practice` to use In-DOM Root Component. ie define template and data inside createApp({})
    - instead of write a separate root template, writing root template directly inside the createApp

```html
<!--  index.html -->
<div id="app"></div>
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
<script src="app.js"></script>
<div id="app">
    <p>{{ count }}</p>
    <button @click="count++">IncreaseCount</button>         
    <button @click="decreaseCount">DecreaseCount</button>         
</div>
```
```js
// app.js, define your template, data, methods
const app = Vue.createApp({
    // Can also define template here, but can only in one place
    // template: '<button @click="count++">{{ count }}</button>',     

    // data
    data() { return {
        count: 0,
    }},
    methods: {
        decreaseCount() {
            this.count--;
        }
    }
})
app.mount('#app')
```