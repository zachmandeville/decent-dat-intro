//Listen to the document(webpage).  When the entire content has loaded, run the setColor function,
//and pass along as the argument whatever the 'host' url is. 
document.addEventListener("DOMContentLoaded", function() {
    setColor(window.location.host)
    setFont(window.location.host)
})
//window.location.host is a fundamental JS element that is equal to the domain url.  So the
//window.location.host of coolguy.website/coolshit would be coolguy.website.  The
//window.location.url of a dat site would be the full path of that site.
//in other words, set the color based on what's found at this specific dat site.

function setColor(url) {
    // open the dat archive
    var archive = new DatArchive(url)
    //new DatArchive(url) is a function of dat's web api.  It creates a new archive instance of
  //whatever dat archive you sent it.  The archive, as I understand it, is the entire directory of a
  //particular site (like it's dat.json and script.js and all that.)
    try {// to fetch a file from the archive
        archive.readFile("local.json").then((contents) => {
	//Above is another web api function (and a promise!).  In this new instance we made, read the local.json file, then do the following with the contents:
            var color = JSON.parse(contents).color
	  //set a new variable called 'color' that is set to whatever we can parse in the color
	  //value in that local.json.
            document.body.style.backgroundColor = color
	  //in our current site, create a style attribute for backgroundColor and set it to whatever
	  //we grabbed in that local.json file.
        })
    } catch (e) {
      //Catch an error if there's an error and show it in the console.
        console.error(e)
    }
}

function setFont(url) {
    // open the dat archive
    var archive = new DatArchive(url)
    try {
        archive.readFile("local.json").then((contents) => {
            var font = JSON.parse(contents).font
            document.body.style.fontFamily = font
        })
    } catch (e) {
      //Catch an error if there's an error and show it in the console.
        console.error(e)
    }
}

//This function saves our input color value and changes the current dat to reflect this!
function save() {
    var colorValue = getInput("color-input")
    var fontValue = document.body.style.fontFamily
  //create a variable called colorValue that is equal to whatever is in our input tag with the id
  //'color-value'.  The getInput function is defined below.
    document.body.style.backgroundColor = colorValue
    //set the current sites background color to whatever that colorValue is.
    var archive = new DatArchive(window.location.host)
  //create a new instance of our datArchive
    archive.writeFile("local.json", JSON.stringify({color: colorValue, font: fontValue}, null, 2)) 
  //update the local.json file with that input color value.  This makes it so that the next time we
  //load the site up, it still has our older color.
  //JSON.stringify is a fundamental function.  the first argument takes what it is we are writing,
  //the second and third are to help with the spacing in that object.  I don't fullly get that last
  //part, but essentially 'null,2' makes the spacing nice in that local.json object.
}

function saveFont() {
  var fontValue = getInput("font-input")
  var colorValue = document.body.style.backgroundColor
  document.body.style.fontFamily = fontValue
  var archive = new DatArchive(window.location.host)
  archive.readFile("local.json").then((contents) => {
    archive.writeFile("local.json", JSON.stringify({color: colorValue, font: fontValue}, null, 2))
  })
}

//When the user presses enter on either of the fields, figure out where they pressed enter and run
//the necessary function.
function enter(e) {
    if (e.key == "Enter") {//if they pressed the enter key, then...
      //check if they prssed it while in the color-input input area.  
        if (e.target.id === "color-input") {
	  //if so, run the save function.
            save()
        } else if (e.target.id === "dat-input") {
	  //else, if it was in the dat-input function, run our fetch command (defined below)
            fetch()
        } else if (e.target.id === "font-input") {
	    saveFont()
	}
    }
}

//Grab the URL of any archive site.  If that datARchive has a local.json with a color key, then
//we'll change the color of our site to match this one.
function fetch() {
    var url = getInput("dat-input")
    setColor(url)
}

//Grab the contents of whatever is in the input field and return it.
function getInput(name) {
    var input = document.getElementById(name)
    //set a new variable called input to be whatever element in the DOM has the name that we passed.
    var val = input.value
    //create a new variable called val that is set to whatever is the value (in this case the text)
  //that's inside that input area.
    input.value = ""
  //reset the value of the input field (so the text we entered disappears, knowing it was entered.
    return val
  //return whatever the value we set was.
}
