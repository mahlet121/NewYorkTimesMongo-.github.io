
  // For each one
  $(".panel-heading").hide();
  $("#topArticles").hide();
$("#Scraper").on("click", function(){
 //location.reload(true);
        $("#empty").hide();
  $.getJSON("/articles", function(data) {
  $("#container").empty();
  $("#container").html('');
  
  //$("#container").html("<button class='saveart' class='btn btn-success'>"+"SAVE ARTICLE"+"</button>");
  for (var i = 0; i < 20; i++) {
    // $(".panel-heading").append("<p>"+ data[0].title  + "</p>");
    //   $("#topArticles").append("<p>" + data[0].link + "</p>"+"<br>");
     
     $("#container").append("<button class='saveart' data-id='" + data[i]._id + "'>"+"SAVE ARTICLE"+"</button>");
    // Display the apropos information on the page
    $("#container").append("<div class='panel-heading' >"+"<p data-id='" + data[i]._id + "'>" + data[i].title  + "</p>"+"</div>"+"<div id='topArticles' class='jumbotron'>"+"<p>" + data[i].link + "</p>"+"</div>");
      
    
  }
  alert(i+"Articles you add");
});

});


$.getJSON("/api/savedArticle", function(data) {
  $("#notes").empty();

//$("#notes").html("<button class='note' class='btn btn-success'>"+"ARTICLE NOTE"+"</button>");
  for (var i = 0; i < data.length; i++) {
    // $(".panel-heading").append("<p>"+ data[0].title  + "</p>");
    //   $("#topArticles").append("<p>" + data[0].link + "</p>"+"<br>");
     
     $("#notes").append("<button class='delete' onClick='window.location.reload();'    data-id='" + data[i]._id + "'>"+"DELETE FROM SAVED"+"</button>"+"<button class='note' data-id='" + data[i]._id + "'>"+ "ARTICLE NOTE"+"</button>");
    // Display the apropos information on the page
    $("#notes").append("<div class='panel' >"+"<p data-id='" + data[i]._id + "'>" + data[i].title  + "</p>"+"</div>"+"<div id='articles' class='jumbotron'>"+"<p>" + data[i].link + "</p>"+"</div>");
      
    //$("#notes").append()
  }

});

//$(".modal").hide();
$(document).on("click", ".note", function() {
  $(".modal").show();
  //alert("bhh"); $(".modal").show();
    $(".modal").animate({
        "opacity": 100
    }, "fast");
var id = $(this).attr("data-id");
    $(".modal .modalContent").html("<h2>"+"Note For Article:"+""+id+"</h2>"+"<br>"+"<br>"+"<div id='title' data-id >"+"<p>"+"No notes for this article yet"+"</P>"+"</div>"+"<br>"+"<textarea id='notee'  data-id  name='body' placeholder='New Note'>"+"</textarea>"+"<br>"+"<button data-id='" + id + "' class='insert'>"+"Save Note"+"</button>");
    
});
$(".modal .close").on("click", document, function () {
      $(".modal").animate({
            "opacity": 0
        }, "fast", function () {
            console.log("Animation complete");
            $(".modal").hide();
        });
    });

// When you click the savenote button
$(document).on("click", ".saveart", function() {
  // Grab the id associated with the article from the submit button
  var articleId = $(this).attr("data-id");
  var objectId = {"_id": articleId};
  //console.log("objectId");
  console.log(objectId);
  //console.log("objectId");
  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "PATCH",
    url: "api/saved",
    data: objectId
    // data: {
    //   // Value taken from title input
    //   title: $("#titleinput").val(),
    //   // Value taken from note textarea
    //   body: $("#bodyinput").val()
    // }
  })
    // With that done
    .done(function(data) {

      // Log the response
     // console.log(data);
      // Empty the notes section
      //$("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  // $("#titleinput").val("");
  // $("#bodyinput").val("");
});
$(document).on("click", ".insert", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
 $.ajax({
    method: "POST",
    dataType: "json",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title inpu
      body: $("#notee").val()
    },
  
    // With that done
    success: function(data) {
      console.log(data);
    }
    });  //console.log();
      //$("#title").append("<p data-id>" + data.note+ "</p>"+"<button data-id id='deletenote'>"+"&times;"+"</button>");
      // Empty the notes section
      //$("#title").empty();
    

  // Also, remove the values entered in the input and textarea for note entry

  //$("#notee").val("");
  // Run a POST request to change the note, using what's entered in the inputs
 // $.ajax({
 //    method: "POST",
 //    url: "/articles/" + thisId,
 //    data: {
 //      // Value taken from title input

 //      // Value taken from note textarea
 //      body: $("#notee").val()
 //    }
 //  })
 //    // With that done
 //    .done(function(data) {
 //      // Log the response
 //      console.log(data);
 //      // Empty the notes section
 //      $("#title").empty();
 //    });

 //  // Also, remove the values entered in the input and textarea for note entry
  //$("#notee").val("");
 var thisId = $(this).attr("data-id");
   $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
      
    // With that done, add the note information to the page
    .done(function(data) {
      console.log(data);
       $("#notee").val("");
      $("#title").empty();
      
  
      // The title of the article
      $("#title").append("<p data-id>" + data.note.body+ "</p>"+"<button data-id id='deletenote'>"+"&times;"+"</button>");
 // //      // An input to enter a new title
 // //      // A button to submit a new note, with the id of the article saved to it
      

 // //      // If there's a note in the article
 // //      



  //var selected = $(this).parent();
  // Make an AJAX GET request to delete the specific note
  // this uses the data-id of the p-tag, which is linked to the specific note
 $(document).on("click", "#deletenote", function() {
  // Grab the id associated with the article from the submit button
   var thisId = $(this).attr("data-id");
  // Make an AJAX GET request to delete the notes from the db
  $.ajax({
    type: "GET",
    dataType: "json",
    url: "/articles/" + thisId,
    // On a successful call, clear the #results section
    success: function(response) {

      $("#title").empty();
      $(".modal").animate({
            "opacity": 0
        }, "fast", function () {
            console.log("Animation complete");
            $(".modal").hide();
        });
}
    });
  });


});
});


$(document).on("click", ".delete", function() {
 
var thisId = $(this).attr("data-id");
 $(".panel"+thisId).remove();
  // Make an AJAX GET request to delete the specific note
  // this uses the data-id of the p-tag, which is linked to the specific note
  $.ajax({
    type: "GET",
     url: "/delete/" + thisId,

    // On successful call
    success: function(response) {
    thisId.parent.remove();
      //console.log(response);
      // Remove the p-tag from the DOM
      console.log("delete");
      $(".panel"+thisId).remove();
    }
  });

});