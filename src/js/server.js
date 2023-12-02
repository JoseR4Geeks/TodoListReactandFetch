const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors());

let todos = [];

app.get('/', (req, res) => {
  res.send('Welcome to the TodoList API!');
});

app.get('/tasks', (req, res) => {
  res.json({ tasks: todos });
});

app.post('/tasks', (req, res) => {
  const { text } = req.body;
  const newTask = { id: todos.length + 1, text };
  todos.push(newTask);
  res.json({
    success: true,
    message: 'Task added successfully',
    taskAdded: newTask,
  });
});

app.delete('/tasks/:taskId', (req, res) => {
  const taskId = parseInt(req.params.taskId, 10);
  todos = todos.filter((task) => task.id !== taskId);
  res.json({ success: true, message: 'Task deleted successfully' });
});

app.delete('/tasks', (req, res) => {
  todos = [];
  res.json({ success: true, message: 'All tasks deleted successfully' });
});

const allowedOrigins = ['http://localhost:3000'];

app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  })
);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
