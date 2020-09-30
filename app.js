const express = require('express');
const Router = require('./routes/api');
const mongoose = require('mongoose');
const Lyrics = require('./models/lyrics')

const app = express();

app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.json());

// Access public folder from root
app.use('/public', express.static('public'));


const MONGODB_URI = 'mongodb+srv://Rajat:Rajat@123@cluster0.vu89l.gcp.mongodb.net/olyrics?retryWrites=true&w=majority';


//For set layouts of html view
app.set('view engine', 'ejs');
app.set('views', './views');

//routes
app.use('/', Router);


const port = process.env.PORT || 8000;


mongoose
  .connect(MONGODB_URI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then( async(result) => {
    app.listen(port, () => {
        console.log('server is listening on port: ' + port);
      });

  })
  .catch(err => {
    console.log(err);
  });




