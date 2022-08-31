// Element query selectors
var cityInputEl = document.querySelector("#cityInput");
var cityButtonEl = document.querySelector("#cityButton");
var ulEl = document.querySelector("#searchResults");
var searchResultsEl = document.querySelector("#searchResults");
var searchNavEl = document.querySelector("#eventsNav");
var filterOptionsEl = document.querySelector("#filterOptions");
var historyContainerEl = document.querySelector("#historyContainer");
var warningRefEl = document.querySelector("#warningRef");

// Global variables
var cityHistory = [];
var city = "";
var keyword = "";

// Global objects
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


// API variables (keys, urls, etc.)

// var wapiKey = "5XBMXPEKZSXAAJ3HZEUBPKXY4";
var wapiKey = "WXA7ZF59PVGG2FRSLSH256QVA";
var wapiPrefix = "?unitGroup=us&key=";

var apiKey = "M3zlk7OCkBc7AhFeAlbcYBIvwTxFzGlB";
var prefix = "https://app.ticketmaster.com";
var apiPrefix = "&apikey=";

/* 
=======================
Utility functions start 
=======================
*/

// Function which handles logic for removing children from a parent
var childDeconstructor = function(parent) {

    // While there is a firstchild to a parent, remove said child (until there are none)
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    };

};

/* 
=====================
Utility functions end 
=====================
*/


/* 
=======================
Handler functions start
=======================
*/

// Logic for city search bar submission
var cityInputHandler = function(event) {
    // Prevent form submission event
    event.preventDefault();
    // Take the value of the cityInput element
    var text = cityInputEl.value;

    // If the text is empty then..
    if (text === null || text === "") {

        // Surround search bar in red and display a warning message
        cityInputEl.classList.add("is-danger");
        var pEl = document.createElement("p");
        pEl.setAttribute("id", "warning");
        pEl.style.color = "red";
        pEl.textContent = "Input must not be empty!";
        warningRefEl.appendChild(pEl);
    
    //If the text is NOT empty then..
    } else {
        // Clear the value
        cityInputEl.value = "";
        // Use the stored value to fetch (should be a city name)
        ticketMasterFetch(text);
        // Construct the filter options section
        filterConstructor();
    }

};

// Logic for filter submission
var filterBtnHandler = function(event) {

    // Select the elements as they were not originally on the page
    var keywordInputEl = document.querySelector("#keywordInput");
    var selectEl = document.querySelector("#genreSelect");

    // Prevent form submission event
    event.preventDefault();

    // Create a case to check (for future filter expansion) to ensure the filter does nothing when nothing is selected
    // At the moment only one case exists
    var case1 = false;
    var case2 = false;

    // Set global variable equal to the keyword the user input
    keyword = keywordInputEl.value;

    // If the keyword is empty, set the keyword to "", this way the user can clear previous filters
    if (keywordInputEl.value == null || keywordInputEl.value == "") {
        keyword = "";
    } else {
        case2 = true;
    }

    // If the genre select menu has any other options selected than the default, then set case 1 to true
    if (selectEl.value != 0) {
        case1 = true;
    }

    // If case1 is true, then run the filterSelect function
    if (case1 == true || case2 == true) {
        filterSelect();
    }  

};

// Logic for the clear filters button
var clearFilterBtnHandler = function(event) {

    // Prevent default form submission event
    event.preventDefault();
    
    // Select elements
    var keywordInputEl = document.querySelector("#keywordInput");
    var selectEl = document.querySelector("#genreSelect");

    // Reset values
    keywordInputEl.value = "";
    selectEl.value = 0;
    keyword = "";

    // Fetch city with no filters applied
    ticketMasterFetch(city);

};

// Logic for clicking on a button of a city that was saved in localstorage
var historyBtnHandler = function(event) {

    // Prevent default form submission event
    event.preventDefault();
    var target = event.target;

    // Get target's text content
    var text = target.textContent;

    // Fetch based on that content and construct the filter options section
    ticketMasterFetch(text);
    filterConstructor();

};

// Logic for ensuring the target clicked on is a generated upcoming event
var modalBtnHandler = function(event) {

    var target = event.target;

    // Checks to see if the target has the data-date attribute
    if (target.hasAttribute("data-date")) {

        // If so, packages a dataObject with relevant date from the element clicked on
        var dataObject = {
            name: target.dataset.name,
            date: target.dataset.date, 
            id: target.dataset.id,
            image: target.dataset.image,
            time: target.dataset.time,
            url: target.dataset.url
        }

        // Preforms a weather fetch using the date, and sends the packaged object into the function for other usage
        weatherFetch(target.dataset.date, dataObject);

    }

};

