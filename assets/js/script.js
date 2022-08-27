var cityInputEl = document.querySelector("#cityInput");
var cityButtonEl = document.querySelector("#cityButton");
var ulEl = document.querySelector("#searchResults");
var firstPageEl = document.querySelector("#firstPage");
var lastPageEl = document.querySelector("#lastPage");

var cityInputHandler = function(event) {
    event.preventDefault();
    var text = cityInputEl.value;
    if (text === null || text === "") {
        alert("input must not be empty");
    } else {
        console.log(text);
        cityInputEl.value = "";
        ticketMasterFetch(text);
    }

};

var ticketMasterFetch = function(cityName) {

    //cityName not being used right now for testing purposes
    var city = cityName
    var apiKey = "M3zlk7OCkBc7AhFeAlbcYBIvwTxFzGlB"
    fetch(`https://app.ticketmaster.com/discovery/v2/events.json?city=${city}&sort=date,asc&radius=20&unit=miles&apikey=${apiKey}`)
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            console.log(data);
            ticketMasterStats(data);
        })
        .catch(function () {
            alert("Couldn't process request!")
        });

// Images api
// https://app.ticketmaster.com/discovery/v2/events/k7vGFKzleBdwS/images.json?apikey=M3zlk7OCkBc7A

// Classifications api
// https://app.ticketmaster.com/discovery/v2/classifications.json?apikey=M3zlk7OCkBc7AhFeAlbcYBIvw

};

var ticketMasterStats = function(data) {
   // "/discovery/v2/events.json?unit=miles&city=Atlanta&radius=20&page=1&size=20&sort=date,asc"
    var results = data.page.totalElements;
    var currentPage = data.page.number;
    var totalPages = data.page.totalPages;

    var pEl = document.createElement("p");

    pEl.classList.add("subtitle");

    pEl.textContent = "Results: " + results;

    firstPageEl.textContent = currentPage + 1;
    lastPageEl.textContent = totalPages + 1;

    ulEl.appendChild(pEl);

    for (i=0; i < data._embedded.events.length; i++) {
        var name = data._embedded.events[i].name
        var segment = data._embedded.events[i].classifications[0].segment.name
        var date = data._embedded.events[i].dates.start.localDate
        var url = data._embedded.events[i].url

        var eventStats = {
            name: name,
            segment: segment,
            date: date,
            url: url
        }

        upcomingEventsConstructor(eventStats);

    }

};

var upcomingEventsConstructor = function(data) {

    var liEl = document.createElement("li");
    var pEl = document.createElement("p");
    liEl.classList.add("box");

    pEl.textContent = data.name + " - " + data.date + " - " + data.segment;

    liEl.appendChild(pEl);

    ulEl.appendChild(liEl);

};

var upcomingEventsNavConstructor = function() {
}

// What if we use jquery to drag elements onto a calendar and have it stay there?

cityButtonEl.addEventListener("click", cityInputHandler);