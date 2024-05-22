import fetch from 'node-fetch';
import express from 'express';
import FormData from "form-data";
const app = express();
const PORT = process.env.PORT || 5001

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

app.get('/', (req, res) => {
  res.send('Klinkov Cryptocloud Hadler');
});

app.post('/cryptocloud_postback', (req, res) => {
  const { action, key, params } = req.body;
  const decodedString = atob(params)
  console.log(decodedString);
  const updatedParams = JSON.parse(decodedString)
  delete(updatedParams.deal.deal_status)
  updatedParams.deal.deal_is_paid = '1'
  updatedParams.deal.payments_type = 'OTHER'
  console.log(JSON.stringify(updatedParams));
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
    response.json().then((_json) => {
      res.json({ message: 'Postback received' });
    })
  })
})

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
