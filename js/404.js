let counter = 0;

let text = [];

const MS = 20;

function init(){
    setTimeout(tickFunction, MS);  
    for(let i = 0; i < 3; i++)
        text[i] = document.getElementById(i);
}

function tickFunction(){
    counter++;
    let string = counter.toString().padStart(3, '0');

    for(let i = 0; i < 3; i++){
        if(i != 2){
            if(text[i].textContent != string[i]){ 
                if(i == 0){     
                    text[i].classList.remove("slow-animate");
                    void text[i].offsetWidth;
                    text[i].classList.add("slow-animate");
                } else {
                    text[i].classList.remove("fast-animate");
                    void text[i].offsetWidth;
                    text[i].classList.add("fast-animate");
                }
            }
        }
        text[i].textContent = string[i];
    }

    if(counter != 404)
        setTimeout(tickFunction, MS);
}