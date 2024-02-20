const express = require('express');
const app = express();

/* GET home page. */
app.get('/', function(req, res, next) {
  res.render('kakaoMap.ejs', { title: 'Main' });
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'))

module.exports = app;

