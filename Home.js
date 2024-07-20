import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [draggedTask, setDraggedTask] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/tasks');
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const onDragStart = (task) => {
    setDraggedTask(task);
  };

  const onDrop = (column) => {
    if (draggedTask) {
      const updatedTask = { ...draggedTask, column };
      axios.put(`http://localhost:5000/api/tasks/${draggedTask.id}`, updatedTask)
        .then(response => {
          setTasks(tasks.map(task => task.id === draggedTask.id ? response.data : task));
          setDraggedTask(null);
        })
        .catch(error => console.error('Error updating task:', error));
    }
  };

  const columns = [
    { name: 'TODO', key: 'todo' },
    { name: 'IN PROGRESS', key: 'inprogress' },
    { name: 'DONE', key: 'done' },
  ];

  return (
    <div className="home-container">
      <div className="header">
        <button className="logout-button">Logout</button>
      </div>
      <div className="task-board">
        {columns.map(column => (
          <div
            key={column.key}
            className="column"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => onDrop(column.key)}
          >
            <h3>{column.name}</h3>
            <div className="tasks">
              {tasks.filter(task => task.column === column.key).map(task => (
                <div
                  key={task.id}
                  className="task"
                  draggable
                  onDragStart={() => onDragStart(task)}
                >
                  <h4>{task.title}</h4>
                  <p>{task.description}</p>
                  <div className="task-actions">
                    <button>Edit</button>
                    <button>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
