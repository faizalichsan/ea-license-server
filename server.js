const express = require('express');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/validate', (req, res) => {
  const account = req.body.account;
  if (!account || isNaN(account)) {
    return res.send("INVALID");
  }

  const licenses = JSON.parse(fs.readFileSync('licenses.json', 'utf8'));
  const license = licenses[account];

  if (!license) {
    return res.send("INVALID");
  }

  const today = new Date().toISOString().split('T')[0];
  if (today > license.expire) {
    return res.send("EXPIRED");
  }

  return res.send("VALID");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
