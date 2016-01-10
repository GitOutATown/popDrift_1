<!-- ---- Entities --------------------- -->

var Marble = function() {};

var Black = function() {
    Marble.call(this);
};
Black.prototype = Object.create(Marble.prototype);
Black.prototype.constructor = Black;

var White = function() {
    Marble.call(this);
};
White.prototype = Object.create(Marble.prototype);
White.prototype.constructor = White;

<!-- ---- functions --------------------- -->

function ratio(marbles) {
    var blacks = marbles.filter( function(m) {return m instanceof Black} );
    var ratioBlk = blacks.length / marbles.length;
    var ratioWht = 1 - ratioBlk;
    var rat = [ratioBlk, ratioWht]
    //console.log("ratio, rat: " + JSON.stringify(rat));
    return rat;
}

function popConvergence(ratio) {
    //console.log("popConvergence, typeof(ratio): " + typeof(ratio));
    //console.log("popConvergence, ratio: " + JSON.stringify(ratio));
    //console.log("popConvergence, ratio[0]: " + (ratio[0] === 0.5));
    //console.log("popConvergence, typeof ratio[0]: " + typeof ratio[0]);
    return ((ratio[0] === 1.0) || (ratio[1] === 1.0));
    //return true
}

<!-- Note that I am not striving for computational efficency, but rather to model -->
<!-- organic behavior. This will be important later when mutation is introduced. -->

function newOffspring(marble) {
    if(marble instanceof Black) return new Black();
    else return new White();
}

function increaseByTwo(marbles) {
    var spawn = new Array(marbles.length * 2);
    for(var i = 0; i < marbles.length; i++) {
        spawn[i] = newOffspring(marbles[i]);
        spawn[(spawn.length - 1) - i] = newOffspring(marbles[i]);
    }
    return spawn;
}

<!-- Assuming uniform replication pattern. -->
function replicate(marbles, maxPopSize) {
    var newPop = increaseByTwo(marbles); <!-- TODO: Need size check here! Assuming ok for now... -->
    //console.log("####>> replicate, newPop.length: " + newPop.length);
    //console.log("####>> replicate, maxPopSize: " + maxPopSize);
    while(newPop.length < (maxPopSize / 2)) {
        //console.log("####>> replicate, in while...")
        newPop = increaseByTwo(newPop);
    }
    var sampleSize = (maxPopSize - newPop.length) / 2;
    var remainderSample = _.sample(newPop, sampleSize);
    var remainder = increaseByTwo(remainderSample);
    var result = newPop.concat(remainder);
    //console.log("====> replicate, ratio(result): " + ratio(result));
    return result;
}

function cycleReplication(marbles, sampleSize, maxPopSize, maxCycles) {
    var cycleCount = 0;
    var newPop = marbles;
    //console.log("====> cycleReplication, ratio(newPop): " + ratio(newPop));
    while(!popConvergence(ratio(newPop)) && cycleCount < maxCycles) {
        cycleCount += 1;
        //console.log("cycleReplication, while...");
        newPop = replicate(_.sample(newPop, sampleSize), maxPopSize);
    }
    return newPop;
}

<!-- ---- Initialization --------------- -->

var maxPopSize = 1000;
var sampleSize = 100;
var maxCycles = 1000;

var blackPop = new Array(maxPopSize / 2);
var whitePop = new Array(maxPopSize / 2);

blackPop.fill(new Black());
whitePop.fill(new White());

var initialCombinedPop = blackPop.concat(whitePop);
console.log("initialCombinedPop.length: " + initialCombinedPop.length);

<!-- ---- Cycle until convergence --------------- -->

var convergence = cycleReplication(initialCombinedPop, sampleSize, maxPopSize, maxCycles);

console.log("====> convergence.length: " + convergence.length);
console.log("====> convergence ratio: " + JSON.stringify(ratio(convergence)));