// Logic for closing the modal
var modalCloseHandler = function() {
    // Selects the modal and removes it from the page
    var modalEl = document.querySelector(".modal");
    modalEl.remove();
};

// Logic for selecting a genre to filter by
var filterSelect = function() {

    // Get the select menu element
    var selectEl = document.querySelector("#genreSelect");

    // Assigns the appropriate ticketmaster ids to each genre
    var sportsID = "KZFzniwnSyZfZ7v7nE";
    var musicID = "KZFzniwnSyZfZ7v7nJ";
    var artsID = "KZFzniwnSyZfZ7v7na";
    var noID = "";

    // Checks which genre is selected and then calls the filter fetch function with that ID
    if(selectEl.value==1) {
        filterFetch(musicID);
    } else if(selectEl.value==2) {
        filterFetch(sportsID);
    } else if(selectEl.value==3) {
        filterFetch(artsID);
    } else {
        filterFetch(noID);
    }

};

/* 
=====================
Handler functions end 
=====================
*/


/* 
=====================
Fetch functions start 
=====================
*/

// Logic for initial ticketmaster fetch (from search bar)
var ticketMasterFetch = function(cityName) {

    // Deconstructs previous results / elements if there are any
    childDeconstructor(searchResultsEl);
    childDeconstructor(searchNavEl);

    // If the city input has a class of is-danger
    if (cityInputEl.matches(".is-danger")) {
        // remove it, and the warning p element we placed underneath
        var warn = document.querySelector("#warning");
        warn.remove();
        cityInputEl.classList.remove("is-danger");
    }

    // trim and lowercase the argument we called this function with
    city = cityName.trim().toLowerCase();

    // Fetch using our api key and the city name
    fetch(`https://app.ticketmaster.com/discovery/v2/events.json?city=${city}&sort=date,asc&radius=20&unit=miles&apikey=${apiKey}`)
        .then(function (res) {
            // Turn the response to json
            return res.json();
        })
        .then(function (data) {
            // Set attributes in the pageData object to their respective values
            pageData.nextPageURL = data._links.next.href;
            pageData.firstPageURL = data._links.first.href;
            pageData.lastPageURL = data._links.last.href;
            pageData.selfURL = data._links.self.href;
            // Call ticketmaster stats with the data we recieved
            ticketMasterStats(data);

            // If the cityHistory array has a length of 0
            if (cityHistory.length === 0) {

                // Create a historyObject with its name attribute set to the current city
                var historyObject = {
                    name: city
                }
                
                // Unshift adds the historyObject to the start of the array
                cityHistory.unshift(historyObject);
                // Save the search history
                saveHistory();

                // Deconstruct and then reconstruct the history elements
                childDeconstructor(historyContainerEl)
                historyConstructor();
            
            // If the history length is greater than 0 but less than 8
            } else if (cityHistory.length < 8) {

                // Loop for each element in the array
                for (i = 0; i < cityHistory.length; i++) {
                    
                   // If an element is found with the same name as our current city, break out of the loop
                   if (cityHistory[i].name === city) {
        
                        break;
                    
                    // If the loop reaches the end, then add the city to our cityHistory array
                    } else if (i === cityHistory.length - 1) {
        
                        var historyObject = {
                            name: city
                        }
            
                        cityHistory.unshift(historyObject);
        
                        saveHistory();
                        childDeconstructor(historyContainerEl)
                        historyConstructor();

                        // And break out of the loop
                        break;
        
                    }
                }
            
            // If the history is equal to or greater than 8
            } else {
        
                // Loop for each element in the array
                for (i = 0; i < cityHistory.length; i++) {
        
                    // If an element is found with the same name as our current city, break out of the loop
                    if (cityHistory[i].name === city) {
        
                         break;
        
                    // If the loop reaches the end, then add the city to our cityHistory array AND remove the final item
                    } else if (i === cityHistory.length - 1) {
        
                        var historyObject = {
                            name: city
                        }
        
                        cityHistory.pop()
                        cityHistory.unshift(historyObject);
        
                        saveHistory();
                        childDeconstructor(historyContainerEl)
                        historyConstructor();
                        // Break out of the loop
                        break;
        
                    }
        
                }
            }

        })
        // If an error occurs, display the pEl
        .catch(function() {
            var pEl = document.createElement("p");
            pEl.textContent = "Could not process request!";
            pEl.classList.add("subtitle");
            searchResultsEl.appendChild(pEl);
        })

};

