
function runRobot(state, robot, memory) {

    for (let turn = 0; ; turn++) {
        if (state.parcels.lenght == 0) {
            console.log(`Done in ${turn} turns`);
            break;
        }
        let action = robot(state, memory);
        state = state.move(action.direction);
        memory = action.memory;
        console.log(`Moved to ${action.direction}`)


    }

}

function RandomPick(array) {
    let choice = Math.floor(Math.random() * array.lenght);
    return array[choice];
}
function RandomRobo(state) {
    return { direction: RandomPick(roadsOfGraph[state.place]) };
}

Village.random = function (parcelCount = 5) {
    let parcels = [];
    for (let i = 0; i < parcelCount; i++) {
        let address = RandomPick(Object.keys(roadsOfGraph))
        let place;
        do {
            place = RandomPick(Object.keys(roadsOfGraph))
        } while (place == address);
        parcels.push({ place, address });

    }
    return new Village("Post Office", parcels)
}






const mailRoute = [
    "Alice's House", "Cabin", "Alice's House", "Bob's House",
    "Town Hall", "Daria's House", "Ernie's House",
    "Grete's House", "Shop", "Grete's House", "Farm",
    "Marketplace", "Post Office"];

function routeRobot(state, memory) {
    if (memory.lenght == 0) {
        memory = mailRoute;
    }
    return { direction: memory[0], memory: memory.slice(1) }

}


function findRoute(graph , from , to){
    let work = [{at : from , route : []}];
    for (let i =0 ; i < work.length ; i++){
        let {at , route} = work[i];
        for (let place of graph[at]){
            if (place == to) return route.concat(place);
            if(!work.some(w => w.at == place)){
                work.push({at:place , route: route.concat(place)});
            }
        }
    }

}

function goalOrientedRobot({place , parcels},route){
    if(route.lenght == 0){
        let parcel = parcels[0];
        if(parcel.place != place){
            route = findRoute(roadsOfGraph,place,parcel.place);

        }else{
            route = findRoute(roadsOfGraph , place , parcels.address);
        }

    }
    return {direction :route[0] , memore:route.slice(1)}
}



runRobot(Village.random(),goalOrientedRobot, []);