var cityInputEl = document.querySelector("#cityInput");
var cityButtonEl = document.querySelector("#cityButton");
var ulEl = document.querySelector("#searchResults");
var searchResultsEl = document.querySelector("#searchResults");
var searchNavEl = document.querySelector("#eventsNav");
var filterOptionsEl = document.querySelector("#filterOptions");
var historyContainerEl = document.querySelector("#historyContainer");

var cityHistory = [];

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
        console.log(cityHistory)
        console.log(cityHistory.length);
        cityInputEl.value = "";
        ticketMasterFetch(text);
        filterConstructor();
    }

};

var ticketMasterFetch = function(cityName) {

    childDeconstructor(searchResultsEl);
    childDeconstructor(searchNavEl);

    city = cityName.trim().toLowerCase();

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

            if (cityHistory.length === 0) {
                console.log("case 1!");

                var historyObject = {
                    name: city
                }
    
                cityHistory.unshift(historyObject);
                saveHistory();
                childDeconstructor(historyContainerEl)
                historyConstructor();
          
            } else if (cityHistory.length < 8) {
                console.log("case 2!");
                for (i = 0; i < cityHistory.length; i++) {
        
                   if (cityHistory[i].name === city) {
        
                        break;
        
                    } else if (i === cityHistory.length - 1) {
        
                        var historyObject = {
                            name: city
                        }
            
                        cityHistory.unshift(historyObject);
        
                        saveHistory();
                        childDeconstructor(historyContainerEl)
                        historyConstructor();
                        break;
        
                    }
                }
        
            } else {
                console.log("case 3!");
        
                for (i = 0; i < cityHistory.length; i++) {
        
                    if (cityHistory[i].name === city) {
        
                         break;
        
                    } else if (i === cityHistory.length - 1) {
        
                        var historyObject = {
                            name: city
                        }
        
                        cityHistory.pop()
                        cityHistory.unshift(historyObject);
        
                        saveHistory();
                        childDeconstructor(historyContainerEl)
                        historyConstructor();
                        break;
        
                    }
        
                }
            }
        
            console.log(cityHistory);

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

    pEl.textContent = data.name + " - " + data.date + " - " + data.segment;
    pEl.setAttribute("data-date", data.date);

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

    var keywordInputEl = document.querySelector("#keywordInput");
    var selectEl = document.querySelector("#genreSelect");

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

    var selectEl = document.querySelector("#genreSelect");

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

    childDeconstructor(filterOptionsEl);
    var hrEl2 = document.createElement("hr");
    var hrEl = document.createElement("hr");
    var pEl = document.createElement("p");
    var divEl1 = document.createElement("div");
    var labelEl1 = document.createElement("label");
    var divEl2 = document.createElement("div");
    var divEl3 = document.createElement("div");
    var selectEl = document.createElement("select");
    var optionEl1 = document.createElement("option");
    var optionEl2 = document.createElement("option");
    var optionEl3 = document.createElement("option");
    var optionEl4 = document.createElement("option");
    var divEl4 = document.createElement("div");
    var labelEl2 = document.createElement("label");
    var divEl5 = document.createElement("div");
    var inputEl = document.createElement("input");
    var divEl6 = document.createElement("div");
    var buttonEl = document.createElement("button");
    var buttonEl2 = document.createElement("button");

    pEl.classList.add("title");
    pEl.textContent = "Filter Options";

    divEl1.classList.add("field");
    labelEl1.classList.add("label");
    labelEl1.textContent = "Genre";
    divEl2.classList.add("control");
    divEl3.classList.add("select");
    selectEl.setAttribute("id", "genreSelect");
    optionEl1.setAttribute("value", 0);
    optionEl1.setAttribute("selected", '');
    optionEl1.setAttribute("disabled", '');
    optionEl1.setAttribute("hidden", '');
    optionEl1.textContent = "Select Genre";
    optionEl2.setAttribute("value", 1);
    optionEl2.textContent = "Music";
    optionEl3.setAttribute("value", 2);
    optionEl3.textContent = "Sports";
    optionEl4.setAttribute("value", 3);
    optionEl4.textContent = "Arts & Theatre";

    divEl4.classList.add("field");
    labelEl2.classList.add("label");
    labelEl2.textContent = "Keyword";
    divEl5.classList.add("control");
    inputEl.setAttribute("id", "keywordInput");
    inputEl.setAttribute("type", "text");
    inputEl.classList.add("input");
    inputEl.setAttribute("placeholder", "Adele? Golf?");
    divEl6.classList.add("field");
    divEl6.setAttribute("id", "search2");
    buttonEl.classList.add("button");
    buttonEl.classList.add("is-success");
    buttonEl.setAttribute("id", "filterBtn");
    buttonEl.textContent = "Filter";
    buttonEl2.textContent = "Clear Filters";
    buttonEl2.setAttribute("id", "clearFilters");
    buttonEl2.classList.add("button");
    buttonEl2.classList.add("is-danger");
    buttonEl2.classList.add("mt-2");

    filterOptionsEl.appendChild(hrEl);
    filterOptionsEl.appendChild(pEl);
    
    divEl1.appendChild(labelEl1);
    divEl1.appendChild(divEl2);
    divEl2.appendChild(divEl3);
    divEl3.appendChild(selectEl);
    selectEl.appendChild(optionEl1);
    selectEl.appendChild(optionEl2);
    selectEl.appendChild(optionEl3);
    selectEl.appendChild(optionEl4);

    filterOptionsEl.appendChild(divEl1);

    divEl4.appendChild(labelEl2);
    divEl4.appendChild(divEl5);
    divEl5.appendChild(inputEl);
    
    filterOptionsEl.appendChild(divEl4);

    divEl6.appendChild(buttonEl);
    divEl6.appendChild(buttonEl2);
    
    filterOptionsEl.appendChild(divEl6);

    buttonEl.addEventListener("click", filterBtnHandler);
    buttonEl2.addEventListener("click", clearFilterBtnHandler);

    filterOptionsEl.appendChild(hrEl2);

};

