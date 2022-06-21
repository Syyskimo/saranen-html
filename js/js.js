document.addEventListener("DOMContentLoaded", function() {
    console.log("dokumentti ladattu!");

    document.querySelectorAll("form.drink-form").forEach((element) => {
        element.addEventListener("submit", function(event) {
            event.preventDefault();

            let data = new FormData(element);
            addDrink(data.get("alcvol"), data.get("volume"));

        });
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

function addDrink(alcvol, volume) {
    let template = document.querySelector('#drinkrow');
    let li = template.content.cloneNode(true).querySelector('li');

    li.querySelector(".size").innerHTML = volume;
    li.querySelector(".alc").innerHTML = alcvol + "%";
    
    document.querySelector('ul.drinks').appendChild(li);

}


function promilleAction(p) {

    const logo = document.getElementById("logo");
    const pro = document.getElementById("promile");
    let degree = Math.round(p * 90);
    logo.style.transform = `rotate(${degree}deg)`;
    pro.innerHTML = (Math.round(p * 100) / 100);
}

