var Docker=require('./docker'),
    CronJob = require('cron').CronJob;

module.exports=function(app){
  var timeInterval='*/'+app.get('REFRESH_TIME')+' * * * * *';
  var job = new CronJob({
    cronTime: timeInterval,
    onTick: function() {
      console.log("Cleaning ...");
      Docker.cleanContainers(function(){
        Docker.cleanImages(function(data){
          console.log(data);
        });
      })
    },
    start: true,
    timeZone: 'America/Los_Angeles'
  });
  job.start();
}
