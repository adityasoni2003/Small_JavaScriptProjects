const roads = [
    "Alice's House-Bob's House", "Alice's House-Cabin",
    "Alice's House-Post Office", "Bob's House-Town Hall",
    "Daria's House-Ernie's House", "Daria's House-Town Hall",
    "Ernie's House-Grete's House", "Grete's House-Farm",
    "Grete's House-Shop", "Marketplace-Farm",
    "Marketplace-Post Office", "Marketplace-Shop",
    "Marketplace-Town Hall", "Shop-Town Hall"
];

//a Function to convert this array of Places into Graph which will help us 

function constructGraph(relation) {
    let graph = Object.create(null);
    function addEdge(from, to) {
        if (graph[from] == null) {
            graph[from] = [to];

        } else {
            graph[from].push(to);
        }


    }

    for (let [from, to] of relation.map(r => r.split("-"))) {
        addEdge(from, to);
        addEdge(to, from);
    }
    return graph;

}

const roadsOfGraph = new constructGraph(roads)


class Village {
    constructor(place, parcels) {
        this.place = place;
        this.parcels = parcels;

    }

    move(destination) {
        if (!roadsOfGraph[this.place].includes(destination)) {
            return this;

        } else {
            let parcels = this.parcels.map(p => {
                if (p.place != this.place) return p;
                return { place: destination, address: p.address };
            }).filter(p => p.place == p.destination);
            return new Village(destination, parcels);

        }

    }
}



let firstEXAMPLE = new Village(
    "Post Office",
    [{ place: "Post Office", address: "Alice's House" }]
);
let next = firstEXAMPLE.move("Alice's House")


console.log(next.place);
console.log(next.parcels)
console.log(firstEXAMPLE.place);



