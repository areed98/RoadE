var cityInputEl = document.querySelector("#cityInput");
var cityButtonEl = document.querySelector("#cityButton");
var ulEl = document.querySelector("#searchResults");
var searchResultsEl = document.querySelector("#searchResults");
var searchNavEl = document.querySelector("#eventsNav");
var selectEl = document.querySelector("#genreSelect");
var filterBtnEl = document.querySelector("#filterBtn");
var keywordInputEl = document.querySelector("#keywordInput");

var city = "";

var keyword = "";

var pageData = {
    selfURL: "",
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

var wapiKey = "5XBMXPEKZSXAAJ3HZEUBPKXY4";
var wapiPrefix = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/"
var wapiPrefix = "?unitGroup=us&key=";

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

    city = cityName;

    weatherFetch();

    fetch(`https://app.ticketmaster.com/discovery/v2/events.json?city=${city}&sort=date,asc&radius=20&unit=miles&apikey=${apiKey}`)
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            console.log(data);
            pageData.nextPageURL = data._links.next.href;
            pageData.firstPageURL = data._links.first.href;
            pageData.lastPageURL = data._links.last.href;
            pageData.selfURL = data._links.self.href;
            ticketMasterStats(data);

        })
        .catch(function() {
            var pEl = document.createElement("p");
            pEl.textContent = "Could not process request!";
            pEl.classList.add("subtitle");
            searchResultsEl.appendChild(pEl);
        })

};

var weatherdate = "2022-8-29";

var weatherFetch = function() {

    fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/${weatherdate}/${weatherdate}${wapiPrefix}${wapiKey}&contentType=json`)
    .then(function (res) {
    return res.json();
    })
    .then(function (data) {
        console.log(data);
    }); 

};

// fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/${data.date}${wapiPrefix}${wapiKey}&contentType=json`)
// .then(function (res) {
//     return res.json();
// })

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
            pageData.selfURL = data._links.self.href;

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
            pageData.selfURL = data._links.self.href;

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
            pageData.selfURL = data._links.self.href;

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
            pageData.selfURL = data._links.self.href;

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

    pEl.textContent = data.name + " - " + data.date + " - " + data.segment ;
    pEL.setAttribute("data-date", data.date);

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

    if (pageData.firstPageURL == false || pageData.lastPageURL == false) {
        childDeconstructor(searchNavEl);
    } else if (pageData.currentPageNumber === 1 || pageData.currentPageNumber === pageData.totalPages) {

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

// New code (8/28/2022)
var filterFetch = function(genreTxt) {

    var genre = genreTxt;

    var splittxt = pageData.selfURL.split("classificationId=");

    splittxt[1] = `&classificationId=${genre}`;

    var splittxt2 = splittxt[0].split("keyword=")
    splittxt2[1] = `&keyword=${keyword}`
    var joinedtxt2 = splittxt2.join('');

    splittxt[0] = joinedtxt2;

    var joinedtxt = splittxt.join('');

    var joinedURL = `${prefix}${joinedtxt}${apiPrefix}${apiKey}`;

    console.log(joinedURL);

    childDeconstructor(searchResultsEl);
    childDeconstructor(searchNavEl);
    fetch(`${joinedURL}`)
        .then(function(res) {
            return res.json();
        })
        .then(function(data) {
            console.log(data);
            pageData.currentPageNumber = data.page.number + 1;

            if(data._links.first) {
                pageData.firstPageURL = data._links.first.href;
            } else {
                pageData.firstPageURL = false;
            }

            if (data._links.last) {
                pageData.lastPageURL = data._links.last.href;
            } else {
                pageData.lastPageURL = false;
            }

            if (data._links.self) {
                pageData.selfURL = data._links.self.href;
            }

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

var filterBtnHandler = function(event) {

    event.preventDefault();

    var case1 = false;
    keyword = keywordInputEl.value;

    if (keywordInputEl.value == null || keywordInputEl.value == "") {
        keyword = "";
    }

    if (selectEl.value != 0) {
        case1 = true;
    }

    if (case1 == true) {
        filterSelect();
    }  

};

var filterSelect = function() {

    var sportsID = "KZFzniwnSyZfZ7v7nE";
    var musicID = "KZFzniwnSyZfZ7v7nJ";
    var artsID = "KZFzniwnSyZfZ7v7na";

    if(selectEl.value==1) {
        filterFetch(musicID);
    } else if(selectEl.value==2) {
        filterFetch(sportsID);
    } else if(selectEl.value==3) {
        filterFetch(artsID);
    }

};

var filterConstructor = function() {

    /* 
    ============
    Constructor for "filter options" on page and all relevant event listeners
    ============
    */

};

// What if we use jquery to drag elements onto a calendar and have it stay there?

cityButtonEl.addEventListener("click", cityInputHandler);
filterBtnEl.addEventListener("click", filterBtnHandler);

// APIS
// https://www.weatherapi.com/weather/q/country-club-manor-2556203?loc=2556203&loc=2556203&day=1
// https://developers.google.com/calendar/api
// Clear filters option needed
// Disable or make filters invisible until a city is searched
// google maps api?

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