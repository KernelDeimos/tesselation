## 2026-06-14

### Rendering the repeating section

I saw a tesselation by David H and wanted to see it with rounded corners. I
recognized this is possible to achieve by writing a small amount of javascript
and using the HTML5 Canvas API.

I started by defining an array of data for the "repeating section" of the
tesselation. Since the tesselation is made up of constituent square tiles
this was trivial. I proceeded to write a function that will render a single
instance of the repeating portion of the tesselation with HTML5 Canvas.

### Repeating the repeating section

I then needed to repeat the tesselating section and determine a colour mapping
strategy such that the colors in each instance of the repeating tessenation are
adjusted to match the tesselation I'm going to replicate.

I first tried a naive approach just to see what would happen:

```javascript
v => (v + row + col) % 3
```

This mapping worked across sections in a given row, but did not have the
desired outcome across sections in a given column. The overall outcome look
interesting so I wanted to see a larger rendering of the pattern. I noticed
changing my values `macroSize.w` and `macroSize.h` - the values which define
how many times the repeating section is rendered - had no effect. I found
this confusing because the sections were still being rendered according to the
previous value, which wouldn't be in the code anymore. I first suspected a
cache issue, but "Ctrl+Shift+R" in Chromium with devtools open had no effect.
I did not want to get stuck on this so I prompted the CLI Claude application
while continuing to investigate the issue myself.

Before I could do any significant investigation, Claude determined the issue
without any prompt (it found the bug during its initial scanning); the issue
was that I forgot to set a canvas size earlier and what I had rendered
happened to be very similar to the canvas size, making it look as though
nothing had changed.

To determine the correct colour mapping to adjust for colours across rows I
observed visually how much further offset was required on the row index, which
gave me the following new forumla:

```javascript
v -> (v + row*2 + col) % 3
```

I soon realized there was no way for the pattern to tesselate with either of
these values using this modulo(polynomial) approach. I then realized I was
erroneously assuming the repeating section I had worked in a larger square
grid. It is actually the case that each next column is offset by the size of
one of the constituent squares as the row advances.

I had already decided for `tileSize` to be calculated by the function which
renders an instance of the repeating section, and it was undesirable to move
that calculation to the main function as I wanted it to be reusable for
rendering other types of repeating sections of tesselations. I decided to
add a parameter to `renderSection` which allows it to "roll" the rows (i.e.
move the top row to the bottom N times).

This worked as expected. I proceeded to create the new mapping function.
I did this by goin left-to-right, top-to-bottom, swapping an incorrect
colour with a correct one each time. This was more tedious than I expected,
and it is important to do each step in the right order:

```javascript
const mapping = [
    [
        [0,1,2],
        [2,1,0],
    ][col % 2],
    [
        // [1,2,0],
        [0,1,2],
        [2,1,0],
    ][col % 2],
][row % 2];
```
