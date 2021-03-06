/**
 * logic
 */

function select(sensor_category, sensor_category_id) {
    const editElement = document.getElementById("categoryName");
    editElement.value = sensor_category;
    editElement.setAttribute("data-id", sensor_category_id);
}


function submitData() {
    const sensor_category = document.getElementById("categoryName").value;
    const sensor_category_id = document.getElementById("categoryName").getAttribute("data-id");
    const ajax = new XMLHttpRequest();

    let json;
    if (sensor_category_id !== "" ) {
        ajax.open("PUT", "/sensors/categories/", true);
        json = {sensorCategory : sensor_category, id :sensor_category_id}
    } else if (sensor_category_id === "") {
        ajax.open("POST", "/sensors/categories/", true);
        json = {sensorCategory : sensor_category, id: 0}
    }
    if (json !== undefined && sensor_category.length > 0) {
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send(JSON.stringify(json));
        ajax.onreadystatechange = function () {
            if (ajax.readyState === 4) {
                if (ajax.status === 200) {
                    updateCategories();

                } else {
                    alert(ajax.responseText);
                }
            }
        };
    }
}

function updateCategories() {
    const ajax = new XMLHttpRequest();
    ajax.open("GET", "/sensors/categories/", true);
    ajax.send();
    ajax.onreadystatechange = function() {
        if (ajax.readyState === 4) {
            if(ajax.status === 200) {
                const listElement = document.getElementById("list");
                listElement.textContent = '';
                const data = JSON.parse(ajax.responseText);
                for (let i = 0; i < data.length + 1; i++) {
                    let btn = document.createElement("button");
                    btn.classList.add('list-group-item','list-group-item-action');
                    if (i === data.length) btn.classList.add('active');
                    btn.id = "list_" + (i === data.length ? "new" : data[i].sensor_category_id);
                    btn.setAttribute("category", "button");
                    btn.setAttribute("data-toggle", "list");
                    btn.setAttribute("onclick", (i === data.length ? "select('','')" : "select('" + data[i].sensorCategory + "','" + data[i].id + "')"));
                    btn.innerHTML = (i === data.length ? "+" : data[i].sensorCategory);
                    listElement.appendChild(btn);
                }
                document.getElementById("categoryName").value = "";
                document.getElementById("categoryName").setAttribute("data-id", "");
            } else {
                alert(ajax.responseText);
            }
        }
    };
}

document.getElementById("submit").addEventListener("click", function () {
    submitData();
});

document.getElementById("delete").addEventListener("click", function () {
    const sensor_category_id = document.getElementById("categoryName").getAttribute("data-id");
    const ajax = new XMLHttpRequest();
    ajax.open("DELETE", "/sensors/categories/" + sensor_category_id, true);
    ajax.send();
    ajax.onreadystatechange = function () {
        if (ajax.readyState === 4) {
            if (ajax.status === 200) {
                updateCategories();
            } else {
                alert(ajax.responseText);
            }
        }
    }
});