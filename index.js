import fetch from 'node-fetch';
import express from 'express';
import FormData from "form-data";
const app = express();
const port = 3000;

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  next();
});

// Добавляем middleware для обработки JSON
app.use(express.json());

// Добавляем middleware для обработки данных в формате x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.post('/cryptocloud_postback', (req, res) => {
  const { action, key, params } = req.body;
  const decodedString = atob(params)
  const updatedParams = JSON.parse(decodedString)
  updatedParams.deal.deal_status = "payed"
  const encodedUpdatedParams = btoa(JSON.stringify(updatedParams))
  let formData = new FormData();
  formData.append('action', action);
  formData.append('key', key);
  formData.append('params', encodedUpdatedParams);

  fetch(`https://edu.professorklinkov.com/pl/api/deals`, {
    method: "POST",
    body: formData,
    headers: {Accept: 'application/json; q=1.0, */*; q=0.1'}
  }).then((response) => {
    response.json().then((json) => {
      res.json({ message: 'Postback received' });
    })
  })
})

app.listen(port, () => {
  console.log(`Server app is starting at port${port}`);
});
