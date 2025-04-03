
var MongoClient = require('mongodb').MongoClient;
const path = require("path");
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const URL = 'mongodb+srv://scheduler:grafix123@cluster0.f81tv.mongodb.net/?retryWrites=true&w=majority';
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.listen(process.env.PORT || 5000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });
app.use(express.static(__dirname + '/workassist'));
app.get('/*', function(req,res){
    res.sendFile(path.join(__dirname, 'workassist', 'index.html'))
    });

///
MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, }, function (err, db) {
    console.log("Connected correctly to server");
    if (err) throw err;
    var dbo = db.db("2adpro");    
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
    app.post("/getdata", (req, res) => {
        var query = { CreateBy: req.body.params.tokens.Email };
        dbo.collection('ScheduleData').find(query).toArray((err, cus) => {
            res.send(cus);
        });
    });
    app.post("/batchdata", (req, res) => {
        console.log(req.body);
        var eventData = [];
        var totalTime = [];
        if (req.body.action == "insert" || (req.body.action == "batch" && req.body.added.length > 0)) {
            (req.body.action == "insert") ? eventData.push(req.body.value) : eventData = req.body.added;
            for (var i = 0; i < eventData.length; i++) {
                var sdate = new Date(eventData[i].StartTime);
                var edate = new Date(eventData[i].EndTime);
                eventData[i].StartTime = (new Date(+sdate - (sdate.getTimezoneOffset() * 0)));
                eventData[i].EndTime = (new Date(+edate - (edate.getTimezoneOffset() * 0)));
                //totalTime = (eventData[i].StartTime - eventData[i].EndTime);
                dbo.collection('ScheduleData').insertOne(eventData[i]);
                console.log(totalTime);
            }
        }
        if (req.body.action == "update" || (req.body.action == "batch" && req.body.changed.length > 0)) {
            (req.body.action == "update") ? eventData.push(req.body.value) : eventData = req.body.changed;
            for (var i = 0; i < eventData.length; i++) {
                delete eventData[i]._id;
                var sdate = new Date(eventData[i].StartTime);
                var edate = new Date(eventData[i].EndTime);
                eventData[i].StartTime = (new Date(+sdate - (sdate.getTimezoneOffset() * 0)));
                eventData[i].EndTime = (new Date(+edate - (edate.getTimezoneOffset() * 0)));
                dbo.collection('ScheduleData').updateOne({ "Id": eventData[i].Id }, { $set: eventData[i] });
            }
        }
        if (req.body.action == "remove" || (req.body.action == "batch" && req.body.deleted.length > 0)) {
            (req.body.action == "remove") ? eventData.push({ Id: req.body.key }) : eventData = req.body.deleted;
            for (var i = 0; i < eventData.length; i++) {
                dbo.collection('ScheduleData').deleteOne({ "Id": eventData[i].Id });
            }
        }
        res.send(req.body);
    });
});
