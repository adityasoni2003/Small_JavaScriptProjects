document.addEventListener("DOMContentLoaded",()=>{
    document.querySelector(".currency-converter").addEventListener("submit",(event)=>{
        event.preventDefault();

        let myHeaders = new Headers();
        myHeaders.append('apikey',"c6U5tkCOcevx6rsaGASgVAvUB5NDAj2s");

        const requestOptions = {
            method:"GET",
            headers:myHeaders

        }

        const {target:{from,to,amount}} = event;
        fetch(`https://api.apilayer.com/exchangerates_data/convert?to=${to.value}&from=${from.value}&amount=${amount.valueAsNumber}`, requestOptions)
        .then(response => response.json())
        .then(data => {


            let {query:{to},info,date,result}=data;
            document.querySelector('#result').textContent = `As per the exchange rate ${info.rate} on ${date} for ${to} the converted value is ${result}`
        })
        .catch(error => console.log(error.message))

    })



})