// Logic for fetching the next page (for next page button)
var nextPageFetch = function() {

    // Deconstruct existing results
    childDeconstructor(searchResultsEl);
    childDeconstructor(searchNavEl);

    // Fetch using our saved pageData.nextpageURL
    // Apply much of the same logic from our ticketMasterFetch function
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

// Logic for fetching the previous page (for prev page button)
var prevPageFetch = function() {
    
    // Deconstruct existing results
    childDeconstructor(searchResultsEl);
    childDeconstructor(searchNavEl);

    // Fetch using our saved pageData.prevPageURL
    // Apply much of the same logic from our ticketMasterFetch function
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

// Logic for fetching the first page (for paginator)
var firstPageFetch = function() {

    // Deconstruct existing results
    childDeconstructor(searchResultsEl);
    childDeconstructor(searchNavEl);

    // Fetch using our saved pageData.firstPageURL
    // Apply much of the same logic from our ticketMasterFetch function
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

// Logic for fetching the last page (for paginator)
var lastPageFetch = function() {

    // Deconstruct existing results
    childDeconstructor(searchResultsEl);
    childDeconstructor(searchNavEl);

    // Fetch using our saved pageData.lastPageURL
    // Apply much of the same logic from our ticketMasterFetch function
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

// Logic for fetching with filters applied
var filterFetch = function(genreTxt) {

    // Creates an element set to our argument
    var genre = genreTxt;

    // Gets the selfURL from our global pageData object, and splits it into an array where classificationID= is found
    var splittxt = pageData.selfURL.split("classificationId=");

    // Sets the array index of 1 to our specified content
    splittxt[1] = `&classificationId=${genre}`;

    // Splits the string at the index of 0 in our splittxt array where keyword= is found
    var splittxt2 = splittxt[0].split("keyword=")
    // Sets the array index of 1 to our specified content
    splittxt2[1] = `&keyword=${keyword}`

    // Joins the split array into one string
    var joinedtxt2 = splittxt2.join('');

    // Sets the array index of 0 to the newly joined string
    splittxt[0] = joinedtxt2;

    // Joins the string with our newly joined string and our specified content
    var joinedtxt = splittxt.join('');

    // Puts together a URL using our global variables and our newly joined content
    var joinedURL = `${prefix}${joinedtxt}${apiPrefix}${apiKey}`;

    // Deconstructs existing results
    childDeconstructor(searchResultsEl);
    childDeconstructor(searchNavEl);

    // Fetches using our URL
    fetch(`${joinedURL}`)
        .then(function(res) {
            return res.json();
        })
        .then(function(data) {
            pageData.currentPageNumber = data.page.number + 1;

            // Checks to see if these elements exist, if not then sets to false for first / last page (used for logic later)
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

            // Calls ticketMasterStats and currentPageConbstructor
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

// Logic for fetching weather data
var weatherFetch = function(weatherDate, dataObject) {

    // Fetches using our city and date passed through as an argument
    fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/${weatherDate}/${weatherDate}${wapiPrefix}${wapiKey}&unitGroup=us&contentType=json`)
    .then(function (res) {
    return res.json();
    })
    .then(function (data) {

        // Creates variables with our fetched data
        var humidity = "- Humidity: " + data.days[0].humidity + "%";
        var uvindex = "- UV index: " + data.days[0].uvindex;
        var rainProb = "- Precip. probability: " + data.days[0].precipprob + "%";
        var temp = "- Temperature: " + data.days[0].temp + "°F";

        // Packages our data into an object. Id of 0 indicates that we were able to get to this stage in our fetch function
        weatherObj = {

            id: 0,
            description: data.days[0].description,
            icon: "./assets/images/" + data.days[0].icon + ".png",
            humidity: humidity,
            rainProb: rainProb,
            temp: temp,
            uvindex: uvindex

        };

    // Calls the modal constructor once all data has been fetched
    }).then(function() {

        modalConstructor(dataObject);

    })
    // If data cannot be fetched..
    .catch(function() {

        // Sets the object's id to 1, indicates a failure. Used for later logic
        weatherObj = {
            id: 1
        }

        // Calls constructor anyways
        modalConstructor(dataObject);

    })

};

/*
===================
Fetch functions end 
===================
*/ 


/*
===========================
Constructor functions start
===========================
*/

// Logic for constructing and displaying results, and packaging data into an object for another constructor to use
var ticketMasterStats = function(data) {

    // Gets the total results from api call and sets it to our results variable
    var results = data.page.totalElements;

    // Gets the total pages from api call and sets it to our totalPages attribute in the pageData object
    pageData.totalPages = data.page.totalPages;

    // Creates a p element
    var pEl = document.createElement("p");

    // Adds classes to it
    pEl.classList.add("subtitle");
    pEl.classList.add("upcomingEventsFormat");

    // Displays the results in the text content
    pEl.textContent = "Results: " + results;

    // Appends the p element
    ulEl.appendChild(pEl);

    // Loops for the length of events returned by our api
    for (i=0; i < data._embedded.events.length; i++) {

        // Sets the data we want from the event index the loop is on to these variables
        var name = data._embedded.events[i].name
        var segment = data._embedded.events[i].classifications[0].segment.name
        var date = data._embedded.events[i].dates.start.localDate
        var url = data._embedded.events[i].url
        var imageURL = data._embedded.events[i].images[0].url
        var time = data._embedded.events[i].dates.start.localTime;

        // Packages the data into an object
        var eventStats = {
            id: i,
            name: name,
            segment: segment,
            date: date,
            url: url,
            image: imageURL,
            time: time
        }

        // Calls the upcomingEventsConstructor using the packaged data
        upcomingEventsConstructor(eventStats);

        // Once we reach the last item in our array, call the nav constructor (constructs paginator)
        if (i === data._embedded.events.length - 1) {
            upcomingEventsNavConstructor();
                // Select elements once constructed
                var firstPageEl = document.querySelector("#firstPage");
                var lastPageEl = document.querySelector("#lastPage");

                // Sets text content of selected elements
                firstPageEl.textContent = 1;
                lastPageEl.textContent = pageData.totalPages;
        };

    };

};

// Logic for constructing each event onto the page
var upcomingEventsConstructor = function(data) {

    // Creates elements
    var liEl = document.createElement("li");
    var pEl = document.createElement("p");

    // Adds classes
    liEl.classList.add("box");

    // Creates variable for access later
    var formattedTime = "";

    // Checks to see if there is a data.time, if not, then set our variable to "Time not disclosed"
    if (data.time===undefined || data.time=== null || data.time === "") {
        formattedTime = "Time not disclosed";

    //Otherwise.. 
    } else {

        // Credit: https://stackoverflow.com/questions/29206453/best-way-to-convert-military-time-to-standard-time-in-javascript
        
        // Get our military time input
        var time = data.time; 

        // Split into an array
        time = time.split(':'); 

        // Set variables equal to our array indexes
        var hours = Number(time[0]);
        var minutes = Number(time[1]);
        var seconds = Number(time[2]);

        // Initialize variable
        var timeValue;

        // Convert hours to UTC
        if (hours > 0 && hours <= 12) {
        timeValue= "" + hours;
        } else if (hours > 12) {
        timeValue= "" + (hours - 12);
        } else if (hours == 0) {
        timeValue= "12";
        }
        
        // Merges our formatted hours with our formatted minutes and seconds

        timeValue += (minutes < 10) ? ":0" + minutes : ":" + minutes;  // get minutes
        timeValue += (seconds < 10) ? ":0" + seconds : ":" + seconds;  // get seconds
        timeValue += (hours >= 12) ? " P.M." : " A.M.";  // get AM/PM

        formattedTime = timeValue;

    }

    // Creates a p Element
    pEl.textContent = data.name + " - " + data.date + " - " + data.segment;

    // Sets our desired attributes to the appropriate data
    pEl.setAttribute("data-date", data.date);
    pEl.setAttribute("data-name", data.name);
    pEl.setAttribute("id", data.id);
    pEl.setAttribute("data-image", data.image);
    pEl.setAttribute("data-url", data.url);
    pEl.setAttribute("data-time", formattedTime);

    // Appends elements
    liEl.appendChild(pEl);
    ulEl.appendChild(liEl);

};

// Logic for constructing the pagination bar
var upcomingEventsNavConstructor = function() {

    // Creates elements
    var ulEl = document.createElement("ul");
    var pageFirstEl = document.createElement("li");
    var pageEndEl = document.createElement("li");
    var liEl = document.createElement("li");
    var a1El = document.createElement("a");
    var a2El = document.createElement("a");

    // Sets attributes
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

    // Appends elements
    ulEl.appendChild(pageFirstEl);
    ulEl.appendChild(liEl);
    ulEl.appendChild(pageEndEl);

    searchNavEl.appendChild(ulEl);
    searchNavEl.appendChild(a1El);
    searchNavEl.appendChild(a2El);

    // Adds event listeners
    a2El.addEventListener("click", nextPageFetch);
    a1El.addEventListener("click", prevPageFetch);
    pageFirstEl.addEventListener("click", firstPageFetch);
    pageEndEl.addEventListener("click", lastPageFetch);

};

// Constructor logic to display the current page the user is on (in our fetched data)
var currentPageConstructor = function() {

    if (pageData.firstPageURL == false || pageData.lastPageURL == false) {
        // If there is only one page of content (no lastpage or first page urls), deconstruct the nav bar
        childDeconstructor(searchNavEl);
    // Otherwise.. 
    } else if (pageData.currentPageNumber === 1 || pageData.currentPageNumber === pageData.totalPages) {

        // If we're on page 1 or the last page

        // Construct these elements
        var ulEl = document.querySelector(".pagination-list");
        var firstPageEl = document.querySelector("#firstPage");
        var lastPageEl = document.querySelector("#lastPage");
        var fillerEl1 = document.querySelector(".pagination-ellipsis");

        // If on first page, give the is-current class to the first pagination element
        if (pageData.currentPageNumber === 1) {
            firstPageEl.classList.add("is-current");
            lastPageEl.classList.remove("is-current");
        // Otherwise, give it to the second pagination element
        } else {
            lastPageEl.classList.add("is-current");
            firstPageEl.classList.remove("is-current");
        }

        // Append elements
        ulEl.appendChild(firstPageEl);
        ulEl.appendChild(fillerEl1);
        ulEl.appendChild(lastPageEl);

    // Otherwise.. 
    } else {

        // Construct these elements
        var ulEl = document.querySelector(".pagination-list");
        var firstPageEl = document.querySelector("#firstPage");
        var lastPageEl = document.querySelector("#lastPage");
        var fillerEl1 = document.querySelector(".pagination-ellipsis")
        
        var fillerEl2 = document.createElement("li");
        var liEl = document.createElement("li");
        
        // Set their attributes
        liEl.classList.add("pagination-link");
        liEl.classList.add("is-current");
        liEl.setAttribute("id", "currentPage");
        liEl.textContent = pageData.currentPageNumber;

        fillerEl2.classList.add("pagination-ellipsis");
        fillerEl2.textContent = "...";

        firstPageEl.classList.remove("is-current");

        // Append elements
        ulEl.appendChild(firstPageEl);
        ulEl.appendChild(fillerEl1);
        ulEl.appendChild(liEl);
        ulEl.appendChild(fillerEl2);
        ulEl.appendChild(lastPageEl);   

    };

};

// Constructor logic for filter options section
var filterConstructor = function() {

    // Deconstructs previous elements
    childDeconstructor(filterOptionsEl);

    // Creates elements
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


    // Sets their attributes
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

    // Appends elements
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
    
    filterOptionsEl.appendChild(hrEl2);

    // Adds event listeners
    buttonEl.addEventListener("click", filterBtnHandler);
    buttonEl2.addEventListener("click", clearFilterBtnHandler);

};

// Constructor logic for the history section
var historyConstructor = function() {

    // Creates elements
    var hrEl = document.createElement("hr");
    var hrEl2 = document.createElement("hr");
    // Appends first hr
    historyContainerEl.appendChild(hrEl);

    // Loops through our cityHistory length
    for (i=0; i < cityHistory.length; i++) {
        // Creates a button element for each index in the array, sets its text content to the city name and adds an event listener
        var buttonEl = document.createElement("button");
        buttonEl.style.textTransform = "capitalize";
        buttonEl.textContent = cityHistory[i].name;
        buttonEl.classList.add("button");
        buttonEl.classList.add("is-light");
        buttonEl.classList.add("historyBtn");
        historyContainerEl.appendChild(buttonEl);
        buttonEl.addEventListener("click", historyBtnHandler);

        // Once at the end of the array, give the last button a style of 0px margin bottom
        if (i === cityHistory.length - 1) {
            buttonEl.style.marginBottom = "0px";
        }
    }

    // Appends second hr
    historyContainerEl.appendChild(hrEl2);

};

// Constructor logic for modals
var modalConstructor = function(dataObj) {

    // Creates div and sets classes
    var modal = document.createElement("div");
    modal.classList.add("modal");
    modal.classList.add("is-active");

    // Creates div and sets classes
    var modalBackground = document.createElement("div");
    modalBackground.classList.add("modal-background");

    // Creates div and sets classes
    var modalCard = document.createElement("div");
    modalCard.classList.add("modal-card");

    // Creates header element and sets classes
    var modalheader = document.createElement("header");
    modalheader.classList.add("modal-card-head");

    // Creates p element and sets attributes
    var modalTitle = document.createElement("p");
    modalTitle.classList.add("modal-card-title");
    modalTitle.classList.add("has-text-centered");
    modalTitle.textContent = dataObj.name;

    // Creates close button element and sets attributes
    var modalClose = document.createElement("button");
    modalClose.classList.add("delete");
    modalClose.setAttribute("aria-label", "close");

    // Creates section element and sets attributes
    var modalBody = document.createElement("section");
    modalBody.classList.add("modal-card-body");

    // Creates ul element and sets attributes
    var modalUl = document.createElement("ul");
    modalUl.setAttribute("id", "display-events");

    // Creates li element and sets attributes
    var modalboxBlock1 = document.createElement("li");
    modalboxBlock1.classList.add("box");
    modalboxBlock1.classList.add("block");

    // Creates p element and sets attributes
    var modalP1 = document.createElement("p");
    modalP1.classList.add("subtitle");
    modalP1.textContent = dataObj.date + " | " + dataObj.time;

    // Creates li element and sets attributes
    var modalboxBlock2 = document.createElement("li");
    modalboxBlock2.classList.add("box");
    modalboxBlock2.classList.add("block"); 

    // Creates image element and sets attributes
    var imageEl = document.createElement("img");
    imageEl.setAttribute("src", dataObj.image);
    imageEl.style.backgroundSize = "cover";
    imageEl.style.width = "100%";

    // If global object weatherObj has an id of 0, then..
    if (weatherObj.id === 0) {

        // Create these elements displaying the weather data
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

    // Otherwise..
    } else {

        // Create these elements stating our weather data for the day has been reached (max 50 requests per day without paying)
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

    // Create li element and add attributes
    var modalboxBlock4 = document.createElement("li");
    modalboxBlock4.classList.add("box");
    modalboxBlock4.classList.add("block");

    // Create a element and add attributes
    var modalA4 = document.createElement("a");
    modalA4.textContent = "Book tickets here!";
    modalA4.setAttribute("href", dataObj.url);
    modalA4.setAttribute("target", "_blank");


    // Append elements
    modal.appendChild(modalBackground);
    modal.appendChild(modalCard);

    modalCard.appendChild(modalheader);

    modalheader.appendChild(modalTitle);
    modalBody.appendChild(modalClose);

    modalCard.appendChild(modalBody);

    modalBody.appendChild(modalUl);

    modalboxBlock1.appendChild(imageEl);

    modalboxBlock2.appendChild(modalP1);

    modalUl.appendChild(modalboxBlock4);
    modalboxBlock4.appendChild(modalA4);

    // Add event listener to close button
    modalClose.addEventListener("click", modalCloseHandler);

    // Append modal to body
    document.body.appendChild(modal);
};

/* 
=========================
Constructor functions end 
=========================
*/

/*
============================ 
Localstorage functions start
============================
*/ 

// Save logic for array
var saveHistory = function() {
    // Sets stringified cityHistory to our specified key in local storage
    localStorage.setItem("historyRgy6Ne7NjPR3", JSON.stringify(cityHistory))

};

// Load logic for array
var loadHistory = function() {

    // Parses data from local storage using our key
    var loadedHistory = JSON.parse(localStorage.getItem("historyRgy6Ne7NjPR3"));

    // If nothing is found, return false,
    if (!loadedHistory) {
        return false;
    // Otherwise, set our global cityHistory variable equal to the array we just parsed
    } else {
        cityHistory = loadedHistory;
        // And construct the parsed elements onto the page
        historyConstructor();
    }

};

/* 
===========================
Local storage functions end
===========================
*/

// Adds event listeners
searchResultsEl.addEventListener("click", modalBtnHandler);
cityButtonEl.addEventListener("click", cityInputHandler);

// Loads history from local storage
loadHistory();