const http = require('http')
const fs = require('fs/promises')
const dataFile = './data.json'
let todos = []

const fm = {}
/*========== GET /todos ===========*/
fm['GET/todos'] = (arg, res, req) => {
  try {
    res.setHeader("Content-Type", "application/json")
    res.statusCode = 200
    res.end(JSON.stringify(todos))
  } catch (error) {
    handleError(error, res)
  }
}

/*========== GET /todos/:id ===========*/
fm['GET/todos/:id'] = (arg, res, req) => {
  try {
		const { todo } = findTodo(arg)
    res.setHeader("Content-Type", "application/json")
    res.statusCode = 200
    res.end(JSON.stringify(todo))
  } catch(error) {
    handleError(error, res)
  }
}

/*========== POST /todos ===========*/
fm['POST/todos'] = (arg, res, req) => {
  req.on("data", (chunk) => {
    try {
      const data = JSON.parse(chunk)
			validate(data, {task: 'new'})
  		const id = +(Date.now() + '' + parseInt(Math.random()*1000))
  		const newTodo = {id: id, done: false, ...data} //spread borde vara säkert
      console.log(newTodo)
      todos.push(newTodo)
      writeTodos()
      res.setHeader("Content-Type", "application/json")
      res.statusCode = 201
      res.end(JSON.stringify(todos.at(-1)))
    } catch (error) {
      handleError(error, res)
    }
  })
  req.on('end', () => {
    new Promise(_ => {if (!res.statusMessage) throw 'empty body'})
  		.catch(error => handleError(error, res))
  })
}

/*========== PATCH /todos/:id ===========*/
fm['PATCH/todos/:id'] = (arg, res, req) => {
  req.on("data", (chunk) => {
    try {
    	const { id, todo, index } = findTodo(arg)
      const data = JSON.parse(chunk)
      validate(data, {task: 'partial'})
			const newTodo = {...todo, ...data} //spread borde vara säkert
			todos[index] = newTodo;
      writeTodos()
      res.statusCode = 200
      res.end(JSON.stringify(newTodo))
    } catch(error) {
			handleError(error, res)
    }
  })
  req.on('end', () => {
    new Promise(_ => {if (!res.statusMessage) throw 'empty body'})
  		.catch(error => handleError(error, res))
  })
}

/*========== PUT /todos/:id ===========*/
fm['PUT/todos/:id'] = (arg, res, req) => {
  req.on("data", (chunk) => {
    try {
    	const { id, todo, index } = findTodo(arg)
      const data = JSON.parse(chunk)
      validate(data, {task: 'replace'})
			const newTodo = {...todo, ...data} //spread borde vara säkert
			todos[index] = newTodo;
      writeTodos()
      res.statusCode = 200
      res.setHeader("Content-Type", "application/json")
      res.end(JSON.stringify(newTodo))
    } catch(error) {
			handleError(error, res)
    }
  })
  req.on('end', () => {
    new Promise(_ => {if (!res.statusMessage) throw 'empty body'})
  		.catch(error => handleError(error, res))
  })
}

/*========== DELETE /todos ===========*/
fm['DELETE/todos/:id'] = (arg, res, req) => {
  try {
 		const { id } = findTodo(arg)
    todos = todos.filter(p =>  p.id !== id)
    writeTodos()
    res.statusCode = 200
    res.setHeader("Content-Type", "application/json")
    res.end(JSON.stringify(todos));
  } catch {
    handleError(error, res)
  }
}

const app = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  // res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  // res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, PATCH, DELETE, OPTIONS, POST, PUT");

  if (req.method === "OPTIONS") {
    res.statusCode = 200
    res.end()
    return;
  }

  const parts = req.url.split('/').filter(p => p !== '')
	const end = parts.length === 2
    ? '/:id'
    : parts.length > 2
    ? 'no end point'
		: ''
	const arg = end === '/:id' ? parts.pop() : ''
  const path = req.method + parts.reduce((s, p) => s + '/' + p, '') + end
	console.log(path)

	try {
  	if (!fm.hasOwnProperty(path)) throw 'no route'
  	fm[path](arg, res, req)
	} catch (error) {
  	handleError(error, res)
	}
})

const findTodo = (id) => {
  const parsedId = parseInt(id);
	if (isNaN(parsedId)) throw 'invalid id'
	const todo = todos.find(t => t.id === parsedId)
	if (todo === undefined) throw 'id not found'
	const index = todos.findIndex(t => t.id == id)
	// return [parsedId, todo, index]
	return {id: parsedId, todo: todo, index: index}
}

const errorResponse = {}
errorResponse['id not found']		= {code: 404, text : 'id not found'}
errorResponse['empty body']	 		= {code: 404, text : 'empty body'}
errorResponse['no route']				= {code: 404, text : 'no route'}
errorResponse['invalid id']			= {code: 400, text : 'invalid id'}
errorResponse['write error']		= {code: 500, text : 'io error'}
errorResponse['SyntaxError'] 		= {code: 500, text : 'bad json'}
errorResponse['invalid type'] 	= {code: 400, text : 'bad type'}
errorResponse['invalid prop'] 	= {code: 400, text : 'bad prop'}
errorResponse['invalid props'] 	= {code: 400, text : 'bad props'}
errorResponse['empty text']		 	= {code: 400, text : 'no text'}

const getErrorResponse = (error) => {
	console.log(error)
  return errorResponse.hasOwnProperty(error)
		? errorResponse[error]
    : {code: 500, text: 'unknown error'}
}

const handleError = (error, res) => {
  const {code, text} = getErrorResponse(error.name || error)
  res.statusCode = code
  res.end(text)
}

const	todoDescription = {
	id: 'number',
	text: 'string',
	done: 'boolean',
}

const validate = (data, options = {task: 'new'}) => {
	const keys = Object.keys(data)
	const descriptionKeys = Object.keys(todoDescription)
	if (!keys.every(prop => todoDescription.hasOwnProperty(prop))) {
    throw 'invalid prop'
  }
	if (!keys.every(prop => todoDescription[prop] === typeof data[prop])) {
    throw 'invalid type'
  }
  if (keys.includes('text') && !data['text'].length) {
    throw 'empty text'
  }
  if (options.task === 'new') {
  	if (keys.length === 1 && keys[0] === 'text') return true
  	throw 'invalid props'
  }
  if (options.task === 'partial') {
		return true
  }
  if (options.task === 'replace') {
  	if (keys.length === descriptionKeys.length)	return true
  	throw 'invalid props'
  }
  throw 'unknown'
}

const loadTodos = async _ => {
  try {
    const data = await fs.readFile(dataFile)
    // const data = await fs.readFile(dataFile, {flag: 'a'})
    const todos = await JSON.parse(data)
    return todos
  } catch (error) {
		console.log('creating file')
    await fs.writeFile(dataFile, JSON.stringify('[]')) //farligt
    return []
  }
}

const writeTodos = async _ => {
  try {
    const data = JSON.stringify(todos)
    await fs.writeFile(dataFile, data)
  } catch (error) {
    throw 'write error'
  }
}

const init = async () => {
  todos = await loadTodos()
  console.log(todos)
  app.listen(5001, () => {
  	console.log('Server is running')
  })
}

init()
