const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});

const itemsSchema = new mongoose.Schema({
    name: String
});

const listScema = new mongoose.Schema({
    name: String,
    items: [itemsSchema]
});

const Item = mongoose.model("Item", itemsSchema); //collection
const List = mongoose.model("List", listScema);

const item1 = new Item({
    name: "Buy Food"
});

const item2 = new Item({
    name: "Cook Food"
});
const item3 = new Item({
    name: "Eat Food"
});
const defualtItems = [item1, item2, item3];




var items =["Buy Food", "Cook Food"];
var works =[];
app.get('/', (req,res)=>{
    const now = new Date().toLocaleDateString('en-us',{ weekday:"long", day: "numeric",month: "long"});
    Item.find({}).then((foundItems)=>{
        if(foundItems.length === 0){
            Item.insertMany(defualtItems).then(function(){
                console.log("Success");
            }).catch(function (err){
                console.log(err);
            });
            res.redirect("/");
        }else{
            res.render("list", { listTitle: now, newItem: foundItems});
        }
    }).catch((err)=> console.log(err));
});

app.get('/:customListName', (req,res)=>{
    const customListName = req.params.customListName;
    List.findOne({name: customListName})
    .then((foundList)=>{
        if(foundList){
            res.render(`list`, { listTitle: foundList.name, newItem: foundList.items});
        }else{
            const list = new List({
                name: customListName,
                items: defualtItems
            });
            list.save();
            res.redirect("/"+ customListName);
        }

    })
    .catch((err)=> console.log(err));
})

app.post('/:customListName', (req, res)=>{
    const itemName = req.params.list;

    const newItem = new Item({
        name: itemName
    });
    newItem.save();
    res.redirect("/:customListName");
});

app.post('/', (req,res)=>{
    const itemName = req.body.todoItem;

    const newItem = new Item({
        name: itemName
    });
    newItem.save();
    res.redirect("/");
});

app.get('/work', (req, res)=>{
    res.render("list", {listTitle: "Work List", newItem: works});
});

app.post('/work', (req, res)=>{
    const item = req.body.newItem;
    works.push(item);
    res.redirect('/work');
});

app.post('/delete', (req,res)=>{
    const checkedItemId = req.body.on;
    Item.findByIdAndRemove(checkedItemId).then(()=> console.log("removed")).catch((err)=>console.log(err))
    res.redirect("/");
});





















app.listen(3000, ()=> console.log("server is running at port 3000"));
