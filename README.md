# todoAPI

Awesome todo API

## How to

Node.js is required

Run the following in your terminal:
``` sh
node server.js
```

Server runs on port 5001.
Connect via http://localhost:5001/

## Usage

The following are examples with [Curl](https://github.com/curl/curl)

### Get all todos

``` sh
$ curl -X GET http://localhost/todos
[
  {
    "id":1,
    "done":...,
    "text":"..."
  },
  ...
  {
    "id":30,
    "done":...,
    "text":"..."
  }
]
```

### Get a single todo

``` sh
$ curl -X GET http://localhost/todos/1
```

### Add new todo

``` sh
$ curl -X POST -H "Content-Type: application/json" -d "{"text": "yee"}" http://localhost:5001/todos

{
	"id":31,
	"done":false,
	"text":"yee"
}
```

### Updating a todo

``` sh
$ curl -X PUT -H "Content-Type: application/json" -d "{"id:": 7, "done": true, "text": "foo"}" http://localhost:5001/todos/31

{
  "id":7,
  "done":true,
  "text":"foo"
}
```

``` sh
$ curl -X PATCH -H "Content-Type: application/json" -d "{false}" http://localhost:5001/todos/7

{
  "id":7,
  "done":false,
  "text":"foo"
}
``` 
### Deleting a todo

``` sh
$ curl -X DELETE http://localhost:5001/todos/7
```

## All available routes

### GET:

- /todos (get all todos)
- /todos/:id (get specific todo based on id)

### POST:

- /todos

### PUT,PATCH

- /todos/:id

### DELETE

- /todos/:id
