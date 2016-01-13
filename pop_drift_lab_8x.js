<!-- TODO: Modularize -->

<!-- ---- Entities --------------------- -->

var Marble = function() {};

var Green = function() {
    Marble.call(this);
};
Green.prototype = Object.create(Marble.prototype);
Green.prototype.constructor = Green;

var Orange = function() {
    Marble.call(this);
};
Orange.prototype = Object.create(Marble.prototype);
Orange.prototype.constructor = Orange;

<!-- ---- functions --------------------- -->

function ratio(marbles) {
    var blacks = marbles.filter( function(m) {return m instanceof Green} );
    var ratioBlk = blacks.length / marbles.length;
    var ratioWht = 1 - ratioBlk;
    var rat = [round(ratioBlk), round(ratioWht)];
    return rat;
}

function popConvergence(ratio) {
    return ((ratio[0] === 1.0) || (ratio[1] === 1.0));
}

<!-- I am not striving for computational efficency, but rather to model -->
<!-- organic behavior. This will be important later when mutation is introduced. -->

function spawnSingle(marble) {
    if(marble instanceof Green) return new Green();
    else return new Orange();
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
    var cycles = [];
    var cycleCount = 0;
    var newPop = marbles;
    var orig = ratio(newPop);
    orig.unshift(0);
    cycles.push(orig);
    while(!popConvergence(ratio(newPop)) && cycleCount < maxCycles) {
        cycleCount += 1;
        newPop = replicate(_.sample(newPop, sampleSize), maxPopSize);
        var rat = ratio(newPop);
        rat.unshift(cycleCount);
        cycles.push(rat);
        //console.log("cycleReplication, cycleCount: " + cycleCount + " ratio(newPop): " + JSON.stringify(ratio(newPop)));
    }
    //console.log("cycleReplication, cycleCount: " + cycleCount + " ratio(newPop): " + JSON.stringify(ratio(newPop)));
    var header = ["State","Under 5 Years","5 to 13 Years"];
    cycles.unshift(header);
    return cycles;
}

// Util
function round(value) {
    return Number(Math.round(value+'e'+2)+'e-'+2);
}

<!-- ---- Initialization --------------- -->

var maxPopSize = 1000;
var sampleSize = 100;
var maxCycles = 1000;

var blackPop = new Array(Math.floor(maxPopSize / 2));
var whitePop = new Array(maxPopSize - blackPop.length);

blackPop.fill(new Green());
whitePop.fill(new Orange());

var initialCombinedPop = blackPop.concat(whitePop);
//console.log("initialCombinedPop.length: " + initialCombinedPop.length);

<!-- ---- Cycle until convergence --------------- -->

function run() {
    return cycleReplication(initialCombinedPop, sampleSize, maxPopSize, maxCycles);
}

//var cycles = run();

//console.log("cycles.length: " + cycles.length);

//console.log("====> cycles: " + JSON.stringify(cycles));




