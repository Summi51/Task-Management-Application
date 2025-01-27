import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function UserDashboard() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user tasks when the component is mounted
  useEffect(() => {
    if (!token) {
      alert("Please login first");
      navigate("/"); // Redirect to login if not authenticated
    } else {
      const fetchUserTasks = async () => {
        try {
          const response = await fetch("http://localhost:8000/tasks/user", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setTasks(data);
          } else {
            setError("Failed to fetch tasks.");
          }
        } catch (error) {
          setError("An error occurred while fetching tasks.");
        } finally {
          setLoading(false);
        }
      };

      fetchUserTasks();
    }
  }, [token, navigate]);

  // Function to update task status
  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8000/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === updatedTask.task._id
              ? { ...task, status: updatedTask.task.status }
              : task
          )
        );
      } else {
        setError("Failed to update task status.");
      }
    } catch (error) {
      setError("An error occurred while updating the task status.");
    }
  };

  return (
    <div>
      {loading && <h2>Loading your tasks...</h2>}
      {error && <h2>{error}</h2>}

      {token && !loading && (
        <>
          <h1>Welcome to Your Dashboard</h1>
          <button onClick={() => navigate("/logout")}>Logout</button>

          {tasks.length > 0 ? (
            <div>
              <h2>Your Tasks:</h2>
              <ul>
                {tasks.map((task) => (
                  <li key={task._id}>
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>
                    {/* <p>Status: {task.status}</p> */}  
                    <p>Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
                    <p>Your Task Status: {task.assignedTo[0].status}</p>

                    {/* Dropdown to change task status */}
                    <select
                      value={task.assignedTo[0].status}
                      onChange={(e) =>
                        updateTaskStatus(task._id, e.target.value)
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="in progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>You have no tasks assigned.</p>
          )}
        </>
      )}
    </div>
  );
}

export default UserDashboard;
