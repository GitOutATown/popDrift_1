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
};

<!-- ------------------------- -->

var blackPop = new Array(500);
var whitePop = new Array(500);

blackPop.fill(new Black());
whitePop.fill(new White());

var combinedPop = blackPop.concat(whitePop);

//var newSample = _.sample(combinedPop, 100);

//var blkWhtRatio = ratio(newSample);

//console.log(blkWhtRatio);




