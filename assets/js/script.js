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

var weatherObj = {};

// var wapiKey = "5XBMXPEKZSXAAJ3HZEUBPKXY4";
var wapiKey = "WXA7ZF59PVGG2FRSLSH256QVA";
var wapiPrefix = "?unitGroup=us&key=";

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
        var imageURL = data._embedded.events[i].images[0].url
        var time = data._embedded.events[i].dates.start.localTime;

        var eventStats = {
            id: i,
            name: name,
            segment: segment,
            date: date,
            url: url,
            image: imageURL,
            time: time
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

    var formattedTime = "";

    //console.log(data.time);

    if (data.time===undefined || data.time=== null || data.time === "") {
        formattedTime = "Time not disclosed";
    } else {
        // Credit: https://stackoverflow.com/questions/29206453/best-way-to-convert-military-time-to-standard-time-in-javascript
        
        var time = data.time; // your input

        time = time.split(':'); // convert to array

        // fetch
        var hours = Number(time[0]);
        var minutes = Number(time[1]);
        var seconds = Number(time[2]);

        // calculate
        var timeValue;

        if (hours > 0 && hours <= 12) {
        timeValue= "" + hours;
        } else if (hours > 12) {
        timeValue= "" + (hours - 12);
        } else if (hours == 0) {
        timeValue= "12";
        }
        
        timeValue += (minutes < 10) ? ":0" + minutes : ":" + minutes;  // get minutes
        timeValue += (seconds < 10) ? ":0" + seconds : ":" + seconds;  // get seconds
        timeValue += (hours >= 12) ? " P.M." : " A.M.";  // get AM/PM

        formattedTime = timeValue;

    }

    

    pEl.textContent = data.name + " - " + data.date + " - " + data.segment;
    pEl.setAttribute("data-date", data.date);
    pEl.setAttribute("data-name", data.name);
    pEl.setAttribute("id", data.id);
    pEl.setAttribute("data-image", data.image);
    pEl.setAttribute("data-url", data.url);
    pEl.setAttribute("data-time", formattedTime);

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
    filterConstructor();

};

