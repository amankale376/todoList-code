//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://aman:Test@123@cluster0.5lgy3.mongodb.net/todolistDB",{ useNewUrlParser: true, useUnifiedTopology: true } );

const itemSchema = {
  name: String
};
const ItemModel = mongoose.model("item",itemSchema);


const arr =[{name:"hello"},{name:"hi"},{name:"Namaste"}];

const listSchema = {
  name:String,
  items:[itemSchema]
};

const ListModel = mongoose.model("list",listSchema); 




app.get("/", function(req, res) {

  ItemModel.find({},(err,data)=>{
    if(data.length === 0){
      ItemModel.insertMany(arr,(err)=>{ 
        if(err){
         console.log(err);
        }else{
          console.log("items saved");
        }
        });  
        res.redirect("/");
    }else{
      res.render("list", {listTitle:"Today" ,newListItems: data});

  }
});
 
});



app.post("/", function(req, res){

  const item = req.body.newItem;
  const saveItem = new ItemModel({
    name: item
  });
  saveItem.save();

 res.redirect("/");
});



app.post("/delete", (req, res)=>{
  const itemId = req.body.checkbox;
  console.log(itemId); 

  ItemModel.findByIdAndDelete(itemId, function(err){ 
    if(err){
      console.log(err);
    }else{
      console.log('item deleted succesfully');
    }
  });
  res.redirect("/");
});



app.get("/:customList", (req,res)=>{
  const customList = req.params.customList;
ListModel.find({name:customList}, (err,data)=>{
  if(!err){
    if(data){
      console.log("exists");
      res.render("list", {listTitle:data.name ,newListItems: data.items});
    }else{
      const newList = new ListModel({
        name:customList,
        items: arr
      });
      newList.save();
      res.redirect("/"+customList);
    }
  }else{
    console.log(err);
  }
});


});



app.get("/about", function(req, res){
  res.render("about");
});




app.listen(3000, function() {
  console.log("Server started on port 3000");
});
