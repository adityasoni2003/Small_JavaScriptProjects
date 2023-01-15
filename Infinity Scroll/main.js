const imageContainer = document.querySelector(".image-container");
const loader = document.querySelector(".loader");




const ApiKey = "EePikT3Nq_hOikVqjMSqiJw5o9HQtjvytrxIwTrLvtQ";
const topic = 'football';
const count = 20;

const APIUrl = `https://api.unsplash.com/photos/random/
?client_id=${ApiKey}&count=${count}`;

function helpSetAtrribute(ele, attributes) {

    for (let key in attributes) {
        ele.setAttribute(key, attributes[key]);
    }
}

function displayPhotos(ArrayPhoto) {
    ArrayPhoto.forEach((photo) => {
        const item = document.createElement('a');
        helpSetAtrribute(item, {
            "href": photo.links.html,
            target: "_blank"
        })
        const img = document.createElement('img');
        helpSetAtrribute(img, { src: photo.urls.regular, alt: photo.alt_description, title: photo.alt_description })
        item.appendChild(img);
        imageContainer.appendChild(item);

    });

}

async function fetchImages(url) {
    try {
        let res = await fetch(APIUrl);
        return res.json();
    } catch (error) {
        console.log(error.message);
    }
}


document.addEventListener("DOMContentLoaded", async () => {
    const imagesArray = await fetchImages(APIUrl);
    displayPhotos(imagesArray);
    window.addEventListener('scroll', async () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000) {
            imagesArray = [];
            imagesArray.push(await fetchImages(APIUrl));
            displayPhotos(imagesArray);
        }
    })



})