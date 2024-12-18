const express = require('express');
const app = express();
const morgan = require('morgan');

app.use(express.json())

morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let persons = [
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: "1",
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: "2",
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: "3",
  },
  {
    name: "Arto Hellas",
    number: "040-1234567",
    id: "4"
  },
];

const cors = require('cors');
app.use(cors());

app.get('/', (request, response) => {
  response.send('<h1>The is the API main page</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => Number(n.id)))
    : 0
  return String(maxId + 1)
}

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing'
    });
  }

  if (persons.some(person => person.name === body.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  persons = persons.concat(person);
  response.json(person);
});


app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  const person = persons.find(person => person.id === id);
  if (person) {
      response.json(person);
  } else {
      response.status(404).end();
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

app.get('/info', (request, response) => {
  const numEntries = persons.length;
  const currentTime = new Date();
  
  response.send(`
    <p>Phonebook has info for ${numEntries} people</p>
    <p>${currentTime}</p>
  `);
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
