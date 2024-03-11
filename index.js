import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "ToDoList",
  password: "J.i.28112003!!",
  port: 5432,
});
db.connect();

let items = [];

async function getItems(){
  const result=await db.query("Select * from items");
  result.rows.forEach(element => {
    items.push({
      id:element.id,
      title:element.name,
    })
  });
}

app.get("/", async(req, res) => {
  try{
    items=[]
    await getItems();
    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });
  }catch(err){
    console.log(err);
  }
});

app.post("/add", async(req, res) => {
  try{
    const item = req.body.newItem;
    await db.query("Insert Into items(name) values($1)",[item]);
    items=[];
    res.redirect("/");
  }catch(err){
    console.log(err);
  }
});

app.post("/edit", async(req, res) => {
  try{
    const id=parseInt(req.body.updatedItemId);
    await db.query("Update Items set name = $1 where id =$2",[req.body.updatedItemTitle , id]);
    items=[];
    res.redirect("/");
  }catch(err){
    console.log(err);
  }
});

app.post("/delete", async(req, res) => {
  try{
    const id=parseInt(req.body.deleteItemId);
    await db.query("Delete from Items where id = $1",[id]);
    items=[];
    res.redirect("/");
  }catch(err){
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
