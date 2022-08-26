var cityInputEl = document.querySelector("#cityInput");
var cityButtonEl = document.querySelector("#cityButton");

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
    var city = "Atlanta"
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
    console.log(data.page.totalElements + " results");
    console.log("Page " + data.page.number + " of " + data.page.totalPages);

    for (i=0; i < data._embedded.events.length; i++) {
        console.log(data._embedded.events[i].name);
        console.log(data._embedded.events[i].classifications[0].segment.name);
        console.log(data._embedded.events[i].dates.start.localDate);
        console.log(data._embedded.events[i].url);

    }

};

var upcomingEventsConstructor = function() {

}

// What if we use jquery to drag elements onto a calendar and have it stay there?

cityButtonEl.addEventListener("click", cityInputHandler);
ticketMasterFetch();