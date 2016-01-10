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
    return rat;
}

function popConvergence(ratio) {
    return ((ratio[0] === 1.0) || (ratio[1] === 1.0));
}

<!-- I am not striving for computational efficency, but rather to model -->
<!-- organic behavior. This will be important later when mutation is introduced. -->

function spawnSingle(marble) {
    if(marble instanceof Black) return new Black();
    else return new White();
}

function spawnTwins(marbles) {
    var spawn = new Array(marbles.length * 2);
    for(var i = 0; i < marbles.length; i++) {
        spawn[i] = spawnSingle(marbles[i]);
        spawn[(spawn.length - 1) - i] = spawnSingle(marbles[i]);
    }
    return spawn;
}

<!-- Assuming uniform replication pattern. -->
function replicate(marbles, maxPopSize) {
    var newPop = marbles;
    while(newPop.length < (maxPopSize / 2)) {
        newPop = spawnTwins(newPop);
    }
    var sampleSize = (maxPopSize - newPop.length) / 2;
    var remainderSample = _.sample(newPop, sampleSize);
    var remainder = spawnTwins(remainderSample);
    var result = newPop.concat(remainder);
    if(maxPopSize - result.length === 1) { // Accounts for odd numbered arrays
        result.push(spawnSingle(_.sample(newPop,1)));
    }
    return result;
}

function cycleReplication(marbles, sampleSize, maxPopSize, maxCycles) {
    var cycleCount = 0;
    var newPop = marbles;
    while(!popConvergence(ratio(newPop)) && cycleCount < maxCycles) {
        cycleCount += 1;
        console.log("cycleReplication, cycleCount: " + cycleCount + " ratio(newPop): " + JSON.stringify(ratio(newPop)));
        newPop = replicate(_.sample(newPop, sampleSize), maxPopSize);
    }
    return newPop;
}

<!-- ---- Initialization --------------- -->

var maxPopSize = 1000;
var sampleSize = 100;
var maxCycles = 1000;

var blackPop = new Array(Math.floor(maxPopSize / 2));
var whitePop = new Array(maxPopSize - blackPop.length);

blackPop.fill(new Black());
whitePop.fill(new White());

var initialCombinedPop = blackPop.concat(whitePop);
console.log("initialCombinedPop.length: " + initialCombinedPop.length);

<!-- ---- Cycle until convergence --------------- -->

var convergence = cycleReplication(initialCombinedPop, sampleSize, maxPopSize, maxCycles);

console.log("====> convergence.length: " + convergence.length);
console.log("====> convergence ratio: " + JSON.stringify(ratio(convergence)));




