var cityInputEl = document.querySelector("#cityInput");
var cityButtonEl = document.querySelector("#cityButton");
var ulEl = document.querySelector("#searchResults");
var searchResultsEl = document.querySelector("#searchResults");
var searchNavEl = document.querySelector("#eventsNav");

var pageData = {
    nextPageURL: "",
    prevPageURL: "",
    firstPageURL: "",
    lastPageURL:"",
    currentPageNumber: "",
    totalPages: ""
};

var apiKey = "M3zlk7OCkBc7AhFeAlbcYBIvwTxFzGlB";
var prefix = "https://app.ticketmaster.com";
var apiPrefix = "&apikey=";

// Images api
// https://app.ticketmaster.com/discovery/v2/events/k7vGFKzleBdwS/images.json?apikey=M3zlk7OCkBc7A

// Classifications api
// https://app.ticketmaster.com/discovery/v2/classifications.json?apikey=M3zlk7OCkBc7AhFeAlbcYBIvw

var childDeconstructor = function(parent) {

    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    };

};

var cityInputHandler = function(event) {
    event.preventDefault();
    var text = cityInputEl.value;
    if (text === null || text === "") {
        alert("input must not be empty");
    } else {
        cityInputEl.value = "";
        ticketMasterFetch(text);
    }

};

var ticketMasterFetch = function(cityName) {

    childDeconstructor(searchResultsEl);
    childDeconstructor(searchNavEl);

    var city = cityName;

    fetch(`https://app.ticketmaster.com/discovery/v2/events.json?city=${city}&sort=date,asc&radius=20&unit=miles&apikey=${apiKey}`)
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            console.log(data);
            pageData.nextPageURL = data._links.next.href;
            pageData.firstPageURL = data._links.first.href;
            pageData.lastPageURL = data._links.last.href;
            ticketMasterStats(data);

        })
        .catch(function() {
            var pEl = document.createElement("p");
            pEl.textContent = "Could not process request!";
            pEl.classList.add("subtitle");
            searchResultsEl.appendChild(pEl);
        })

};

var nextPageFetch = function() {

    childDeconstructor(searchResultsEl);
    childDeconstructor(searchNavEl);

    fetch(`${prefix}${pageData.nextPageURL}${apiPrefix}${apiKey}`)
        .then(function(res) {
            return res.json();
        })
        .then(function(data) {
            console.log(data);
            pageData.currentPageNumber = data.page.number + 1;
            pageData.firstPageURL = data._links.first.href;
            pageData.lastPageURL = data._links.last.href;

            if(data._links.next) {
                pageData.nextPageURL = data._links.next.href;
            }

            if(data._links.prev) {
                pageData.prevPageURL = data._links.prev.href;
            }

            ticketMasterStats(data);
            currentPageConstructor();

        })
        .catch(function() {
            var pEl = document.createElement("p");
            pEl.textContent = "Could not process request! (likely due to reaching 1000th item limit)";
            pEl.classList.add("subtitle");
            searchResultsEl.appendChild(pEl);
        })

};

var prevPageFetch = function() {

    childDeconstructor(searchResultsEl);
    childDeconstructor(searchNavEl);
    fetch(`${prefix}${pageData.prevPageURL}${apiPrefix}${apiKey}`)
        .then(function(res) {
            return res.json();
        })
        .then(function(data) {
            console.log(data);
            pageData.currentPageNumber = data.page.number + 1;
            pageData.firstPageURL = data._links.first.href;
            pageData.lastPageURL = data._links.last.href;

            if(data._links.next) {
                pageData.nextPageURL = data._links.next.href;
            }

            if(data._links.prev) {
                pageData.prevPageURL = data._links.prev.href;
            }

            ticketMasterStats(data);
            currentPageConstructor()
        })
        .catch(function() {
            var pEl = document.createElement("p");
            pEl.textContent = "Could not process request! (likely due to reaching 1000th item limit)";
            pEl.classList.add("subtitle");
            searchResultsEl.appendChild(pEl);
        })
};

var firstPageFetch = function() {

    childDeconstructor(searchResultsEl);
    childDeconstructor(searchNavEl);
    fetch(`${prefix}${pageData.firstPageURL}${apiPrefix}${apiKey}`)
        .then(function(res) {
            return res.json();
        })
        .then(function(data) {
            console.log(data);
            pageData.currentPageNumber = data.page.number + 1;
            pageData.firstPageURL = data._links.first.href;
            pageData.lastPageURL = data._links.last.href;

            if(data._links.next) {
                pageData.nextPageURL = data._links.next.href;
            }

            if(data._links.prev) {
                pageData.prevPageURL = data._links.prev.href;
            }

            ticketMasterStats(data);
            currentPageConstructor()
        })
        .catch(function() {
            var pEl = document.createElement("p");
            pEl.textContent = "Could not process request! (likely due to reaching 1000th item limit)";
            pEl.classList.add("subtitle");
            searchResultsEl.appendChild(pEl);
        })

};

