import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { Box, Button, Typography, CircularProgress, Select, MenuItem, FormControl, InputLabel, List, ListItem, ListItemText, Divider } from "@mui/material";

function UserDashboard() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserTasks();
  }, []);

  // Fetch User Its Own Tasks
  const fetchUserTasks = async () => {
    try {
      const response = await fetch("https://task-management-application-orpin.vercel.app/tasks/user", {
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

  // Function to update task status
  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const response = await fetch(`https://task-management-application-orpin.vercel.app/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        message.success("Update Successfully");
        fetchUserTasks();
      } else {
        message.error("Failed to update task status.");
      }
    } catch (error) {
      setError("An error occurred while updating the task status.");
    }
  };

  return (
    <Box sx={{ padding: 2, backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      {token && !loading && (
        <>
          <Typography variant="h4" gutterBottom>
            Welcome to Your Dashboard
          </Typography>

          <Button variant="contained" color="primary" onClick={() => navigate("/logout")}>
            Logout
          </Button>

          {tasks.length > 0 ? (
            <div>
              <Typography variant="h6" gutterBottom>
                Your Tasks:
              </Typography>
              <List>
                {tasks.map((task) => (
                  <div key={task._id}>
                    <ListItem>
                      <ListItemText
                        primary={task.title}
                        secondary={
                          <>
                            <Typography variant="body2">{task.description}</Typography>
                            <Typography variant="body2">Due Date: {new Date(task.dueDate).toLocaleDateString()}</Typography>
                            <Typography variant="body2">Your Task Status: {task.assignedTo[0].status}</Typography>
                          </>
                        }
                      />
                      <FormControl sx={{ minWidth: 120 }} variant="outlined">
                        <InputLabel>Status</InputLabel>
                        <Select
                          value={task.assignedTo[0].status}
                          onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                          label="Status"
                        >
                          <MenuItem value="pending">Pending</MenuItem>
                          <MenuItem value="in progress">In Progress</MenuItem>
                          <MenuItem value="completed">Completed</MenuItem>
                        </Select>
                      </FormControl>
                    </ListItem>
                    <Divider />
                  </div>
                ))}
              </List>
            </div>
          ) : (
            <Typography>No tasks assigned.</Typography>
          )}
        </>
      )}
    </Box>
  );
}

export default UserDashboard;
