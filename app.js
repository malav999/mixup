// const express = require("express");
// const bodyParser = require("body-parser");
// const app = express();


// const configRoutes = require("./routes");
// const exphbs = require("express-handlebars");


// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded());

// app.engine("handlebars", exphbs({ defaultLayout: "main" }));
// app.set("view engine", "handlebars");

// configRoutes(app);

// app.listen(3000, () => {
//     console.log("We've now got a server!");
//     console.log("Your routes will be running on http://localhost:3000");
// });

const express = require("express");
const bodyParser = require("body-parser");
const static = express.static(__dirname + "/public");
const app = express();
const configRoutes = require("./routes");
const exphbs = require("express-handlebars");
const session = require('express-session');
app.use("/public", static);
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

//create express session 
app.use(session(
    {
        name: 'AuthCookie',
        secret: 'old town road!',
        resave: false,
        saveUninitialized: true,
        maxAge: true
    }));





app.get("/", async (req, res) => {
    if (!req.session.userId) {
        res.redirect("user/signin");
    }
    else {
        //render the homepage.
    }
})

configRoutes(app);






// app.get("/", async(req,res)=>{
//     //user - login page should come here 
//     res.render("pages/APILogIn");
// })

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:3000");
});
