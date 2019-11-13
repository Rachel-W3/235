// 1
window.onload = (e) => {document.querySelector("#search").onclick = searchButtonClicked};
	
// 2
let displayTerm = "";

// 3
function searchButtonClicked(){
    console.log("searchButtonClicked() called");
    
    // 1
    const GIPHY_URL = "https://api.giphy.com/v1/gifs/search?";

    // 2 - Public API key from https://developers.giphy.com/docs/
    let GIPHY_KEY = "dc6zaTOxFJmzC"; // Backup: NefRQlH1IW2vpY9JJu07vk2yKDffnRha

    // 3 - Building up our own URL string
    let url = GIPHY_URL;
    url += "api_key=" + GIPHY_KEY;

    // 4 - Parsing user entered term for searching
    let term = document.querySelector("#searchterm").value;
    displayTerm = term;

    // 5 - Getting rid of leading and trailing spaces
    term = term.trim();

    // 6 - encoding spaces and special characters
    term = encodeURIComponent(term);

    // 7 - if there's no term to search then exit the function
    if (term.length < 1) return;

    // 8 - append the search term to the URL (named 'q')
    url += "&q=" + term;

    // 9 - grab the user chosen search 'limit' from <select> and append it to URL
    let limit = document.querySelector("#limit").value;
    url += "&limit=" + limit;

    // 10 - updating the UI
    document.querySelector("#status").innerHTML = "<b>Searching for '" + displayTerm + "'</b>";

    // 11 - shows what the url looks like in console
    console.log(url);

    // 12 Request data!
    getData(url);
}

function getData(url){
    // 1 - create a new XHR object
    let xhr = new XMLHttpRequest();

    //2 - set the onload handler
    xhr.onload = dataLoaded;

    //3 - set the onerror handler
    xhr.onerror = dataError;

    //4 - open connection and send the request
    xhr.open("GET", url);
    xhr.send();
}

function dataLoaded(e) {
    //5 - event.target is the xhr object
    let xhr = e.target;

    //6 - xhr.responseText is the JSON file we just downloaded
    console.log(xhr.responseText);

    //7 - turn the text into a parsable JS object
    let obj = JSON.parse(xhr.responseText);

    //8 - if there are no results, print a message and return
    if(!obj.data || obj.data.length == 0) {
        document.querySelector("#status").innerHTML = "<b>No Results found for'" + displayTerm + "'</b>";
        return;
    }

    //9 - Start building an HTML string we will display to the user
    let results = obj.data;
    console.log("results.length = " + results.length);
    let bigString = "<p><i>Here are " + results.length + " results for '" + displayTerm + "'</i></p>";

    //10 - loop through the array of results
    for(let i = 0; i < results.length; i++){
        let result = results[i];
        
        //11 - get the URL to th GIF
        let smallURL = result.images.fixed_width_small.url;
        if(!smallURL) smallURL = "images/no-image-found.png";

        //12 - get the URL to the GIPHY page
        let url = result.url;

        let rating = (result.rating ? result.rating : "NA").toUpperCase();
        
        //13 - Build a <div> to hold each result with ES6 String templating
        let line = `<div class='result'><img src='${smallURL}' title= '${result.id}' />`;
        line += `<span><a target='_blank' href='${url}'>View on Giphy</a></span>`;
        line += `<p> Rating: ${rating}</p>`;
        line += `</div>`;

        //14 - Another way to do that^ (confirmed that it works)
        // var line = "<div class='result'>";
        // 	line += "<img src='";
        // 	line += smallURL;
        // 	line += "' title= '";
        // 	line += result.id;
        // 	line += "' />";

        // 	line += "<span><a target='_blank' href='" + url + "'>View on Giphy</a></span></div>";
        // 	line += "</div>";

        //15 - add the <div> to 'bigString' and loop
        bigString += line;
    }

    //16 - all done building HTML - now show it to the user!
    document.querySelector("#content").innerHTML = bigString;

    //17 - update the status
    document.querySelector("#status").innerHTML = "<b>Success!</b>";
}

function dataError(e) {
    console.log("An error occurred.");
}