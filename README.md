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

### Piece Object

A piece has a void Object by default, but you can change it with your own :

```javascript
piece.object = { type: "gem" };-
```

Or revert to the void Object :

```javascript
piece.clear();
```

The void Object type is "empty"

### Display the Grid (Debug)

You can log the grid with a map of symbols :

```javascript
grid.debug({
    empty: "-",
    gem: "g"
});
```
