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

### Get a piece inside the Grid

```javascript
var piece = grid.getPiece({ x: 0, y: 0 });
```

### Piece object

A piece has a void object by default, but you can change it with your own

```javascript
piece.object = { type: "gem" };-
```

Or revert to the void object

```javascript
piece.clear();
```

The void Object type is "empty"

### Display the Grid (Debug)

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