import 'dotenv/config';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import axios from 'axios';
import uuidv4 from 'uuid/v4'
import models, { connectDb } from './models';
import routes from './routes';

const port = process.env.SERVER_PORT || 5000;
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
  name: "sess",
  secret: process.env.SECRET || "Testing Testing 1 2 3",
  signed: true,

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  sameSite: true,
}));

app.use(async (req, res, next) => {
  var datetime = new Date();
  req.session.user=req.session.user||{
    email:uuidv4(),
    anon: true,
  };
  req.context = {models};
  req.myData={};
  req.myData.info={anon: true};
  if(!req.session.user.anon){
    await req.context.models.User.findOne({
      email: req.session.user.email,
    }).then((user)=>{
        if(user!==null){
            var datetime = new Date();
            req.context.user=user._id;
            console.log(`${user.email} has reconnected with intent to ${req.method} with ${req.originalUrl} @ ${datetime.toLocaleString()}`);
            let userInfo= {
                email: user.email,
                username: user.username,
                createdAt: user.createdAt,
                anon: false,
            };
            req.myData.info=userInfo;
        }
    },(err)=>{return});
  }else{
    console.log(`${req.session.user.email} has connected with intent to ${req.method} with ${req.originalUrl} @ ${datetime.toLocaleString()}`);
  }
  next();
});

// Routes

//app.use('/api/session', routes.session);
//app.use('/api/messages', routes.message);

app.use('/api/users', routes.user);
app.use('/api/news', routes.news);
app.use('/api/maps', routes.maps);
app.use('/api/logout', routes.logout);
app.get('/api', (req, res) => {
    req.myData.message= "Connection established with database";
    return res.send(req.myData);
});

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
  // Add production middleware such as redirecting to https
  // Express will serve up production assets i.e. main.js
  app.use(express.static(__dirname + '/client/build'));
  // If Express doesn't recognize route serve index.html
  app.get('*', (req, res) => {
      res.sendFile(
          path.resolve(__dirname, 'client', 'build', 'index.html')
      );
  });
}

connectDb().then(async () => {
  /*
    if(process.env.EraseDatabaseOnSync === 'true'){
        await Promise.all([
          models.User.deleteMany({}),
          models.Message.deleteMany({}),
          models.News.deleteMany({}),
        ]);
    }
    await Promise.all([
      //models.Timeline.deleteMany({}),
    ]);
    //createUsersWithMessages();
    */
    
    setInterval(function(){updateNews();},300000);
    app.listen(port, () => console.log(`Gator app listening on port ${port}!`));
});

const updateNews= async () =>{
  let res = await axios.get(`http://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEWS_API_KEY}`).catch((err)=>{return});
  if(!res){
    console.log("update attempted: no new updates");
    return;
  }
  let data=res.data;
  let articles = data.articles || [];
  for(let i =0; i<articles.length;i++){
    let c = articles[i];
    let timestamp = new Date(c["publishedAt"]).getTime();
    let temp = new models.News({
      articleID: timestamp+c.source.name,
      source: c.source.name,
      author: c.author,
      title: c.title,
      description: c.description,
      url: c.url,
      urlToImage: c.urlToImage,
      publishedAt: c.publishedAt,
      content: c.content,
    });
    console.log("news library updated")
    temp.save(function(error) {return});
  }
}
const createUsersWithMessages = async () => {
  const user1 = new models.User({
    username: 'Dionis',
    email: 'dionis.wang@gmail.com',
    password: 'admin',
    createdAt: new Date(),
  });

  const message1 = new models.Message({
    text: 'Hello this is dionis',
    user: user1.id,
  });

  const message2 = new models.Message({
    text: 'Testing Testing 1 2 3',
    user: user1.id,
  });

  const message3 = new models.Message({
    text: 'I am just a test don\'t mind me',
    user: user1.id,
  });

  await message1.save();
  await message2.save();
  await message3.save();

  await user1.save();
};