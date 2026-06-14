## 2026-06-14

I saw a tesselation by David H and wanted to see it with rounded corners. I
recognized this is possible to achieve by writing a small amount of javascript
and using the HTML5 Canvas API.

I started by defining an array of data for the "repeating section" of the
tesselation. Since the tesselation is made up of constituent square tiles
this was trivial. I proceeded to write a function that will render a single
instance of the repeating portion of the tesselation with HTML5 Canvas.

