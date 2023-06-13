const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');


var items =["Buy Food", "Cook Food"];
var works =[];
app.get('/', (req,res)=>{
    const now = new Date().toLocaleDateString('en-us',{ weekday:"long", day: "numeric",month: "long"});
    res.render("list", { listTitle: now, newItem: items});

});

app.post('/', (req,res)=>{
    var item = req.body.todoItem;
    if(req.body.list === "Work"){
        works.push(item);
        res.redirect('/work')
    }else{
        items.push(item);
        res.redirect('/');
    }
});

app.get('/work', (req, res)=>{
    res.render("list", {listTitle: "Work List", newItem: works});
});

app.post('/work', (req, res)=>{
    const item = req.body.newItem;
    works.push(item);
    res.redirect('/work');
});





















app.listen(3000, ()=> console.log("server is running at port 3000"));
