var Docker=require('./docker');

module.exports=function(app){

  app.get('/info',function(req,res){
    Docker.details(function(data){
      data.REFRESH_TIME=app.get('REFRESH_TIME');
      res.send(data);
    })
  })

  app.delete('/clean',function(req,res){
    Docker.cleanContainers(function(){
      Docker.cleanImages(function(data){
        res.send(data);
      });
    })
  });

  app.post('/save',function(req,res){
    app.set('REFRESH_TIME',req.body.time);
    res.status(201).send();
  })
}
