

// functions for working with Points and Boards

function P(x,y) { return {x:x, y:y}; }

function posUniq(a) {
    var r = [];
    o:for(var i = 0, n = a.length; i < n; i++) {
           for(var x = 0, y = r.length; x < y; x++) {
                   if(_.isEqual(r[x],a[i])) continue o;
               }
           r[r.length] = a[i];
       }
   return r;
}

function posEq(p,q) { return p.x == q.x && p.y == q.y; }

function isAlive(b,p) { return _(b).any(_(_.isEqual).bind({},p)); }

function neighbors(b,p) {
    return _.map([P(p.x-1,p.y-1),P(p.x,p.y-1),P(p.x+1,p.y-1),
                  P(p.x-1,p.y),               P(p.x+1,p.y),
                  P(p.x-1,p.y+1),P(p.x,p.y+1),P(p.x+1,p.y+1)],
                 wrap);

}

function liveNeighbors(b,p) {
    return _(neighbors(b,p)).select(_(isAlive).bind({},b)).length;
}


// wrap around to the other side of the page
function wrap(p) { 
    return P(mod(p.x, getWidth()), 
             mod(p.y, getHeight()));
}

// % does not behave the way I need it to for negative numbers
function mod(x,y) { return (x < 0) ? y + x : x % y; }


// The step function finds all the cells that *could* be alive next turn,
// and then keeps only those actually will.
function step(b) { 
    return _(posUniq(b.concat(_(b).chain()
                              .map(_(neighbors).bind({},b))
                              .flatten()
                              .value())))
        .select(function(p) {
                var ns = liveNeighbors(b,p);
                return ns == 3 || (ns ==  2 && isAlive(b,p));
            });
}

var glider = [P(3,1),P(1,2),P(3,2),P(2,3),P(3,3)];

var lwspaceship = [P(1,1),P(1,3),P(2,4),P(3,4),P(4,4),P(5,4),P(5,3),P(5,2),P(4,1)];

function showBoard(b) {
    _(b).each(function(p) {
            $("body").append('<div class="cell" style="' 
                             + 'top: ' + (12*p.y) + 'px; '
                             + 'left: ' + (12*p.x) + 'px;' 
                             + '"></div>');
        });
}

function getWidth() { return Math.ceil(window.innerWidth/12); }
function getHeight() { return Math.ceil(window.innerHeight/12); }

// initialization
board = glider;

conwayGo = false;

function main() {
     $('.cell').remove(); 
     showBoard(board);
     board = step(board);
     if (conwayGo) { setTimeout("main()", 200); }
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

