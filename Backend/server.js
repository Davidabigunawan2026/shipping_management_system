
const express = require('express');
const cors = require('cors');

require('./config/database');

const operatorRoutes = require('./routes/operatorRoutes');
const routeRoutes = require('./routes/routeRoutes');
const schedRoutes = require('./routes/SchedRoutes')



const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Ferry Booking API is running!'
  });
});


app.use('/api/operators', operatorRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/schedules', schedRoutes)


app.listen(PORT, () => {
  console.log(`Ferry Booking API running at http://localhost:${PORT}`);
});
