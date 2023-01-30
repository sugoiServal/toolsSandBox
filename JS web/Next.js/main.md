## [Tutorial](https://www.youtube.com/watch?v=A63UxsQsEbU&list=PL4cUxeGkcC9g9gP2onazU5-2M-AzA8eBw) [code](https://github.com/iamshaunjp/nextjs-tutorial)
## [Document](https://nextjs.org/docs/)
- what it is: Framework for creating **pre-rendered static React website**, either SSR or SSG
  - Server Side Rendering(SSR): render React components in server 
  - Static site generation(SSG): Render React components in build time and deploy static HTML to server

- feature:
  - Let's compute overhead in the browser thus super fast
  - improved SEO(Search engine optimization)

## SSR and SSG
### Static site generation(SSG)
  - 网站的页面是在构建时生成的，除非您添加新内容或组件然后重建，否则它们的内容不会改变——如果您希望网站更新为新内容，则必须重建网站。
  - 适用于构建内容不经常更改的应用程序。博客或个人网站将是一个理想的用途。
  - pros: 
    - deployment to html hosts(not need a server)
    - 静态网站没有安全风险
    - fast
  - cons：
    - 如果需要更新内容就必须rebuild

### Server-Sider Rendering(SSR)

## Get Started
```bash
npx create-next-app myApp
npm run dev
npm run build
npm run start
```
### React
- package from react, react-dom can be used directly, for example
```js
import { useEffect, useState } from 'react'
```


### route
- Each page in Next application is a component inside a file in the `pages` folder
- a URL to a page is the directory to the specifics page file
  - a file named with 'index.js' is '/' in the corresponding url
  - other arbitrary file names eg: 'about.js' is '/about' in url
- url/file name/page components name are all case sensitive

### use links
- use `<Link>` component to link pages (in client via js, without requesting server)

```js
import Link from 'next/link'
export default function Navbar() {
  return (
    <nav>
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>  
    </nav>
  )
}
```
### redirect user
- use the `useRouter` hook
```js
import { useRouter } from 'next/router'
const router = useRouter()
router.go(-1)  // go back in history
router.go(+1)  // go forward in history
router.push('/')  // redirect to url

```

### Reusable components
- create and use components just like React
- Components should not be created in the `pages` folder

### Layout Component
- layout component is wrapper to components, Like group components together to reuse the layout
- That's not nextjs specific but a frequent used react design pattern
- eg>
```js
// _app.js
import Layout from '../components/Layout'
export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>  
  )
}

// ./components/Layout.js
import Navbar from './Navbar'
export default function Layout({children}) {
  return (
    <div className='layout-wrapper'>
        <Navbar/>
        {children}
    </div>
  )
}
```
### images and resources
- resources/images inside `/public` can be imported and used directly
- nextjs `Image` component, helps setup image width/height and various properties in-place easily

```js
import Image from 'next/image'
// image located in '/public' folder
<Image src={"/Snipaste_2023-01-11_13-59-32.png"} width={255} height={255} />
```
### meta data
- meta data can be edited inside `<Head>` component in any page
```js
import { Head } from 'next/document'
<Head>
  <title>NinjaList | Home</title>
  <meta name="keywords" content="ninjas" key={"title"} />
</Head>
```
- dont temper with `_document.tsx`


### customize 404 page
- create file `404.js` in `pages` to customize 404 page
- any 404 request will be direct to the page defined in `404.js`


### code splitting (not important)
- Only the javascript code that is needed by the current page is served to the user initially
- Only when used to navigate to **another page** for the first time will the js codes to that page be served 

## styling(css, without framework)

# Static Site Generation (SSG)
## fetching REST data
- In react app, data fetching is typically achieved through fetching hooks, Which is run by the browser
- since next everything is pre-rendered in server, We want to fetch data before the rendering
- `to do so, Define the fetching function outside of react functional components`

### getStaticProps
- [doc](https://nextjs.org/docs/basic-features/data-fetching/get-static-props)

> If you export a function called getStaticProps (Static Site Generation) from a page, Next.js will pre-render this page at build time using the props returned by getStaticProps. ... any props will be passed to the page component and can be viewed on the client-side in the initial HTML ... Make sure that you don't pass any sensitive information that shouldn't be available on the client in props

- getStaticProps `always runs on the server` and never on the client.
- 
```js
export const getStaticProps = async () => {
    const res = await fetch('https://jsonplaceholder.typicode.com/users')
    const data = await res.json();
    return  {
        props: { users: data }
    }
}

export default function index( props:object ) {
    const { users }= props
    return (
        <div>
            <h1>ALL Ninjas</h1>
            {users && users.map((user:object) => (
                <div key={user.id}>
                    <Link href={'/ninjas/'+ user.id}>  
                        <h3>{user.name}</h3>
                    </Link>
                </div>
            ))}
        </div>
    )
}
```

## Dynamic Pages (Static Site Generation)
### url parameters ('user/id')
- [video](https://www.youtube.com/watch?v=WPdJaBFquNc&list=PL4cUxeGkcC9g9gP2onazU5-2M-AzA8eBw&index=11)
- these pages content is data dependents (controlled by the data return by a REST api) 
- they generally have the same template to generate the page, only data is different
- Everything, every pages is still prendered in the server, after fetching the data in server

- use `[id].js` as page file name, use bracket `[]` to tell next that is url parameterized page. `id` or any other name is arbitrary
  - the parameter field is append to the last level of url **(the folder name)**

### getStaticPaths
- [doc](https://nextjs.org/docs/basic-features/data-fetching/get-static-paths)
> Export a function called getStaticPaths (Static Site Generation) from a page that uses dynamic routes

> If a page has Dynamic Routes and uses getStaticProps, it needs to define a list of paths to be statically generated. `The list of paths defined a set of pages to be generated (for each path)` ... Next.js will statically pre-render all the paths specified by getStaticPaths.

- getStaticPaths also run on build time in server

- `getStaticPaths` requires using `getStaticProps` to get data for each page
  - for each page in `paths`, `getStaticProps` will be run one time
  - `getStaticProps` have access to the id of current page (in `paths`) through a parameter `context` 
```js
// pages/posts/[id].js

// formulate the return as this
export async function getStaticPaths() {
  return {
    //!! the field `id` should be matching `[id].js`
    paths: [{ params: { id: '1' } }, { params: { id: '2' } }],
    fallback: false, // can also be true or 'blocking'
  }
}

// an example:
export const getStaticPaths = async()=>{
  const res = await fetch('https://jsonplaceholder.typicode.com/users')
  const data = await res.json();
  const paths = data.map(user=>{
    return {params:{id: user.id.toString()}}
  })
  return {
    paths: paths,
    fallback: false  
  }
}

// `getStaticPaths` requires using `getStaticProps` to get data for each page
export async function getStaticProps(context) {
  return {
    const id = context.params.id;
    // fetch data of the 'id'...
    props: { post: {} },
  }
}

export default function Post({ post }) {
  // Render post...
}

```

# Server Side Rendering
### getServerSideProps
### getInitialProps)