var modalConstructor = function(dataObj) {

    var modal = document.createElement("div");
    modal.classList.add("modal");
    modal.classList.add("is-active");

    var modalBackground = document.createElement("div");
    modalBackground.classList.add("modal-background");

    var modalCard = document.createElement("div");
    modalCard.classList.add("modal-card");

    var modalheader = document.createElement("header");
    modalheader.classList.add("modal-card-head");

    var modalTitle = document.createElement("p");
    modalTitle.classList.add("modal-card-title");
    modalTitle.classList.add("has-text-centered");
    modalTitle.textContent = dataObj.name;
    var modalClose = document.createElement("button");
    modalClose.classList.add("delete");
    modalClose.setAttribute("aria-label", "close");

    var modalBody = document.createElement("section");
    modalBody.classList.add("modal-card-body");

    var modalUl = document.createElement("ul");
    modalUl.setAttribute("id", "display-events");

    var modalboxBlock1 = document.createElement("li");
    modalboxBlock1.classList.add("box");
    modalboxBlock1.classList.add("block");
    var modalP1 = document.createElement("p");
    modalP1.classList.add("subtitle");
    modalP1.textContent = dataObj.date + " | " + dataObj.time;

    var modalboxBlock2 = document.createElement("li");
    var imageEl = document.createElement("img");
    imageEl.setAttribute("src", dataObj.image);
    imageEl.style.backgroundSize = "cover";
    imageEl.style.width = "100%";
    modalboxBlock2.classList.add("box");
    modalboxBlock2.classList.add("block"); 
    
    if (weatherObj.id === 0) {

        var modalboxBlock3 = document.createElement("li");
        modalboxBlock3.classList.add("box");
        modalboxBlock3.classList.add("block");
        var modaldivEl3 = document.createElement("div");
        modaldivEl3.style.display = "flex";
        modaldivEl3.style.justifyContent = "space-between";
        modaldivEl3.style.alignItems = "center";
        var modalP3 = document.createElement("p");
        modalP3.textContent = "Forecast: ";
        modalP3.classList.add("subtitle");
        modalP3.style.margin = "0px";
        var image3El = document.createElement("img");
        image3El.setAttribute("src", weatherObj.icon);
        image3El.style.width = "8%";
        var modalP3_2 = document.createElement("li");
        modalP3_2.style.marginBottom = "5px";
        var modalP3_3 = document.createElement("li");
        var modalP3_4 = document.createElement("li");
        var modalP3_5 = document.createElement("li");
        var modalP3_6 = document.createElement("li");
        modalP3_2.textContent = weatherObj.description;
        modalP3_3.textContent = weatherObj.rainProb;
        modalP3_4.textContent = weatherObj.humidity;
        modalP3_5.textContent = weatherObj.temp;
        modalP3_6.textContent = weatherObj.uvindex;
        var ulEl = document.createElement("ul");
        ulEl.classList.add("content");
        var hrEl = document.createElement("hr");
        hrEl.style.margin = "8px 0px 8px 0px";

        modalUl.appendChild(modalboxBlock1);
        modalUl.appendChild(modalboxBlock2);
        modalUl.appendChild(modalboxBlock3);
        modaldivEl3.appendChild(modalP3);
        modaldivEl3.appendChild(image3El);
        modalboxBlock3.appendChild(modaldivEl3);
        ulEl.appendChild(modalP3_2);
        ulEl.appendChild(modalP3_3);
        ulEl.appendChild(modalP3_4);
        ulEl.appendChild(modalP3_5);
        ulEl.appendChild(modalP3_6);
        modalboxBlock3.appendChild(hrEl);
        modalboxBlock3.appendChild(ulEl);

    } else {

        var modalboxBlock3 = document.createElement("li");
        modalboxBlock3.classList.add("box");
        modalboxBlock3.classList.add("block");
        var modalP3 = document.createElement("p");
        modalP3.textContent = "Weather data limit reached!";
        modalP3.style.color  = "red";

        modalboxBlock3.appendChild(modalP3);
        modalUl.appendChild(modalboxBlock1);
        modalUl.appendChild(modalboxBlock2);
        modalUl.appendChild(modalboxBlock3);

    }

    var modalboxBlock4 = document.createElement("li");
    modalboxBlock4.classList.add("box");
    modalboxBlock4.classList.add("block");
    var modalA4 = document.createElement("a");
    modalA4.textContent = "Book tickets here!";
    modalA4.setAttribute("href", dataObj.url);
    modalA4.setAttribute("target", "_blank");


    modal.appendChild(modalBackground);
    modal.appendChild(modalCard);

    modalCard.appendChild(modalheader);

    modalheader.appendChild(modalTitle);
    modalheader.appendChild(modalClose);

    modalCard.appendChild(modalBody);

    modalBody.appendChild(modalUl);

    modalboxBlock1.appendChild(imageEl);

    modalboxBlock2.appendChild(modalP1);

    modalUl.appendChild(modalboxBlock4);
    modalboxBlock4.appendChild(modalA4);

    modalClose.addEventListener("click", modalCloseHandler);

    document.body.appendChild(modal);
};

var modalBtnHandler = function(event) {

    var target = event.target;
    console.log(target);

    if (target.hasAttribute("data-date")) {

        var dataObject = {
            name: target.dataset.name,
            date: target.dataset.date, 
            id: target.dataset.id,
            image: target.dataset.image,
            time: target.dataset.time,
            url: target.dataset.url
        }

        weatherFetch(target.dataset.date, dataObject);

    }

};

var modalCloseHandler = function() {
    var modalEl = document.querySelector(".modal");
    modalEl.remove();
};

var weatherFetch = function(weatherDate, dataObject) {

    fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/${weatherDate}/${weatherDate}${wapiPrefix}${wapiKey}&unitGroup=us&contentType=json`)
    .then(function (res) {
    return res.json();
    })
    .then(function (data) {

        console.log(data);

        var humidity = "- Humidity: " + data.days[0].humidity + "%";
        var uvindex = "- UV index: " + data.days[0].uvindex;
        var rainProb = "- Precip. probability: " + data.days[0].precipprob + "%";
        var temp = "- Temperature: " + data.days[0].temp + "°F";

        weatherObj = {

            id: 0,
            description: data.days[0].description,
            icon: "./assets/images/" + data.days[0].icon + ".png",
            humidity: humidity,
            rainProb: rainProb,
            temp: temp,
            uvindex: uvindex

        };

    }).then(function() {

        modalConstructor(dataObject);

    })
    .catch(function() {

        weatherObj = {
            id: 1
        }

        modalConstructor(dataObject);

    })

};

searchResultsEl.addEventListener("click", modalBtnHandler);
cityButtonEl.addEventListener("click", cityInputHandler);

loadHistory();


/* 
=========
TO DO:
- Clean up and comment code
==========

*/