var clearFilterBtnHandler = function(event) {

    event.preventDefault();
    
    var keywordInputEl = document.querySelector("#keywordInput");
    keywordInputEl.value = "";
    var selectEl = document.querySelector("#genreSelect");

    selectEl.value = 0;
    keyword = "";

    ticketMasterFetch(city);

};

var saveHistory = function() {

    localStorage.setItem("historyRgy6Ne7NjPR3", JSON.stringify(cityHistory))

};

var loadHistory = function() {

    var loadedHistory = JSON.parse(localStorage.getItem("historyRgy6Ne7NjPR3"));

    if (!loadedHistory) {
        return false;
    } else {
        cityHistory = loadedHistory;
        historyConstructor();
    }

};

var historyConstructor = function() {
    var hrEl = document.createElement("hr");
    historyContainerEl.appendChild(hrEl);

    for (i=0; i < cityHistory.length; i++) {
        var buttonEl = document.createElement("button");
        buttonEl.style.textTransform = "capitalize";
        buttonEl.textContent = cityHistory[i].name;
        buttonEl.classList.add("button");
        buttonEl.classList.add("is-light");
        buttonEl.classList.add("historyBtn");
        historyContainerEl.appendChild(buttonEl);
        buttonEl.addEventListener("click", historyBtnHandler);
    }
};

var historyBtnHandler = function(event) {

    event.preventDefault();
    var target = event.target;

    var text = target.textContent;
    ticketMasterFetch(text);

};

loadHistory();
cityButtonEl.addEventListener("click", cityInputHandler);

/* 
=========
TO DO:
- Potentially implement weather statistics
- Implement modal functionality when clicking to view event details
- Clean up and comment code
- invisible chuck norris el?
==========

*/