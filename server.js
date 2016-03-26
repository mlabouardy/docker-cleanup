var express=require('express'),
    path=require('path'),
    api=require('./lib/endpoint'),
    bodyParser=require('body-parser'),
    cronjob=require('./lib/cronjob'),
    app=express();

if(process.env.REFRESH_TIME)
  app.set('REFRESH_TIME',process.env.REFRESH_TIME);
else
  app.set('REFRESH_TIME',10);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'public')));

api(app);
cronjob(app);

app.listen(3000,function(){
  console.log('Server listening ... ');
});
