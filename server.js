/* Showing Mongoose's "Populated" Method
 * =============================================== */

// Dependencies
var express = require("express");
var expressHandlebars = require("express-handlebars");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
// Requiring our Note and Article models
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");
// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");
var path=require("path");

// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;


// Initialize Express
var app = express();

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Make public a static dir
app.use(express.static("public"));
// Designate our public folder as a static directory
// app.use(express.static(__dirname + "/public"));

// Connect Handlebars to our Express app
app.engine("handlebars", expressHandlebars({
  defaultLayout: "main"
}));
app.set("view engine", "handlebars");

// Database configuration with mongoose
mongoose.connect("mongodb://heroku_c5pdg1t4:5a0rjndf94teregmd046gktkv5@ds161493.mlab.");                                                                                            com:61493/heroku_c5pdg1t4

var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});


// Routes
// ======
app.get("/", function (req, res) {
  res.render("home");
});

// A GET request to scrape the echojs website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  request("http://www.newyorktimes.com/", function(error, response, html) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);
    // Now, we grab every h2 within an article tag, and do the following:
    $("article h2").each(function(i, element) {

      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this).children("a").text();
      result.link = $(this).children("a").attr("href");

      // Using our Article model, create a new entry
      // This effectively passes the result object to the entry (and the title and link)
      var entry = new Article(result);

      // Now, save that entry to the db
      entry.save(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        // Or log the doc
        else {
          console.log(doc);
        }
      });

    });
  });
  // Tell the browser that we finished scraping the text
  //res.json(doc);
});

// This will get the articles we scraped from the mongoDB

app.patch("/api/saved", function (req, res) {
    console.log("the body");
    console.log(JSON.stringify(req.body));
    console.log("the body");  
    Article.update(req.body, {
      $set: {
        saved: true
      }
    }, function(err, doc) {
      if (err) {
        res.send(err);
      } else {
      res.send(doc);
    }
    })
    
});
app.get("/articles", function(req, res) {
  // Grab every doc in the Articles array
  Article.find({}, function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});
app.get("/", function (req, res) {
  Article.find({}, function(error, data) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
    else{
  $("#container").html("<button class='saveart' class='btn btn-success'>"+"SAVE ARTICLE"+"</button>");
  for (var i = 0; i < data.length; i++) {
    // $(".panel-heading").append("<p>"+ data[0].title  + "</p>");
    //   $("#topArticles").append("<p>" + data[0].link + "</p>"+"<br>");
     
     
    // Display the apropos information on the page
    $("#container").append("<div class='panel-heading' >"+"<p data-id='" + data[i]._id + "'>" + data[i].title  + "</p>"+"</div>"+"<div id='topArticles' class='jumbotron'>"+"<p>" + data[i].link + "</p>"+"</div>"+"<button class='saveart' class='btn btn-success'>"+"SAVE ARTICLE"+"</button>");
    
  }
  alert(data.length+"Articles you add");
}
  
});
});
app.get("/api/savedArticle", function (req, res) {
 
  Article.find({"saved": true}, function(err, doc) {
      if (err) {
        res.send(err);
      } else {
      res.send(doc);
    }
    })
    
});
// Grab an article by it's ObjectId
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  Article.findOne({ "_id": req.params.id })
  // ..and populate all of the notes associated with it
  .populate("note")
  // now, execute our query
  .exec(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise, send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});

// app.get("/saved", function(req, res) {
//      res.sendFile(path.join(__dirname, "saved.html"));
// 

app.get("/saved", function (req, res) {
  res.render("saved");
});






// Create a new note or replace an existing note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  var newNote = new Note(req.body);

  // And save the new note the db
  newNote.save(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise
    else {
      // Use the article id to find and update it's note
      Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id })
      // Execute the above query
      .populate("note")
      .exec(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        else {
          console.log("removed");
          // Or send the document to the browser
          res.send(doc);
        }
      });
    }
  });
});

  

app.get("/delete/:id", function(req, res) {
   
    // Log any errors
    Article.findByIdAndRemove( req.params.id , function(err, doc) {
      if (err) {
        res.send(err);
      } else {
      //res.send(doc);
      console.log("bongo");
    }
    });
  // Remove a note using the objectID
 
});
app.post("/deletenote/:id", function (req, res) {
  console.log("DELETE");
  console.log(req.params.id);
  console.log(req.body.id);
      Note.findById( req.params.id, function(err, doc) {
        if(err){
          console.log(err);
        }
        console.log(doc)
       doc.delete(doc);
        console.log("Deleted");
      })
});



// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");

});
