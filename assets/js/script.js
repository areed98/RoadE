var cityInputEl = document.querySelector("#cityInput");

var cityInputGetter = function(event) {
    event.preventDefault();
    var text = cityInputEl.value;
    console.log(text);
}

cityInputEl.addEventListener("click", cityInputGetter);