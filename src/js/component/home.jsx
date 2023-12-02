import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faTrashRestore } from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  const [inputValue, setInputValue] = useState("");
  const [todos, setTodos] = useState([]);
  const API_BASE_URL = "http://localhost:3001";

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`);
      const data = await response.json();
      setTodos(data.tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const addTask = async () => {
    try {
      await fetch(`${API_BASE_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: inputValue }),
      });

      await fetchTasks();
      setInputValue("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: "DELETE",
      });

      setTodos(todos.filter((item) => item.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const cleanAllTasks = async () => {
    try {
      await fetch(`${API_BASE_URL}/tasks`, {
        method: "DELETE",
      });

      setTodos([]);
    } catch (error) {
      console.error("Error cleaning all tasks:", error);
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
                if (e.key === "Enter") {
                  addTask();
                }
              }}
            />
          </li>
          {todos.map((item) => (
            <li key={item.id}>
              {item.text}
              <FontAwesomeIcon
                icon={faX}
                onClick={() => deleteTask(item.id)}
                style={{ color: "#ff0000" }}
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
