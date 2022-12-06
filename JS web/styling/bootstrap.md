# What is bootstrap 5
- styling framework that includes primate components of navbars, modals, tabs...
- fully responsible
- CSS grid system for layouts
- easy customizable

### install
```bash
# https://getbootstrap.com/docs/5.2/getting-started/download/
npm install bootstrap@5.2.3
yarn add bootstrap@5.2.3
```
# ref
- [docs/4.0](https://getbootstrap.com/docs/4.0/getting-started/introduction/)

# just check the online doc!

# components
## container [link](https://getbootstrap.com/docs/4.0/layout/overview/#containers)
||||
|--|--|--|
|container|container|
|container-sm -md -lg -xl -xxl |different container size|
|container-fluid|always occupy 100% of view|

## Grid layout [link](https://www.youtube.com/watch?v=irfbn103AzE&list=PL4cUxeGkcC9joIM91nLzd_qaH_AimmdAR&index=7)
- minimal granularity is 12 columns per row 
```js
<div class="row">
    <div class="col">
        xxx
    </div>
    <div class="col">
        xxx
    </div>
    <div class="col-6"> // col that take up 6 spaces
        xxx
    </div>
</div>
```
- responsive column widths
  - make col take different space in different view size (eg: sm /md/ lg)
```js
<div class="row">
    <div class="col-sm-4 col-lg-6">
        xxx
    </div>
    <div class="col-sm-4 col-lg-3">
        xxx
    </div>
    <div class="col-sm-4 col-lg-3"> 
        xxx
    </div>
</div>
```

- justifying contents
  - specify how col elements arrange in a row if there are extra spaces
    - justify-content-end
    - justify-content-start (default)
    - justify-content-center 
    - justify-content-between 
```js
<div class="row justify-content-end"> //!
    <div class="col-3">
        xxx
    </div>
    <div class="col-3">
        xxx
    </div>
    <div class="col-3"> 
        xxx
    </div>
</div>
```  
## heading

||||
|--|--|--|
|h1|heading, bold|
|display-1|heading, unbold|



## button
- button class are designed to use with \<button> tag, but can also be used with \<a> or \<input>

||||
|--|--|--|
|btn-primary|set btn style filled|
|btn-outline-primary|set btn style outline (unfilled)|
|btn-lg|set btn size small|
|btn-sm|set btn size small|

- button group: a row of buttons without space in-between
```js
<div class="btn-group">
    <button class="btn"/>
    <button class="btn"/>
    <button class="btn"/>
</div>
```

# utilities

## positional
||||
|--|--|--|
|text-center|align to the center of line|
|text-end|align to the end of line|
|text-start(default)|align to the start of line|

## colors
- apply to 
  - text-, 
  - bg-(background),
  - btn
  - border
- TBD
  
||||
|--|--|--|
|-primary||
|-secondary||
|-info||
|-warning||
|-success||
|-danger||
|-muted||
|-white||
|-light||
|-dark||

## margin and padding
||||
|--|--|--|
|p-1 to p-5|small padding to large padding, all directional|
|m-1 to m-5|small margin to large margin, all directional|
|my-, mx-, py-, px-|margin/padding in x/y direction|
|mt-, mb-, ms-, me-(padding same logic)|margin single direction: top; bottom; s tart(left); end(right)|

## borders
||||
|--|--|--|
|border|all-directional border|
|border-top, border-end, border-bottom, border-start, |single-directional border|
|border-1 to border-5|border thickness, thin to thick|


## radius
||||
|--|--|--|
|rounded|round edges|
|rounded-pill|more rounded(pill shape) edges|

## box shadow
||||
|--|--|--|
|shadow-sm|small box shadow|
|shadow|larger box shadow|

## fonts elements
- font size

||||
|--|--|--|
|lead|\<p>, slightly bigger size|
|\<small>|\<p>, small size|

- font weight

||||
|--|--|--|
|fw-bold|font weight bold|
|fw-bolder|font weight, bolder|
|fw-light|font weight, light|

- font style

||||
|--|--|--|
|fst-italic|italic text|

- misc formats 

||||
|--|--|--|
|text-decoration-underline|重点线|
|text-decoration-line-through|删除线|

