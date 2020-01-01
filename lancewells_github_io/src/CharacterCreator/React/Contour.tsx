// Marching Squares Edge Detection
// this is a "marching ants" algorithm used to calc the outline path

// NOTE: This has been modified to be used with the .TSX react-ts format, but the functionality of this code
// itself has not been modified in any way.

// d3-plugin for calculating outline paths
  // License: https://github.com/d3/d3-plugins/blob/master/LICENSE
  //
  // Copyright (c) 2012-2014, Michael Bostock
  // All rights reserved.
  //
  //  Redistribution and use in source and binary forms, with or without
  //  modification, are permitted provided that the following conditions are met:
  //* Redistributions of source code must retain the above copyright notice, this
  //  list of conditions and the following disclaimer.
  //* Redistributions in binary form must reproduce the above copyright notice,
  //  this list of conditions and the following disclaimer in the documentation
  //  and/or other materials provided with the distribution.
  //* The name Michael Bostock may not be used to endorse or promote products
  //  derived from this software without specific prior written permission.
  // THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL MICHAEL BOSTOCK BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. 

export function GeomContour(grid: (ix: number, iy: number) => boolean) {
    var d3_geom_contourStart = function d3_geom_contourStart(grid: (ix: number, iy: number) => boolean) {
        var x = 0,
            y = 0;

        // search for a starting point; begin at origin 
        // and proceed along outward-expanding diagonals 
        while (true) {
            if (grid(x, y)) {
                return [x, y];
            }
            if (x === 0) {
                x = y + 1;
                y = 0;
            } else {
                x = x - 1;
                y = y + 1;
            }
        }
    } 

    const d3_geom_contourDx = [1, 0, 1, 1, -1, 0, -1, 1, 0, 0, 0, 0, -1, 0, -1, NaN];
    const d3_geom_contourDy = [0, -1, 0, 0, 0, -1, 0, 0, 1, -1, 1, 1, 0, -1, 0, NaN];

    var s = d3_geom_contourStart(grid), // starting point 
        c:      number[][]  = [],    // contour polygon 
        x:      number      = s[0],  // current x position 
        y:      number      = s[1],  // current y position 
        dx:     number      = 0,    // next x direction 
        dy:     number      = 0,    // next y direction 
        pdx:    number      = NaN, // previous x direction 
        pdy:    number      = NaN, // previous y direction 
        i:      number      = 0;

    do {
        // determine marching squares index 
        i = 0;
        if (grid(x - 1, y - 1)) i += 1;
        if (grid(x, y - 1)) i += 2;
        if (grid(x - 1, y)) i += 4;
        if (grid(x, y)) i += 8;

        // determine next direction 
        if (i === 6) {
            dx = pdy === -1 ? -1 : 1;
            dy = 0;
        } else if (i === 9) {
            dx = 0;
            dy = pdx === 1 ? -1 : 1;
        } else {
            dx = d3_geom_contourDx[i];
            dy = d3_geom_contourDy[i];
        }

        // update contour polygon 
        if (dx != pdx && dy != pdy) {
            c.push([x, y]);
            pdx = dx;
            pdy = dy;
        }

        x += dx;
        y += dy;
    } while (s[0] != x || s[1] != y);

    return c;
};

// Unused currently, but this can be used in external code to draw a border around an image.
// function drawImageBorder(
//     imageData: ImageData,
//     canvas: HTMLCanvasElement,
//     lineWidth: number,
//     borderStyle: string) {

//     const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

//     var defineNonTransparent = function (x: number, y: number) {
//         var a: number = imageData.data[(y * canvas.width + x) * 4 + 3];
//         return (a > 20);
//     }

//     var points = GeomContour(defineNonTransparent);

//     /*
//      * Use an 8-wide stroke here because we are scaling up the original pixels by a factor of
//      * four, and we need to account for the fact that we're drawing 'underneath' the original
//      * image, which means we need to multiply our line width by two, or else we end up with only
//      * a half-pixel border on both sides.
//      */
//     ctx.strokeStyle = borderStyle;
//     ctx.lineWidth = lineWidth;
//     ctx.beginPath();
//     ctx.moveTo(points[0][0], points[0][4]);
//     for (var i = 1; i < points.length; i++) {
//         var point = points[i];
//         ctx.lineTo(point[0], point[1]);
//     }

//     /*
//      * The alrogithm above works great, HOWEVER, it does not complete the last line in the
//      * outline. For that, we need to manually adjust the final point by finding one 'pixel' above
//      * the starting point, and drawing to that point. This means that, because we are scaling our
//      * end result by 4, that we should rely on the line size (/2) as a general rule of thumb for
//      * where our ending 'pixel' should live.
//      */
//     var finalPoint: number[] = points[0];
//     finalPoint[0] -= lineWidth / 2;
//     ctx.lineTo(finalPoint[0], finalPoint[1]);

//     ctx.stroke();
// }