const express = require('express');
const os = require('os');
const app = express();

const podName = os.hostname();
const startTime = new Date();

app.get('/', (req, res) => {
  res.send(`
    <h1>🚀 Kubernetes Load Balancing Demo</h1>
    <p><strong>Served by Pod:</strong> ${podName}</p>
    <p><strong>Container Start Time:</strong> ${startTime}</p>
  `);
});

app.listen(3000, () => {
  console.log(`App running on port 3000 - Pod: ${podName}`);
});