var lastPageFetch = function() {

    childDeconstructor(searchResultsEl);
    childDeconstructor(searchNavEl);
    fetch(`${prefix}${pageData.lastPageURL}${apiPrefix}${apiKey}`)
        .then(function(res) {
            return res.json();
        })
        .then(function(data) {
            console.log(data);
            pageData.currentPageNumber = data.page.number + 1;
            pageData.firstPageURL = data._links.first.href;
            pageData.lastPageURL = data._links.last.href;

            if(data._links.next) {
                pageData.nextPageURL = data._links.next.href;
            }

            if(data._links.prev) {
                pageData.prevPageURL = data._links.prev.href;
            }

            ticketMasterStats(data);
            currentPageConstructor()
        })
        .catch(function() {
            var pEl = document.createElement("p");
            pEl.textContent = "Could not process request! (likely due to reaching 1000th item limit)";
            pEl.classList.add("subtitle");
            searchResultsEl.appendChild(pEl);
        })
};

var ticketMasterStats = function(data) {

    var results = data.page.totalElements;
    pageData.totalPages = data.page.totalPages;

    var pEl = document.createElement("p");

    pEl.classList.add("subtitle");

    pEl.textContent = "Results: " + results;

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

        if (i === data._embedded.events.length - 1) {
            upcomingEventsNavConstructor();
                var firstPageEl = document.querySelector("#firstPage");
                var lastPageEl = document.querySelector("#lastPage");
                firstPageEl.textContent = 1;
                lastPageEl.textContent = pageData.totalPages;
        };

    };

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

    var ulEl = document.createElement("ul");
    var pageFirstEl = document.createElement("li");
    var pageEndEl = document.createElement("li");
    var liEl = document.createElement("li");
    var a1El = document.createElement("a");
    var a2El = document.createElement("a");

    ulEl = document.createElement("ul");

    ulEl.classList.add("pagination-list");

    pageFirstEl.classList.add("pagination-link");
    pageFirstEl.classList.add("is-current");
    pageFirstEl.setAttribute("id", "firstPage");

    pageEndEl.classList.add("pagination-link");
    pageEndEl.setAttribute("id", "lastPage");

    liEl.classList.add("pagination-ellipsis");
    liEl.textContent = "...";

    a1El.classList.add("pagination-previous");
    a2El.classList.add("pagination-next");

    a1El.textContent = "Previous";
    a2El.textContent = "Next Page";

    ulEl.appendChild(pageFirstEl);
    ulEl.appendChild(liEl);
    ulEl.appendChild(pageEndEl);

    searchNavEl.appendChild(ulEl);
    searchNavEl.appendChild(a1El);
    searchNavEl.appendChild(a2El);

    a2El.addEventListener("click", nextPageFetch);
    a1El.addEventListener("click", prevPageFetch);
    pageFirstEl.addEventListener("click", firstPageFetch);
    pageEndEl.addEventListener("click", lastPageFetch);

};

var currentPageConstructor = function() {

    if (pageData.currentPageNumber === 1 || pageData.currentPageNumber === pageData.totalPages) {

        var ulEl = document.querySelector(".pagination-list");
        var firstPageEl = document.querySelector("#firstPage");
        var lastPageEl = document.querySelector("#lastPage");
        var fillerEl1 = document.querySelector(".pagination-ellipsis");

        if (pageData.currentPageNumber === 1) {
            firstPageEl.classList.add("is-current");
            lastPageEl.classList.remove("is-current");
        } else {
            lastPageEl.classList.add("is-current");
            firstPageEl.classList.remove("is-current");
        }

        ulEl.appendChild(firstPageEl);
        ulEl.appendChild(fillerEl1);
        ulEl.appendChild(lastPageEl);

    } else {

        var ulEl = document.querySelector(".pagination-list");
        var firstPageEl = document.querySelector("#firstPage");
        var lastPageEl = document.querySelector("#lastPage");
        var fillerEl1 = document.querySelector(".pagination-ellipsis")
        
        var fillerEl2 = document.createElement("li");
        var liEl = document.createElement("li");
        
        liEl.classList.add("pagination-link");
        liEl.classList.add("is-current");
        liEl.setAttribute("id", "currentPage");
        liEl.textContent = pageData.currentPageNumber;

        fillerEl2.classList.add("pagination-ellipsis");
        fillerEl2.textContent = "...";

        firstPageEl.classList.remove("is-current");

        ulEl.appendChild(firstPageEl);
        ulEl.appendChild(fillerEl1);
        ulEl.appendChild(liEl);
        ulEl.appendChild(fillerEl2);
        ulEl.appendChild(lastPageEl);   

    };

};

// What if we use jquery to drag elements onto a calendar and have it stay there?

cityButtonEl.addEventListener("click", cityInputHandler);

/* 
=========
TO DO:
- Potentially implement jquery UI
- Potentially implement calendar drag & drop
- Potentially implement weather statistics
- Utilize localStorage (save search results, save user plans etc.)
- Implement modal functionality when clicking to view event details
- Clean up and comment code
- invisible chuck norris el?
==========

*/