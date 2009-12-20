Set = function () { this.set = [];}
Set.prototype = {
    includes: function(p) { return this.set[p.x] && this.set[p.x][p.y]; },
   
    toPoints: function() {
        var points = [];
        _(this.set).each(function(ys, x) {
                _(ys).each(function(isIn,y) {
                        if (isIn === true) { points.push(P(x,y)); }
                    });
            });
        return points;
    },

    insert: function(p) {
        if (!this.set[p.x]) { this.set[p.x] = []; }
        this.set[p.x][p.y] = true;
        return this;
    }
        
};

function listToSet(elems) {
    return _(elems).reduce(new Set(),
                            function(set,e) { return set.insert(e); });
}

Point = function(x,y) { this.x = x; this.y = y; };
Point.prototype = {
    neighbors: function() {
        var x = this.x; var y = this.y;
        return _.map([P(x-1,y-1),P(x,y-1),P(x+1,y-1),
                      P(x-1,y),           P(x+1,y),
                      P(x-1,y+1),P(x,y+1),P(x+1,y+1)],
                     wrap);
    }
};
    
function P(x,y) { return new Point(x,y); }


// wrap around to the other side of the page
function wrap(p) { 
    return P(mod(p.x, getWidth()), 
             mod(p.y, getHeight()));
}

// % does not wrap around on negative numbers. This will.
function mod(x,y) { return (x < 0) ? y + x : x % y; }
 
    
// The step function finds all the cells that *could* be alive next turn,
// and then keeps only those actually will.
function step(b) {
    var next_b = new Set();
    _(b.toPoints()).chain()
        .reduce(b.toPoints(),function(lst,p) {return lst.concat(p.neighbors());})
        .each(function(p) {
                if (!next_b.includes(p)) {
                    var ns = _(p.neighbors()).select(_(b.includes).bind(b)).length;
                    if (ns == 3 || (ns == 2 && b.includes(p))) {
                        next_b.insert(p);
                    }
                }
            });
    return next_b;
}

var glider = [P(3,1),P(1,2),P(3,2),P(2,3),P(3,3)];

var lwspaceship =  [P(1,1),P(1,3),P(2,4),P(3,4),P(4,4),P(5,4),P(5,3),P(5,2),P(4,1)];

var mwspaceship = [P(1,1),P(1,3),P(2,4),P(3,4),P(4,4),P(5,4),P(6,4),P(6,3),P(6,2),P(5,1)];

var hwspaceship = [P(1,1),P(1,3),P(2,4),P(3,4),P(4,4),P(5,4),P(6,4),P(7,4),P(7,3),P(7,2),P(6,1)];

var four_gliders = glider.concat(_(glider).map(function(p) {return P(p.x + 5, p.y);}))
    .concat(_(glider).map(function(p) {return P(p.x, p.y + 5);}))
    .concat(_(glider).map(function(p) {return P(p.x + 5, p.y + 5);}));

var four_gliders_one_spaceship = four_gliders.concat(_(lwspaceship).map(function(p) {return P(p.x+12,p.y);}));

var glider_and_ships = lwspaceship.concat(_.map(mwspaceship,function(p){return P(p.x,p.y+7);}))
    .concat(_.map(hwspaceship,function(p){return P(p.x,p.y+14);}))
    .concat(_.map(glider,function(p){return P(p.x,p.y+22);}));

function showBoard(b) {    
    $("#board").prepend(_(b.toPoints()).reduce('',function(cells,p) {
                return cells
                    + '<div class="cell" style="' 
                    + 'top: ' + (12*p.y) + 'px; '
                    + 'left: ' + (12*p.x) + 'px;' 
                    + '"></div>';
            }));
}

function getWidth() { return Math.ceil(window.innerWidth/12); }
function getHeight() { return Math.ceil(window.innerHeight/12); }

// initialization
board = listToSet(glider_and_ships);

conwayGo = false;

function main() {
    if (conwayGo) { setTimeout("main()", 50); }
     
    $('#board').empty();
    showBoard(board);
    board = step(board);
}

$(document).ready(function() { 
        main();
        $('#go').click(toggleConway);
    });

function toggleConway() {
    if (conwayGo) {
        conwayGo = false;
    } 
    else {
        conwayGo = true;
        main();
    }
}

