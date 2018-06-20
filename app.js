const express = require('express');
const request = require('request');
const app = express();

const requestData = new Promise((resolve, reject) => {
  return request('http://api.backcountry.com/v1/products/PAT01CQ', { json: true }, (err, req, res) => {
    err ? reject(err) : resolve(res);
  })
})

function composeData(res) {
  let data = { colors: {}, sizes: {} };
  res.forEach(p => {
    let productID, colorID, sizeID;
    [productID, colorID, sizeID] = p.id.split('-');
    data.colors[colorID] ? data.colors[colorID].push(sizeID) : data.colors[colorID] = [sizeID];
    data.sizes[sizeID] ? data.sizes[sizeID].push(colorID) : data.sizes[sizeID] = [colorID];
  });
  return data;
}

app.get('/', (req, res) => {
  requestData
    .catch((err) => {
      console.log(err)
    })
    .then(((data) => {
      return composeData(data.products[0].skus);
    }))
    .then((data) => {
      res.json(data);
    });
});

app.listen(3000);