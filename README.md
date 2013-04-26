jMatch3
=======

Javascript Match-3 Game Lib - Node.JS and Browser compatible

## How to use ?

### Create a new Grid with width, height and gravity parameters :

```javascript
var grid = new jMatch3.Grid({
    width: 6,
    height: 7,
    gravity: "down"
});
```

### Get a piece inside the grid

```javascript
var piece = grid.getPiece({ x: 0, y: 0 });
```

### Update a piece

A piece has a void object by default, but you can change it with your own

```javascript
piece.object = { type: "gem" };-
```

Or revert to the void object

```javascript
piece.clear();
```

The void Object type is "empty"

### Display the grid (Debug)

You can log the grid with a map of symbols

```javascript
grid.debug({
    empty: "-",
    gem: "g"
});
```

### Handle matches

You can get all current matches
```javascript
var matches = grid.getMatches();
```

Clear matches to transform all matching pieces object to void object
```javascript
grid.clearMatches();
```

Apply gravity to fall down your pieces
```javascript
grid.applyGravity();
```

## API Documentation

### Grid

```javascript
/*
 * options:
 * - width (default 10)
 * - height (default 10)
 * - gravity (default false): "up", "right", "down", "left", or false 
 */
var grid = new jMatch3.Grid({
    width: 6,
    height: 7,
    gravity: "down"
});
```

#### Instance methods

##### .coordsInWorld(coords)

Return if given coords are in the grid

```javascript
grid.coordsInWorld({ x: 10, y: 10 }); // return false
```

##### .getPiece(coords)

Return the piece from given coords

```javascript
var piece = grid.getPiece({ x: 4, y: 4 });
```

##### .neighbourOf(piece, direction)

Return the piece neighbour of another piece from a given direction

```javascript
var neighbour = grid.neighbourOf(piece, "left");
```

##### .neighboursOf(piece)

Return a Hash of pieces by direction

```javascript
// return { up: theUpPiece, down: theDownPiece, right: theRightPiece, left: theLeftPiece }
var neighbours = grid.neighboursOf(piece);
```

##### .forEachMatch(callback)

Execute a callback for each current match

```javascript
grid.forEachMatch(function() {
  // Your scoring stuff
});
```

##### .getMatches()

Return an array of matches or false

```javascript
var matches = grid.getMatches();
```

##### .getRow(row, reverse)

Return an Array of pieces

```javascript
var row = grid.getRow(0);
```

##### .getColumn(column, reverse)

Return an Array of pieces

```javascript
var column = grid.getColumn(0);
```

##### .clearMatches()

Destroy all matches and update the grid

```javascript
grid.clearMatches();
```

##### .swapPieces(piece1, piece2)

Swap 2 pieces object

```javascript
grid.swapPieces(piece1, piece2);
```

##### .applyGravity()

Apply gravity to fall down your pieces and return an Array of falling pieces

```javascript
var fallingPieces = grid.applyGravity();
```

##### .debug(symbols)

Log the current grid with symbols

```javascript
grid.debug({
    empty: "-",
    gem: "g"
});
```

#### Class method

##### .getLastEmptyPiece()

Get last empty piece from an Array of pieces

```javascript
var lastEmpty = jMatch3.Grid.getLastEmptyPiece(pieces);
```

### Piece

Private Class

```javascript
/*
 * Params:
 * - grid
 * - x
 * - y
 */
new Piece(grid, 0, 0);
```

#### Instance methods

##### .clear()

Replace the piece object by a the void object

```javascript
piece.clear();
```

##### .relativeCoordinates(direction, distance)

Return relatives coordinates to the piece

```javascript
var relativeCoordinates = piece.relativeCoordinates("right", 1); // return { x: 1, y: 0 }
```

##### .neighbour(direction)

Return neighbour of the piece from a given direction

```javascript
var neighbour = piece.neighbour("right");
```

##### .neighbours()

Return a Hash of pieces by direction

```javascript
// return { up: theUpPiece, down: theDownPiece, right: theRightPiece, left: theLeftPiece }
var neighbours = piece.neighbours();
```

##### .matchingNeighbours()

Return an Array of direct Matching Neighbours

```javascript
var matchingNeighbours = piece.matchingNeighbours();
```

##### .deepMatchingNeighbours()

Return an Array of deep Matching Neighbours

```javascript
var deepMatchingNeighbours = piece.deepMatchingNeighbours();
```
