document.addEventListener("DOMContentLoaded", function() {
    console.log("dokumentti ladattu!");

    document.querySelectorAll("form.drink-form").forEach((element) => {
        element.addEventListener("submit", function(event) {
            event.preventDefault();

            let data = new FormData(element);
            addDrink(data.get("alcvol"), data.get("volume"), Math.floor(Math.random() * 7200), 'id-' + Math.random(1, 1234567));

        });
    });
    const personForm = document.getElementById("personform");
    personForm.addEventListener("submit", function(event) {
        event.preventDefault();
        let data = new FormData(personForm);

        setPerson(data.get("gender"), data.get("weight"));

    });

    document.querySelectorAll(".action button").forEach((element) => {
        element.addEventListener("click", function(event) {
            event.preventDefault();
            const parent = element.closest('li');
            parent.classList.add('fadeout');
            setTimeout(function() {
                parent.remove();
            }, 2000);
        });
    });


});

const UUID_KEY = "personUUID";

function addDrink(alcvol, volume, seconds, id) {
    let template = document.querySelector('#drinkrow');
    let li = template.content.cloneNode(true).querySelector('li');

    li.querySelector(".size").innerHTML = volume;
    li.querySelector(".alc").innerHTML = alcvol + "%";
    li.querySelector(".time").innerHTML = seconds + "s";
    
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

    if (uuid) {
        // on olemassa, päivitetään henkilö
        console.log("Hienoa! Olet olemassa, minäpä päivitän sinut!");
    } else {
        // ei ole olemassa, eli pitää luoda uusi henkilö
        console.log("Henkilöä ei ole olemassa, tee sellainen");
    }

}