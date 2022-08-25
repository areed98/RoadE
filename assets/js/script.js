var cityInputEl = document.querySelector("#cityInput");
var cityButtonEl = document.querySelector("#cityButton");

var cityInputGetter = function(event) {
    event.preventDefault();
    var text = cityInputEl.value;
    console.log(text);
}

cityButtonEl.addEventListener("click", cityInputGetter);