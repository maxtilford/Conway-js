Set = function () { this.set = [];}
Set.prototype = {
    inSet: function(p) { return this.set[p.x] && this.set[p.x][p.y]; },
   
    toPoints: function() {
        _(this.set).each
        var points = [];
        for (var x = 0, l = this.set.length; x < l; x++) {
            if (this.set[x]) {
                for (var y = 0, m = this.set[x].length; y < m; y++) {
                    if (this.set[x][y] === true) { points.push(P(x,y)); }
                }
            }
        }
        return points;
    },
    
    union: function(other) {    
        return PointSet(this.toPoints().concat(other.toPoints()));
    },
    
    insert: function(p) {
        if (!this.set[p.x]) { this.set[p.x] = []; }
        this.set[p.x][p.y] = true;
        return this;
    }
};

function PointSet(points) {
    return _(points).reduce(new Set(),
                            function(set,p) { return set.insert(p); });
}



function P(x,y) { return {x:x, y:y}; }

function neighbors(p) {
    return _.map([P(p.x-1,p.y-1),P(p.x,p.y-1),P(p.x+1,p.y-1),
                  P(p.x-1,p.y),               P(p.x+1,p.y),
                  P(p.x-1,p.y+1),P(p.x,p.y+1),P(p.x+1,p.y+1)],
                 wrap);

}

// wrap around to the other side of the page
function wrap(p) { 
    return P(mod(p.x, getWidth()), 
             mod(p.y, getHeight()));
}

// % does not behave the way I need it to for negative numbers
function mod(x,y) { return (x < 0) ? y + x : x % y; }

function numLiveNeighbors(b,p) {
    return _(neighbors(p)).select(_(b.inSet).bind(b)).length;
}

function deadNeighbors(b,p) {
    return PointSet( _(neighbors(p)).reject(_(b.inSet).bind(b)));
}

// The step function finds all the cells that *could* be alive next turn,
// and then keeps only those actually will.
function step(b) { 
    var changeable_cells = _(b.toPoints()).reduce(b, function(set, p) { return set.union(deadNeighbors(b,p)); });
    return PointSet(_(changeable_cells.toPoints()).select(function(p) {
                var ns = numLiveNeighbors(b,p);
                return ns == 3 || (ns == 2 && b.inSet(p));
            }));
}

var glider = [P(3,1),P(1,2),P(3,2),P(2,3),P(3,3)];

var lwspaceship = [P(1,1),P(1,3),P(2,4),P(3,4),P(4,4),P(5,4),P(5,3),P(5,2),P(4,1)];

var four_gliders = glider.concat(_(glider).map(function(p) {return P(p.x + 5, p.y);}))
    .concat(_(glider).map(function(p) {return P(p.x, p.y + 5);}))
    .concat(_(glider).map(function(p) {return P(p.x + 5, p.y + 5);}));

var four_gliders_one_spaceship = four_gliders.concat(_(lwspaceship).map(function(p) {return P(p.x+12,p.y);}));

function showBoard(b) {
    _(b.toPoints()).each(function(p) {
            $("body").append('<div class="cell" style="' 
                             + 'top: ' + (12*p.y) + 'px; '
                             + 'left: ' + (12*p.x) + 'px;' 
                             + '"></div>');
        });
}

function getWidth() { return Math.ceil(window.innerWidth/12); }
function getHeight() { return Math.ceil(window.innerHeight/12); }

// initialization
board = PointSet(four_gliders_one_spaceship);

conwayGo = false;

function main() {
    if (conwayGo) { setTimeout("main()", 50); }
    $('.cell').remove(); 
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

