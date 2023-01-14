const qouteContainer = document.querySelector(".qoute-space");
const qouteText = document.querySelector("#qoute");
const authorText = document.querySelector("#author");
const twitterBtn = document.querySelector("#button");
const nextQoute = document.querySelector(".new-qoute");
const loader = document.querySelector(".loader");


let apiQoutes = [];

function loading(){
    loader.hidden = false;
    qouteContainer.hidden = true;
}

function complete(){
    qouteContainer.hidden = false;
    loader.hidden = true;
}

function newQoute(){
    loading();
    const qoute = apiQoutes[Math.floor(Math.random()*apiQoutes.length)];

    if(!qoute.author){
        authorText.textContent = "Unknown";
    }else{
        authorText.textContent = qoute.author;

    }

    if(qoute.text.length > 120){
        qouteText.classList.add("long-qoute");
    }else{
        qouteText.classList.remove("long-qoute");
    }
    qouteText.textContent = qoute.text;
    complete();
}

async function getQoutes(){
    loading();
    const URL = 'https://jacintodesign.github.io/quotes-api/data/quotes.json';
    try{
        const res = await fetch(URL);
        apiQoutes = await res.json();
        
        newQoute();
    }catch(error){
        
    }
    }

function tweetQoute(){
    const twitterURL = `https://twitter.com/intent/tweet?text=${qouteText.innerText} - ${authorText.innerText}`;
    window.open(twitterURL,"_blank")

}

document.addEventListener("DOMContentLoaded",()=>{
    getQoutes();
    nextQoute.addEventListener("click",newQoute);
    twitterBtn.addEventListener("click",tweetQoute);


})