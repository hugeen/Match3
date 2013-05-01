(function(exports) {

    var voidObject = {
        type: "empty"
    };

    function Grid(options) {
        
        options = options || {};
        this.gravity = options.gravity || false; // Could be "up", "down", "left", "right" or false
        this.height = options.height || 10;
        this.width = options.width || 10;

        this.pieces = [];

        for (var i = 0; i < this.width; i++) {
            this.pieces.push(new Array(this.height));
        };

        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                this.pieces[x][y] = new Piece(this, x, y);
            };
        };

    };

    // Return if given coords are in the grid
    Grid.prototype.coordsInWorld = function(coords) {
        return (coords.x >= 0 && coords.y >= 0 && coords.x < this.width && coords.y < this.height);
    };

    // Return the piece from given coords
    Grid.prototype.getPiece = function(coords) {
        if (this.coordsInWorld(coords)) {
            return this.pieces[coords.x][coords.y];
        } else {
            return false;
        }
    };

    // Return the piece neighbour of another piece from a given direction
    Grid.prototype.neighbourOf = function(piece, direction) {
        var targetCoords = piece.relativeCoordinates(direction, 1);
        return this.getPiece(targetCoords);
    };

    // Return a Hash of pieces by direction
    Grid.prototype.neighboursOf = function(piece) {
        var result = {};
        for (var directionName in Grid.directions) {
            result[directionName] = this.neighbourOf(piece, Grid.directions[directionName]);
        };
        return result;
    };

    // Execute a callback for each current match
    Grid.prototype.forEachMatch = function(callback) {
        var matches = this.getMatches();
        if (matches) {
            for (var i in matches) {
                var match = matches[i];
                callback(match, match[0].object.type);
            }
        }
    };
    
    Grid.prototype.forEachPiece = function(callback) {
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                callback(this.pieces[x][y]);
            };
        };
    };
    
    // Return an array of matches or false
    Grid.prototype.getMatches = function() {

        var checked = [];
        var matches = [];

        for (var l in this.pieces) {
            var pieces = this.pieces[l];

            for (var i in pieces) {
                var piece = pieces[i];

                if (checked.indexOf(piece) === -1) {
                    var match = piece.deepMatchingNeighbours();

                    for (var j in match) {
                        checked.push(match[j]);
                    }

                    if (match.length >= 3) {

                        if (piece.object.type !== voidObject.type) {
                            matches.push(match);
                        }

                    }
                }
            }
        }

        if (matches.length === 0) {
            return false;
        }

        return matches;
    };

    // Return an Array of pieces
    Grid.prototype.getRow = function(row, reverse) {
        var pieces = [];
        for (var i in this.pieces) {
            pieces.push(this.pieces[i][row]);
        }

        return reverse ? pieces.reverse() : pieces;
    };

    // Return an Array of pieces
    Grid.prototype.getColumn = function(column, reverse) {
        var pieces = [];
        for (var i = 0; i < this.height; i++) {
            pieces.push(this.pieces[column][i]);
        }

        return reverse ? pieces.reverse() : pieces;
    };

    // Destroy all matches and update the grid
    Grid.prototype.clearMatches = function() {
        var matches = this.getMatches();

        if (matches.length === 0) {
            return false;
        }

        for (var i in matches) {
            var pieces = matches[i];
            for (var p in pieces) {
                pieces[p].clear();
            }
        }

        return true;
    };

    // Swap 2 pieces object
    Grid.prototype.swapPieces = function(piece1, piece2) {
        var tmp1 = piece1.object;
        var tmp2 = piece2.object;
        piece1.object = tmp2;
        piece2.object = tmp1;
    }

    // Return an Array of falling pieces
    Grid.prototype.applyGravity = function() {
        if (this.gravity) {

            var direction = Grid.directions[this.gravity];
            var horizontal = direction.x !== 0;
            var reverse = horizontal ? direction.x === 1 : direction.y === 1;

            var fallingPieces = [];
            for (var i = 0; i < (horizontal ? this.height : this.width); i++) {

                var chunk = horizontal ? this.getRow(i, reverse) : this.getColumn(i, reverse);

                function applyGravity(grid) {
                    var swaps = 0;
                    for (var p in chunk) {

                        var piece = chunk[p];
                        var neighbour = piece.neighbour(direction);

                        if (piece.object !== voidObject && neighbour && neighbour.object === voidObject) {
                            grid.swapPieces(piece, neighbour);
                            if (fallingPieces.indexOf(neighbour) === -1) {
                                fallingPieces.push(neighbour);
                            }
                            swaps++;
                        }
                    }

                    if (swaps > 0) {
                        applyGravity(grid);
                    }
                }
                applyGravity(this);

            }

            var fallingPiecesWithoutEmpty = [];

            for (var i in fallingPieces) {
                var piece = fallingPieces[i];
                if (piece.object !== voidObject) {
                    fallingPiecesWithoutEmpty.push(piece)
                }
            }

            return fallingPiecesWithoutEmpty;
        }
    };

    Grid.prototype.debug = function(symbols) {
        var lines = [];

        for (var i = 0; i < this.height; i++) {
            var line = this.getRow(i);
            var pieces = "";
            for (var x in line) {
                var type = line[x].object.type;
                pieces += (typeof symbols !== "undefined") ? symbols[type] : type;
            }
            lines.push(pieces);
        }

        console.log("[jMatch3] - Actual Grid");

        for (var i in lines) {
            console.log(lines[i]);
        }
    };

    // Get last empty piece from an Array of pieces
    Grid.getLastEmptyPiece = function(pieces) {
        var lastEmpty = false;
        for (var i in pieces) {
            var piece = pieces[i];
            if (piece.object === voidObject) {
                lastEmpty = piece;
            }
        }

        return lastEmpty;
    };

    Grid.directions = {
        up: {
            x: 0,
            y: -1
        },
        down: {
            x: 0,
            y: 1
        },
        right: {
            x: 1,
            y: 0
        },
        left: {
            x: -1,
            y: 0
        }
    };
    
    function Piece(grid, x, y) {
        this.grid = grid;
        this.x = x;
        this.y = y;
        this.object = voidObject;
    }
    
    Piece.prototype.clear = function() {
        this.object = voidObject;
    };
    
    Piece.prototype.relativeCoordinates = function(direction, distance) {
        return {
            x: this.x + distance * direction.x,
            y: this.y + distance * direction.y
        };
    };

    Piece.prototype.neighbour = function(direction) {
        return this.grid.neighbourOf(this, direction);
    };

    Piece.prototype.neighbours = function() {
        return this.grid.neighboursOf(this);
    };

    Piece.prototype.matchingNeighbours = function() {
        var matches = [];
        var neighbours = this.neighbours();
        for (var direction in neighbours) {
            var neighbour = neighbours[direction];

            if (neighbour && neighbour.object.type === this.object.type) {
                matches.push(neighbour);
            }
        }
        return matches;
    };

    Piece.prototype.deepMatchingNeighbours = function() {

        var deepMatches = [];

        function deepMatchingNeighbours(piece) {

            var matchingNeighbours = piece.matchingNeighbours();

            for (var i in matchingNeighbours) {
                var matchingNeighbour = matchingNeighbours[i];

                if (deepMatches.indexOf(matchingNeighbour) === -1) {
                    deepMatches.push(matchingNeighbour);
                    deepMatchingNeighbours(matchingNeighbour);
                }
            }

        }

        deepMatchingNeighbours(this);

        return deepMatches;
    };

    exports.jMatch3 = {
        Grid: Grid
    };

})(typeof exports === 'undefined' ? this : exports);
