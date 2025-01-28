import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { Button,Checkbox, OutlinedInput, TextField, MenuItem, Select, InputLabel, FormControl, CircularProgress, Container, Grid, Typography, Box } from "@mui/material";

function AdminViewTasks() {
  const { token } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "pending",
    assignedTo: [{ userId: "", status: "pending" }], 
  });

  const [creatingTask, setCreatingTask] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  // Get Admin All Task
  const fetchTasks = async () => {
    try {
      const response = await fetch("https://task-management-application-orpin.vercel.app/tasks", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data, 'All Task')
        setTasks(data);
      } else {
        const errData = await response.json();
        setError(errData.message || "Failed to fetch tasks.");
      }
    } catch (err) {
      setError("An error occurred while fetching tasks.");
    } finally {
      setLoading(false);
    }
  };

  // Get all users with role 'user'
  const fetchUsers = async () => {
    try {
      const response = await fetch("https://task-management-application-orpin.vercel.app/auth/users", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data)
        setUsers(data.data); 

      } else {
        const errData = await response.json();
        setError(errData.message || "Failed to fetch users.");
      }
    } catch (err) {
      setError("An error occurred while fetching users.");
    }
  };

  // Delete Admin Any Task
  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`https://task-management-application-orpin.vercel.app/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setTasks(tasks.filter((task) => task._id !== taskId));
        message.success("Deleted Successfully");
      } else {
        const errData = await response.json();
        message.error(errData.message || "Failed to delete task.");
      }
    } catch (err) {
      setError("An error occurred while deleting the task.");
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setTaskData({
      ...taskData,
      [name]: value,
    });
  };
  
const [selectedMembersForTask, setSelectedMembersForTask] = useState([]);

const handleAssignedToChange = (event) => {
    const { value } = event.target; 
    setSelectedMembersForTask(typeof value === "string" ? value.split(",") : value);
    console.log(value, "value+++");
  };
  
const handleSubmit = async (e) => {
    e.preventDefault();
    setCreatingTask(true);
  
    try {
      const response = await fetch("https://task-management-application-orpin.vercel.app/tasks/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...taskData,
          assignedTo: selectedMembersForTask.map((userId) => ({
            userId,
            status: "pending", 
          })), 
        }),
      });
  
      if (response.ok) {
        setTaskData({
          title: "",
          description: "",
          dueDate: "",
          status: "pending", 
          assignedTo: [], 
        });
        setSelectedMembersForTask([]); 
        message.success("Task created successfully");
        fetchTasks(); 
      } else {
        const errData = await response.json();
        setError(errData.message || "Failed to create task.");
      }
    } catch (err) {
      setError("An error occurred while creating the task.");
    } finally {
      setCreatingTask(false);
    }
  };
  
  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <Container maxWidth="lg" style={{ paddingTop: "20px" }}>
      <Typography variant="h4" style={{ marginBottom: "40px" }} align="center">All Tasks</Typography>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => navigate("/logout")} 
        style={{ marginBottom: "20px", backgroundColor: "#1976d2" }} 
      >
        Logout
      </Button>

      <Box 
        style={{
          marginTop: "40px", 
          textAlign: "center", 
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)", 
          padding: "30px", 
          borderRadius: "10px", 
          backgroundColor: "#fff"
        }}
      >
        <Typography variant="h5" gutterBottom>Create New Task</Typography>
        <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={6}>
              <TextField
                label="Title"
                name="title"
                value={taskData.title}
                onChange={handleFormChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Description"
                name="description"
                value={taskData.description}
                onChange={handleFormChange}
                fullWidth
                multiline
                rows={4}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Due Date"
                name="dueDate"
                value={taskData.dueDate}
                onChange={handleFormChange}
                type="date"
                fullWidth
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>

    <FormControl fullWidth>
  <InputLabel id="select-members-label">Select Members</InputLabel>
  <Select
    labelId="select-members-label"
    multiple
    value={selectedMembersForTask}
    onChange={ handleAssignedToChange}
    input={<OutlinedInput label="Select Members" />}
    renderValue={(selected) =>
      selected
        .map((id) => users.find((user) => user._id === id)?.username)
        .join(", ")
    }
  >
    {users.map((user) => (
      <MenuItem key={user._id} value={user._id}>
        <Checkbox checked={selectedMembersForTask.includes(user._id)} />
        <Typography>{user.username}</Typography>
      </MenuItem>
    ))}
  </Select>
</FormControl>

            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={creatingTask}
                style={{ backgroundColor: "#1976d2" }} 
              >
                {creatingTask ? <CircularProgress size={24} /> : "Create Task"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>

      {/* Display Tasks */}
      {tasks.length === 0 ? (
        <p>No tasks available.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: "100%", marginTop: "40px" }}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Due Date</th>
              <th>Assigned To</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              task && task.title ? (
                <tr key={task._id}>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                  <td>
                    {task.assignedTo && task.assignedTo.length > 0 ? (
                      task.assignedTo.map((assignee) => (
                        <div key={assignee._id}>
                          <p>
                            <strong>Name:</strong> {assignee.userId?.username || "N/A"}
                          </p>
                          <p>
                            <strong>Email:</strong> {assignee.userId?.email || "N/A"}
                          </p>
                          <p>
                            <strong>Status:</strong> {assignee.status}
                          </p>
                          <hr />
                        </div>
                      ))
                    ) : (
                      <p>No assignees.</p>
                    )}
                  </td>
                  <td>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => deleteTask(task._id)}
                      style={{ backgroundColor: "#1976d2" }} 
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ) : null
            ))}
          </tbody>
        </table>
      )}
    </Container>
  );
}

export default AdminViewTasks;
