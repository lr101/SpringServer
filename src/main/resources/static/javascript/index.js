let length = 0;
function getData() {

    let date = new Date(new Date().getTime());
    date.setMinutes(date.getMinutes() - 10);
    date = date.getTime();
    for (let i = 0; i < length; i++) {

        let id = document.getElementById("sensor_" + i).getAttribute("data-id");
        const ajax = new XMLHttpRequest();
        ajax.open("GET", "/sensors/" + id + "?date2=" + date + "&limit=1" , true);
        ajax.send(null);
        ajax.onreadystatechange = function() {
            if (ajax.readyState === 4) {
                let list = JSON.parse(ajax.responseText);
                if (list.length === 0) {
                    document.getElementById("value_" + i).innerHTML = "No Data available";
                } else {
                    let unit = document.getElementById("value_" + i).getAttribute("data-unit");
                    document.getElementById("value_" + i).innerHTML = "Current: " + list[list.length - 1].entryValue + unit;
                }
            }
        };
    }
}

function setListeners(classSelector) {
    let sensorPlaceDOM = document.querySelectorAll(classSelector);
    for (let i = 0; i < sensorPlaceDOM.length; i++) {
        const element = sensorPlaceDOM[i];
        let id = element.firstElementChild.firstElementChild.getAttribute("data-id");
        element.firstElementChild.lastElementChild.setAttribute("value", id);
        element.action = id === "config" ? "/config" : "/display?sensor_id=" + id;
        element.addEventListener("click", function () {
            element.submit();
        });
    }
}

/**
 * on startup
 */
$(function() {

    length = document.getElementById("main").getAttribute("data-length");
    setListeners(".col-md-3", )
    getData();
    setInterval(getData, 20000);
});