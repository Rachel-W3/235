"use strict";
window.onload = init;

function init(){
    /* Activate button with Enter key */
    document.querySelector("#searchterm").addEventListener("keyup", event =>{
        if(event.key !== "Enter") return; 
        document.querySelector("#search").click(); 
        event.preventDefault();
    });
    document.querySelector("#search").onclick = getData;
}

let term = ""; // we declared `term` out here because we will need it later
function getData(){

    // 1 - main entry point to web service
    const SERVICE_URL = "https://api.rawg.io/api/games?search=";
    
    // No API Key required!
    
    // 2 - build up our URL string
    let url = SERVICE_URL;
    
    // 3 - parse the user entered term we wish to search
    term = document.querySelector("#searchterm").value;
    
    // get rid of any leading and trailing spaces
    term = term.trim();
    // encode spaces and special characters
    term = encodeURIComponent(term);
    url += term;
    
    // 4 - update the UI
    // document.querySelector("#debug").innerHTML = `<b>Querying web service with:</b> <a href="${url}" target="_blank">${url}</a>`;
    
    // 5- call the web service, and prepare to download the file
    $.ajax({
        //method: "GET",
        dataType: "json",
        // async: true,
        // crossDomain:true,
        // headers: {
        // 	'Access-Control-Allow-Origin':'*',
        // 	Accept: 'application/json',
        // 	'Content-Type': 'application/json',
        // },
        url: url,
        data: null,
        success: jsonLoaded
    });
}

$(document).ready(function () {
    $("#search").click(function() {
        $('html, body').animate({
            scrollTop: $("#content").offset().top
        }, 2000);
    });
});

let minRating = 0;
let loadedResults = [];
let previousSearch = [];

function jsonLoaded(obj) 
{
    console.log(obj);
    loadedResults = obj.results;
    
    filterByRating();
}

function getMinRating() {
    let ratingFilter = document.getElementsByClassName("rating-filter");

    for(let i = 0; i < ratingFilter.length; i++) {
        if(ratingFilter[i].checked) {
            let minRating = parseFloat(ratingFilter[i].value, 10);

            if(isNaN(minRating)) {
                minRating = 0;
            }
            
            return minRating;
        }
    }

    /* If nothing is checked, check 'all' */
    ratingFilter[0].checked = true;
    return 5;
}

function checkRating(result) {
    return result.rating >= minRating;
}

function filterByRating() {
    minRating = getMinRating();
    let filteredResults = loadedResults.filter(checkRating);
    let line = `<div id='flex-container'>`;

    for (let i = 0; i < filteredResults.length; i++) {
        let result = filteredResults[i];
        let name = result.name;
        let imgURL = result.background_image;
        let rating = result.rating;

        if(imgURL == null){
            imgURL = 'http://placehold.it/250x250';
        }

        line += `<div class='result'>`;
        line += `<img class='preview-image' src='${imgURL}' title= '${result.id}' />`;
        line += `<p class='game-name'>${name}</p>`;
        line += `<p>Ratings: ${rating}</p>`;
        line += `</div>`;

    }

    line += `</div>`; /* closing flex-container div */
    
    document.querySelector("#content").innerHTML = line;
}

function showPreviousTerms() {
    console.log("hello");
}