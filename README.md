# todoAPI

Awesome todo API

## How to

Node.js is required

```
node server.js
```

Server runs on port 5001
Connect via http://localhost:5001/

### Get all todos

```js
fetch("http://localhost:5001/todos/")
  .then((res) => res.json())
  .then((json) => console.log(json));

//output
[
  {
  	id:1,
  	done:...,
  	text:'...'
  },
  /*...*/
  {
    id:30,
  	done:...,
  	text:'...'

  }
]
```

### Get a single todo


```js
fetch("http://localhost:5001/todos/1")
  .then((res) => res.json())
  .then((json) => console.log(json));
```

### Add new todo

```js
fetch("http://localhost:5001/todos/"), {
  method: "POST",
  body: JSON.stringify({
    text: "...",
  }),
})
  .then((res) => res.json())
  .then((json) => console.log(json));

/* will return
{
	id:31,
	done:false,
	text:'...'
}
*/
```

### Updating a todo

```js
fetch("http://localhost:5001/todos/1"), {
  method: "PUT",
  body: JSON.stringify({
  	id:7,
  	done:true,
  	text:'foo'
  }),
})
  .then((res) => res.json())
  .then((json) => console.log(json));

/* will return
{
    id:7,
  	done:true,
  	text:'foo'
}
*/
```

```js
fetch("http://localhost:5001/todos/7"), {
  method: "PATCH",
  body: JSON.stringify({
    done: false,
  }),
})
  .then((res) => res.json())
  .then((json) => console.log(json));

/* will return
{
    id:7,
  	done:false,
  	text:'foo'
}
*/
```
### Deleting a todo

```js
fetch("http://localhost:5001/todos/7"), {
  method: "DELETE",
});
```

## All available routes

###GET:

- /todos (get all products)
- /todos/1 (get specific todo based on id)

###POST:

- /todos

###PUT,PATCH

- /todos/1

###DELETE

- /todos/1
