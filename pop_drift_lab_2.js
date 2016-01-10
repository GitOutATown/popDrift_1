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
    return [ratioBlk.toFixed(2), ratioWht.toFixed(2)];
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
    while(newPop.length < maxPopSize / 2) {
        newPop = increaseByTwo(newPop);
    }
    var sampleSize = (maxPopSize - newPop.length) / 2;
    var remainderSample = _.sample(newPop, sampleSize);
    var remainder = increaseByTwo(remainderSample);
    return newPop.concat(remainder);
}

<!-- ------------------------- -->

var maxPopSize = 1000;

var blackPop = new Array(maxPopSize / 2);
var whitePop = new Array(maxPopSize / 2);

blackPop.fill(new Black());
whitePop.fill(new White());

var initialCombinedPop = blackPop.concat(whitePop);

var initialSample = _.sample(initialCombinedPop, 100);

var initialSampleRatio = ratio(initialSample);

var newMaxPop = replicate(initialSample, maxPopSize);

<!-- ---- console.log ---------- -->

console.log("initialCombinedPop.length: " + initialCombinedPop.length);
console.log("initialSample.length: " + initialSample.length)
console.log('initialSampleRatio: ' + initialSampleRatio);

console.log("newMaxPop.length: " + newMaxPop.length);
console.log('newMaxPop ratio: ' + ratio(newMaxPop));




