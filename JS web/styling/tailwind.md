# [docs](https://tailwindcss.com/docs/installation)

- feature: 
   - 不像bootstrap, tailwind里面的基本模块style不是事先写好的也就是说用户可以深度的定制他想要使用的基本style模块
   - 相比bootstrap, tailwind提供的模块/utility class更加low level
   - 而在定义好基本模块的STYLE以后tailwind使用上和不像bootstrap很相似都是使用class来指定element的STYLE

- setup:
```
npx tailwindcss init --full 
```
- compile:
  - tailwind require initial compile, see [installation guide](https://tailwindcss.com/docs/installation) for detail 
```
npx tailwindcss -i build src/input.css -o output/output.css
```
# Basic
## color
https://tailwindcss.com/docs/customizing-colors

|||
|-|-|
|text-yellow-400|element-color-strength|

## text
### [font-size](https://tailwindcss.com/docs/font-size)

||
|-|
|text-sm|

### [font-weight](https://tailwindcss.com/docs/font-weight)
||
|-|
|font-light|

### [font-family](https://tailwindcss.com/docs/font-family)
 
||
|-|
|uppercase|
|font-sans|
|font-mono|
|font-serif|

### [Letter Spacing](https://tailwindcss.com/docs/letter-spacing#customizing-your-theme)

|||
|--|--|
|tracking-tight	|letter-spacing: -0.025em;|
|tracking-wide|letter-spacing: 0.025em;|

### [text align](https://tailwindcss.com/docs/text-align#setting-the-text-alignment)

|Class| Properties|
|--|--|
|text-left|	text-align: left;|
|text-center	|text-align: center;|
|text-right	|text-align: right;|

## image
- [object fit](https://tailwindcss.com/docs/object-fit):" Utilities for controlling how a replaced element's content should be resized.
## icons
- use third party icons with Tailwind [tutorial](https://www.youtube.com/watch?v=aNmBiqK2uQ0&list=PL4cUxeGkcC9gpXORlEHjc5bgnIi5HEGhw&index=14)
# Element
## margin/ padding/ border
[margin](https://tailwindcss.com/docs/margin)

[padding](https://tailwindcss.com/docs/padding)

[space between](https://tailwindcss.com/docs/space)

[width](https://tailwindcss.com/docs/width) [height](https://tailwindcss.com/docs/height)

[border-related](https://tailwindcss.com/docs/border-radius)

## box shadow
- [box shadow](https://tailwindcss.com/docs/box-shadow)

## display
- [display](https://tailwindcss.com/docs/display)

||
|--|
|flex|
|grid|
|block|
|inline|
|inline-block|
|hidden|
## position
- [position](https://tailwindcss.com/docs/position)
- [top-right-bottom-left](https://tailwindcss.com/docs/top-right-bottom-left)
 
## Effects
- [hover/focus](https://tailwindcss.com/docs/hover-focus-and-other-states)
```html
<button class="bg-violet-500 hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300 ...">
  Save changes
</button>
```
- [opacity](https://tailwindcss.com/docs/opacity)
## misc
|||
|-|-|
|curosr-pointer||
# flex/ grid
## [flex](https://www.youtube.com/watch?v=WK6u8YDYqak&list=PL4cUxeGkcC9gpXORlEHjc5bgnIi5HEGhw&index=7)
- flex container it's required to make the child flex
```html
<dev class='flex'>
    <childs/>
</dev>
```
|||
|-|-|
|justify-center/start/end|main axis|
|items-end|align in cross axis|
## grid
- [display: grid](https://tailwindcss.com/docs/display)
```html
<div class="grid grid-cols-4 gap-4">
    <div class="col-span-3">03</div>
    <div>01</div>
</div>
```
- [col](https://tailwindcss.com/docs/grid-template-columns) [row](https://tailwindcss.com/docs/grid-template-rows)
- [gap](https://tailwindcss.com/docs/gap)
- [col-span](https://tailwindcss.com/docs/grid-column) [row-span](https://tailwindcss.com/docs/grid-row) Determine how much col/row an element occupy
- [grid-flow-row, grid-flow-col](https://tailwindcss.com/docs/grid-auto-flow) controlling how elements in a grid are auto-placed.
# Application
### cards/ badges/ button
- there's no premade card/badege/ button classes out of the box but we can create them with elementary utilities easily
- TBD
# Responsive

- [responsive design](https://tailwindcss.com/docs/responsive-design)
- [tutorial](https://www.youtube.com/watch?v=VYFjvMfVv2o&list=PL4cUxeGkcC9gpXORlEHjc5bgnIi5HEGhw&index=8)

- prefix: sm, md, lg, xl...
  - means the following styling(after ':') only target screen size **larger than** the setting
  - aka: mobile-first approach

```html
<!-- Width of 16 by default, 32 on medium screens, and 48 on large screens -->
<img class="w-16 md:w-32 lg:w-48" src="...">
```

# Animation
### [transition](https://tailwindcss.com/docs/transition-property)
transition is used in conjunction with **hover:**
|||
|--|--|
|transition|requied for all transition|
|ease-linear|slow motion|
|ease-in|slow-in|
|ease-out|slow-out|
|duration-500|500ms time of animation|
|delay-100|delay 100ms before hover effect|

### transform:
- view transforms object is often used with animation, includes   
    - [scale](https://tailwindcss.com/docs/scale)
    - [rotate](https://tailwindcss.com/docs/rotate)
    - [translate](https://tailwindcss.com/docs/translate)
    - [skew](https://tailwindcss.com/docs/skew)

|||
|--|--|
|transform|is required for all transform| 
|scale-110||
|rotate-90||
|translate-x-2||
|skew-x-2||

# misc
### [Overflow](https://tailwindcss.com/docs/overflow)
- Utilities for controlling how an element handles content that is too large for the container.
- hidden: Use overflow-hidden to clip any content within an element that overflows the bounds of that element.
```html
<div class="overflow-hidden ..."></div>
```
### Dark Mode
- [dark mode](https://tailwindcss.com/docs/dark-mode)
# @apply
- @apply is used to create reproducible component (Reusing)
- [reuse](https://tailwindcss.com/docs/reusing-styles)
```css
<!-- in src/style.css -->
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn-primary {
    @apply py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75;
  }
  .card {
    @apply rounded bg-white border-gray-200 shadow-md overflow-hidden relative;
  }

  .badge {
    @apply absolute top-0 ml-2 p-2 mt-2 bg-secondary-100 text-secondary-200 text-xs uppercase font-bold rounded-full;
  }
}
```
# custom config
[tutorial](https://www.youtube.com/watch?v=6UVQlB1eo5A&list=PL4cUxeGkcC9gpXORlEHjc5bgnIi5HEGhw&index=5)
- it is recommand to split config into two file 'tailwind.config.js' and 'tailwind-default.config.js' so that it is easy to see what are out of box and what are customized
- edit/extend to existing classes
```js
// tailwind.config.js
module.exports = {
  purge: [],
  theme: {
    extend: {
      colors: {
        primary: '#FF6363',
        secondary: {
          100: '#E2E2D5',
          200: '#888883',
        }
      },
      fontFamily: {
        nunito: ['Nunito']
      }
    },
  },
  variants: {},
  plugins: [],
}
```
- After editing the conflict you'd like to run the build command
```
npx tailwindcss -i build src/input.css -o output/output.css
```

### [use third-party custom font tutorial](https://www.youtube.com/watch?v=arfDRUIZOiw&list=PL4cUxeGkcC9gpXORlEHjc5bgnIi5HEGhw&index=6)
