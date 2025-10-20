import express from 'express';
const PORT = process.env.PORT || 3001;

const app = express();

//Middleware to parse JSON bodies in requests'
app.use(express.json());

// Middleware to log various examples of request properties
app.use((req, res, next) => {
  console.log(`${req.method} request made at ${req.url} -- Body: ${JSON.stringify(req.body)} `);
  next();
});

app.get('/', (req, res) => {
  res.send('Hello, World!');
});
app.get('/about', (req, res) => {
  res.send('About Page');
});
app.post('/submit', (req, res) => {
  res.send('Form Submitted');
});
app.put('/update', (req, res) => {
  res.send('Update Successful');
});
app.delete('/delete', (req, res) => {
  res.send('Delete Successful');
});


// --- Simple in-memory Employees API (CRUD) ---
let employeesList = [];

// Get all employees
app.get('/api/employees', (req, res) => {
  res.json(employeesList);
});

// Create an employee
app.post('/api/employees', (req, res) => {
  const { employee_id, name, email } = req.body;
  // Ensure employee_id is stored as a string
  const id = employee_id != null ? String(employee_id) : employee_id;
  const newEmployee = { employee_id: id, name, email };
  employeesList.push(newEmployee);
  res.status(201).json(newEmployee);
});

// Update an employee
app.put('/api/employees/:employee_id', (req, res) => {
  const { employee_id } = req.params;
  const { name, email } = req.body;
  const targetId = String(employee_id);
  const updatedEmployee = { employee_id: targetId, name, email };

  employeesList = employeesList.map(employee =>
    String(employee.employee_id) === targetId ? updatedEmployee : employee
  );

  res.json(updatedEmployee);
});

// Delete an employee
app.delete('/api/employees/:employee_id', (req, res) => {
  const { employee_id } = req.params;
  const targetId = String(employee_id);
  const originalLength = employeesList.length;
  employeesList = employeesList.filter(employee => String(employee.employee_id) !== targetId);

  if (employeesList.length === originalLength) {
    return res.status(404).json({ error: 'Employee not found' });
  }

  res.status(204).send();
});

// --- Error handling ---
// 500 handler (must have 4 params)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// 404 handler (last middleware)
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


export default app;