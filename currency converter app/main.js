document.addEventListener("DOMContentLoaded", async () => {

    let myHeaders = new Headers();
    myHeaders.append('apikey', "c6U5tkCOcevx6rsaGASgVAvUB5NDAj2s");

    const requestOptions = {
        method: "GET",
        headers: myHeaders

    }
    document.querySelector(".currency-converter").addEventListener("submit", async (event) => {
        event.preventDefault();



        // const {target:{from,to,amount}} = event;
        // fetch(`https://api.apilayer.com/exchangerates_data/convert?to=${to.value}&from=${from.value}&amount=${amount.valueAsNumber}`, requestOptions)
        // .then(response => response.json())
        // .then(data => {


        //     let {query:{to},info,date,result}=data;
        //     document.querySelector('#result').textContent = `As per the exchange rate ${info.rate} on ${date} for ${to} the converted value is ${result}`
        // })
        // .catch(error => console.log(error.message))


        const { target: { from, to, amount } } = event;
        let response = await fetch(`https://api.apilayer.com/exchangerates_data/convert?to=${to.value}&from=${from.value}&amount=${amount.valueAsNumber}`, requestOptions)
        const data = await response.json();

        let { query: { to: convertedTo }, info, date, result } = data;
        document.querySelector('#result').textContent = `As per the exchange rate ${info.rate} on ${date} for ${convertedTo} the converted value is ${result}`




    })
    let symbolRes = await fetch("https://api.apilayer.com/exchangerates_data/symbols", requestOptions);
    const symbol = await symbolRes.json()
    let sym = Object.keys(symbol.symbols)
    let i = 0;
    while (i < sym.length) {
        for (x of sym) {
            let s = document.createElement("option");
            let text = document.createTextNode(x);
            s.appendChild(text)
            document.querySelector("#from").appendChild(s);
            i++;
        }
    }
    let j = 0;
    while (j < sym.length) {
        for (x of sym) {
            let s = document.createElement("option");
            let text = document.createTextNode(x);
            s.appendChild(text)
            document.querySelector("#to").appendChild(s);
            j++;
        }
    }


})