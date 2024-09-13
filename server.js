const express = require("express");
const app = express();
const expressSesion = require("express-session");
const flash = require("connect-flash");
const path = require("path");


// We can't use connect-flash without express-session
// Temporarily save message, only one time showing

app.set("view engin", "ejs");
app.set("views", path.join(__dirname, "views"));


let sessionOption = { 
    secret: "mysecret",
    resave: false,
    saveUninitialized: true
}

// Use session as a Middleware
app.use(expressSesion(sessionOption));
app.use(flash());
app.use((req, res, next)=>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();
})

app.get("/test", (req, res)=>{
    res.send("Test successfull!");
});


app.get("/register", (req, res)=>{
    let {name = "NoName"} = req.query;
    req.session.name = name;
    if(name === "NoName"){
        req.flash("error", "Error! No Name Provided!");
    }else{
        req.flash("success", "Success! User Registered Successfully!"); // We pass two parameters in flash
    }
    console.log(req.session.name);  // Will print the name

    res.redirect("/hello");  // Redirect to /hello
});

// We can store information in a single session
app.get("/hello", (req, res)=>{
    // console.log(req.flash("success")); 
    // res.locals.successMsg = req.flash("success");  // We can use it as middelware
    // res.locals.errorMsg = req.flash("error");
    res.render("flash.ejs", {name: req.session.name});

    // res.render("flash.ejs", {name: req.session.name, messages: req.flash("success")});
})

app.get("/reqcount", (req, res)=>{
    // req.session.count = 1;  // For tracking x
    if(req.session.count){
        req.session.count++;
    }else {
        req.session.count = 1;
    }
    res.send(`You sent a request ${req.session.count} time`);
    
})

app.listen(8080, ()=>{
    console.log("server is running!");
})