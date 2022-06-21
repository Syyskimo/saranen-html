document.addEventListener("DOMContentLoaded", function() {

    document.querySelectorAll("form.drink-form").forEach((element) => {
        element.addEventListener("submit", function(event) {
            event.preventDefault();

            let formData = new FormData(element);

            const baseData = {
                alcvol: formData.get("alcvol"), 
                volume: formData.get("volume")
            };

            fetch(API + "/person/" + getPersonUUID() + "/drink?" + new URLSearchParams(baseData))
            .then(response => response.json())
            .then(data => {
                addDrink(formData.get("alcvol"), formData.get("volume"), Math.floor(Math.random() * 7200), 'id-' + Math.random(1, 1234567));
                updateData(data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });      

        });
    });
    const personForm = document.getElementById("personform");
    personForm.addEventListener("submit", function(event) {
        event.preventDefault();
        let data = new FormData(personForm);

        setPerson(data.get("gender"), data.get("weight"));

    });


     document.querySelector("ul.drinks").addEventListener("click", function(event) {
        if (!event.target.classList.contains("remove")) {
            return;
        }
        
        event.preventDefault();
        const parent = event.target.closest('li');
        parent.classList.add('fadeout');

        fetch(API + "/person/" + getPersonUUID() + "/undrink/" +  event.target.dataset.uuid)
        .then(response => response.json())
        .then(data => {
            updateData(data, false);
        })
        .catch((error) => {
            console.error('Error:', error);
        });  

        setTimeout(function() {
            parent.remove();
        }, 2000);
    });

    
    refreshPerson();

});

const UUID_KEY = "personUUID";

const API = "https://drink.syyskimo.com";
//const API = "http://localhost:8080";

function addDrink(alcvol, volume, seconds, id) {
    let template = document.querySelector('#drinkrow');
    let li = template.content.cloneNode(true).querySelector('li');

    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    minutes = minutes % 60;

    li.querySelector(".size").innerHTML = `<i class="fa-solid ${getSizeIconClass(volume)}"></i> <span class="info">(${(volume + "").replace(".", ",")}l)</span>`;
    li.querySelector(".alc").innerHTML = `${(alcvol + "").replace(".", ",")}%<span class="info">(${getAlcVolDescription(alcvol)})</span>`;
    li.querySelector(".time").innerHTML = (hours > 0 ? hours + "h " : "") + minutes + "m";
    li.querySelector("button.remove").dataset.uuid = id;
    
    document.querySelector('ul.drinks').appendChild(li);

}


function promilleAction(p) {

    const logo = document.getElementById("logo");
    const pro = document.getElementById("promile");
    let degree = Math.round(p * 90);
    logo.style.transform = `rotate(${degree}deg)`;
    pro.innerHTML = (Math.round(p * 100) / 100);
}


function setPersonUUID(uuid) {
    localStorage.setItem(UUID_KEY, uuid);
}

function getPersonUUID() {
    return localStorage.getItem(UUID_KEY);
}

function setPerson(female, weight) {
    let uuid = getPersonUUID();

    console.log("sukupuoli: " + female + " paino: " + weight);

    const baseData = { 
        female: (female == "maiden"),
        weight: weight
    };

    if (uuid) {
        // on olemassa, päivitetään henkilö
        console.log("Hienoa! Olet olemassa, minäpä päivitän sinut!");

        fetch(API + "/person/" + uuid + "/update?" + new URLSearchParams(baseData))
        .then(response => response.json())
        .then(data => {
            updateData(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    } else {
        // ei ole olemassa, eli pitää luoda uusi henkilö
        console.log("Henkilöä ei ole olemassa, tee sellainen");

        fetch(API + "/person/create?" + new URLSearchParams(baseData))
        .then(response => response.json())
        .then(data => {
            setPersonUUID(data.uuid);
            updateData(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

}

function updateData(data, reloadDrinks = true) {
    console.log(data);
    promilleAction(data.promile);

    if (reloadDrinks) {
        document.querySelector("ul.drinks").innerHTML = "";

        for (const drink of data.drinks) {
            addDrink(drink.alcVol, drink.volume, drink.secondsSince, drink.id);
        }

    }

}

function refreshPerson() {
    let uuid = getPersonUUID();
    if (uuid) {
        fetch(API + "/person/" + uuid)
        .then(response => response.json())
        .then(data => {
            updateData(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });        

    }
}

function getSizeIconClass(volume) {
    if (volume < 0.1) {
        return 'fa-whiskey-glass';
    } else if (volume < 0.25) {
        return 'fa-wine-glass';
    } else if (volume < 0.36) {
        return 'fa-wine-glass-empty';
    } else {
        return 'fa-beer-mug-empty';
    }
}

function getAlcVolDescription(alcvol) {
    if (alcvol < 6) {
        return 'Keskiolut';
    } else if (alcvol < 10) {
        return 'Westons';
    } else if (alcvol < 25) {
        return 'Viini';
    } else {
        return 'Tiukka';
    }
}