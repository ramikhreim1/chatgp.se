const express = require('express');
const morgan = require('morgan');
const compression = require('compression');
const bodyParser = require('body-parser')
const cors = require('cors')
var cookieParser = require('cookie-parser');
const apicache = require('apicache');
const { isLoggedIn } = require('./routes/auth/authJwt');
const getSitemap = require('./routes/utils/sitemap');
const cache = apicache.middleware;



require('dotenv-flow').config();

require('./routes/middlewares/mongo');

const app = express()
const port = process.env.PORT || 3080

app.use(compression({
  threshold: 0
}));
app.use(morgan('dev'))

app.use(cors({
  origin: ["http://localhost:3000", "https://www.chatgp.se", "https://www.jowry.click"],
  credentials: true
}))

app.use((req, res, next) => {
  if (req.originalUrl === '/api/stripe/webhook') {
    next();
  } else {
    express.json({ limit: '50mb' })(req, res, next)
  }
});
// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
// Add custom header middleware
app.use((req, res, next) => {
  res.setHeader('X-Instance-Id', process.env.NODE_APP_INSTANCE || '0');
  next();
});

//form-urlencoded
app.set('jwt', process.env.ACCESS_TOKEN_SECRET);

app.use('/api', require('./routes/api'))
app.get('/sitemap.xml', async (req, res) => {
  res.header('Content-Type', 'application/xml');
  res.send(await getSitemap())
})


// Default Index Page

app.get("/", isLoggedIn, (req, res) => {
  res.redirect("/tools")
  // console.log(req.user);
  // if (req.isLoggedIn) {
  // }else{
  //   res.redirect("/en")
  // }
})
// app.get("/landing/:lan/*", (req, res) => {
//   res.sendFile(__dirname + '/build/en/home.html')
// })
// app.get("/landing", (req, res) => {
//   res.sendFile(__dirname + '/build/en/home.html')
// })
app.use(cache('60 minutes'), express.static(__dirname + '/build'));
// Send all other items to index file


app.get('*', (req, res) => res.sendFile(__dirname + '/build/index.html'));

app.listen(port, () => {
  console.log(`Example app listening at ${process.env.DOMAIN}:${port}`)
})