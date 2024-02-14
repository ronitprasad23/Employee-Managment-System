const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const { v4: uuidv4 } = require('uuid');

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,"/Public/css")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"/views"));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'Delta_app',
    password: 'harsh123'
});

let getRandomUser = () => {
    return [
      faker.string.uuid(),
      faker.internet.userName(),
      faker.internet.email(),
      faker.internet.password(),
    ];
  }

// Inserting New Data:-
// let q = "INSERT INTO user1 (id, username, email, password) VALUES ?";

// let data = [];
// for(let i=1; i<=100; i++) {
//     data.push(getRandomUser()); //fake user's inserted
// }

//Home Route:
app.get("/", (req,res) => {
    let q = `SELECT COUNT(*) FROM user1`;
    try{
        connection.query(q, (err,result) => {
            if(err) throw err;
            let count = result[0] ["COUNT(*)"];
            res.render("Home", {count});
        });
    }
    catch (err) {
    console.log(err);
    res.send("Some error in DB")
    }
});

// Show user route:
app.get("/user", (req,res) => {
    let q = `SELECT * FROM user1`;

    try{
        connection.query(q, (err,users) => {
            if(err) throw err;
            // res.send(result);
            res.render("showuser", {users});
        });
    }
    catch (err) {
    console.log(err);
    res.send("Some error in DB")
    }   
});

// Edit route:
app.get("/user/:id/edit", (req,res) => {
    let {id} = req.params;
    let q = `SELECT * FROM user1 WHERE id='${id}'`;
    try{
        connection.query(q, (err,result) => {
            if(err) throw err;
            let user = result[0];
            res.render("edit", {user});
        });
    }
    catch (err) {
    console.log(err);
    res.send("Some error in DB")
    }   
})

// Update route:
app.patch("/user/:id", (req,res) => {
    let {id} = req.params;
    let {password: formpass, username: newusername} = req.body;
    let q = `SELECT * FROM user1 WHERE id='${id}'`;
    try{
        connection.query(q, (err,result) => {
            if(err) throw err;
            let user = result[0];
            if(formpass != user.password) {
                res.send("Wrong Password");
            }
            else {
                let q2 = `UPDATE user1 SET username = '${newusername}' WHERE id = '${id}'`;
                connection.query(q2, (err,result) => {
                    if(err) throw err;
                    res.redirect("/user");
                })
            }
        });
    }
    catch (err) {
    console.log(err);
    res.send("Some error in DB")
    }   
});

// Add user:
app.get("/user/new", (req,res) => {
    res.render("New");
})
app.post("/user/new", (req,res) => {
    let {username,email,password} = req.body;
    let id = uuidv4();
    //Insert to add new user:
    let q = `INSERT INTO user1 (id,username,email,password) VALUES ('${id}','${username}','${email}','${password}')`;

    try {
        connection.query(q, (err,result) => {
            if(err) throw err;
            console.log("New user added");
            res.redirect("/user");
        });
    }
    catch (err) {
        res.send("Some error occured");
    }
});

app.get("/user/:id/delete", (req,res) => {
    let {id} = req.params;
    let q = `SELECT * FROM user1 WHERE id = '${id}'`;

    try {
        connection.query(q, (err,result) => {
            if(err) throw err;
            let user = result[0];
            res.render("delete", {user});
        });
    } catch (err) {
        res.send("Some error in DB");
    }
});

app.delete("/user/:id/", (req,res) => {
    let {id} = req.params;
    let {password} = req.body;
    let q = `SELECT * FROM user1 WHERE id = '${id}'`;

    try {
        connection.query(q, (err,result) => {
            if(err) throw err;
            let user = result[0];

            if(user.password != password) {
                res.send("Wrong password entered");
            }
            else {
                let q2 = `DELETE FROM user1 WHERE id = '${id}'`;
                connection.query(q2, (err,result) => {
                    if(err) throw err;
                    else {
                        console.log(result);
                        console.log(" User-Deleted");
                        res.redirect("/user");
                    }
                });
            }
        });
    } catch (err) {
        res.send("Some error has been catched");
    }
});

app.listen("8080", () => {
    console.log("App is listening to port 8080");
});




// connection.end();