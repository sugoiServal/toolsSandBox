- Using Vue from CDN

```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
```

- In-DOM Root Component Template
    - `a common Vue+CDN practice`
    - instead of write a separate root template, writing root template directly inside the createApp

```js
// html
<div id="app"></div>

// main.js
import { createApp } from 'vue'

const app = createApp({
    // template
    template: '<button @click="count++">{{ count }}</button>',
    // data
    data() { return {count: 0}}
})

app.mount('#app')
```