- react components start with Captial letter
- when updating a state require accessing the state's current value, do not access the state directly. Instead use a callback to access the state. This avoid bugs caused by asynchrouous accessing the state
```js
const [event, steEvents] =  useState([
    {title: "Lorem ipsum dolor sit amet consectetur", id: 1},
    {title: "adipisicing elit. Praesentium fugiat, ", id: 2},
    {title: "iste odit repellendus delectus", id: 3}
])

// don't do this
const handleClick = (id) => {
    setEvents(events.filter((event) => {        // by the time events.filter() run the events container may have being different
        return id !== event.id
    }))
}

// do this
const handleClick = (id) => {
    setEvents((prevEvents) => {         // the callback ensures the prevEvents is up to date
        return prevEvents.filter((event) => {        
            return id !== event.id
        })
    })
}
```

- you can deconstruct a props
```js
<Title maiin_title="Your Local Event" subtitle="latest events"/>
export default Title({maiin_title, subtitle}) {
    ...
}
```

- every components must be contained in a single \<div>, but using fragment can escape that

- when to add cleaning up function in Hooks: whenever a hook is asynchronous, and the hook will be used to update components (inside an component)