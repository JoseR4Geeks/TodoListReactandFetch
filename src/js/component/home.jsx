// Home.js
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { faTrashRestore } from '@fortawesome/free-solid-svg-icons';

const Home = () => {
  const [inputValue, setInputValue] = useState('');
  const [todos, setTodos] = useState([]);

  const API_BASE_URL = 'http://localhost:3001';

  useEffect(async () => {
    await fetchTasks();
    console.log('fetchTasks should have ran already');
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`);
      const data = await response.json();
  
      // MAPPING THE ARRAY OF OBJECTS
      const toDosTask = data.tasks.map((item) => {
        return { id: item.id, text: item.text }; // Include both task ID and text
      });
      setTodos(toDosTask);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };
  
  const addTask = async () => {
    try {
      await fetch(`${API_BASE_URL}/tasks`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task: inputValue }),
      });

      fetchTasks();
      setInputValue('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'DELETE',
      });

      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const cleanAllTasks = async () => {
    try {
      // Send a DELETE request to delete all tasks on the server
      await fetch(`${API_BASE_URL}/tasks`, {
        method: 'DELETE',
      });

      // Update the frontend by resetting the todos state to an empty array
      setTodos([]);
    } catch (error) {
      console.error('Error cleaning all tasks:', error);
    }
  };

  return (
    <div className="container">
      <h1>todos</h1>
      <div className="shadow">
        <ul>
          <li className="textBox">
            <input
              type="text"
              placeholder="What do you need to do?"
              onChange={(e) => setInputValue(e.target.value)}
              value={inputValue}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setTodos(todos.concat(inputValue));
                  setInputValue('');
                  addTask();
                }
              }}
            />
          </li>
          {todos.map((item, index) => (
          <li key={index}>
            {item.text}
            <FontAwesomeIcon
              icon={faX}
              onClick={() => {
                setTodos(
                  todos.filter((t, currentIndex) => index !== currentIndex)
                );
                deleteTask(item.id); // Pass the task ID to deleteTask
              }}
              style={{ color: '#ff0000' }}
              className="faIcon delete"
            />
          </li>
        ))}

        </ul>
        <div className="task">{todos.length} tasks left</div>
      </div>

      <div className="page"></div>
      <div className="page2"></div>
      <button onClick={cleanAllTasks} className="CleanAll btn btn-secondary">
        Clean All Tasks
        <FontAwesomeIcon icon={faTrashRestore} className="faIcon recycle" />
      </button>
    </div>
  );
};

export default Home;