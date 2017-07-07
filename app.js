const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const MethodOverride = require('method-override');
mongoose.connect('mongodb://jepa:demsammax123@ds143542.mlab.com:43542/jepa');
const ReportSchema = new mongoose.Schema({
  name_of_unit:String,
  name_of_head_unit:String,
  startDate: String,
  endDate: String
});
var Report = mongoose.model('report', ReportSchema);




app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'public/views'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(MethodOverride('_method'));


app.delete('/forms/:id',(req,res) => {
  Report.findByIdAndRemove( req.params.id, (err) => {
    if(err)
     console.log(err);
    else {
    res.redirect('/forms');
   }
  });
});
app.get('/forms/:id/edit', (req,res) => {
  Report.findById(req.params.id,(err,report) => {
    if (!err)
    res.render('reportView.ejs', { report: report, writable: true });
    else {
      console.log(err);
    }
  });
});
app.get('/forms/:id',(req,res) => {
  Report.findById(req.params.id,(err,report) => {
    if (!err)
    res.render('reportView.ejs', { report: report, writable: false });
    else {
      console.log(err);
    }
  });
});
app.get('/forms',(req,res) => {
  Report.find({},(err,reps) => {
    if(!err)
    res.render('reports.ejs', { reps: reps });
    else {
      console.log(err);
    }
  });
});
app.get('/form',(req,res) =>  {
  res.render('report.ejs');
});
app.get('/', (req,res) => {
  res.render('index');
});
app.post('/forms',(req,res) => {
   var OneReport = new Report( {
     name_of_unit:req.body.name_of_unit,
     name_of_head_unit: req.body.name_of_head_unit,
     startDate :req.body.startDate,
     endDate:req.body.endDate
   });
   OneReport.save((err) => {
     if(err) console.log(err);
   });
   res.redirect('/forms');
});
app.put('/forms/:id',(req,res) => {
  Report.findByIdAndUpdate(req.params.id, req.body, {new: true }, (err,report) => {
        if(err) console.log(err);
        else {
           res.redirect('/forms');
        }
      });
});


app.listen(8080);
