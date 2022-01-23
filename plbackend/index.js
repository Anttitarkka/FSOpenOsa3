const { response } = require('express')
const express = require('express')
const app = express()
const morgan = require('morgan')
var time = require('express-timestamp')
const cors = require('cors')


app.use(cors())
app.use(time.init)
app.use(express.json())

morgan.token('body', (request) => JSON.stringify(request.body))


let persons = [
    { id:1, name: "Arto Hellas", number: "040-123456" },
    { id:2, name: "Ada Lovelace", number: "39-44-5323523" },
    { id:3, name: "Dan Abramov", number: "12-43-234345" },
    { id:4, name: "Mary Poppendieck", number: "39-23-6423122" }
]

app.get('/api/persons/:id', morgan('tiny'), (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
  })


app.get('/api/persons', morgan('tiny'), (request, response) => {
    response.json(persons)
  })

app.get('/info', morgan('tiny'), (request, response) => {
    const info = `<p>Phone book has ${persons.length} people</p>
    <p>${request.timestamp}</p>`
    response.send(info)
})

app.delete('/api/persons/:id', morgan('tiny'), (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

const generateId = () => {
    return Math.floor(Math.random() * 99999999)
}

app.post('/api/persons', morgan(':method :url :status :res[content-length] - :response-time ms :body'), (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({ 
            error: 'name missing' 
          })
    } else if (!body.number) {
        return response.status(400).json({ 
            error: 'number missing' 
          })
    } else if (persons.map(person => person.name).includes(body.name)) {
        return response.status(400).json({ 
            error: 'name must be unique' 
          })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)

    response.json(person)

})


const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
