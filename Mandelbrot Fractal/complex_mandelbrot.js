var ctx;
var iCanvasWidth;
var iCanvasHeight;
var iCanvasX;
var iCanvasY;

var MAX_CONTROL_COLORS = 5;
var MAX_COLORS = 512;
var ITERATION_LIMIT = 100;

var controlColors = new Array(MAX_CONTROL_COLORS);
var colors = new Array(MAX_COLORS);

var pmin = -2.25;
var pmax = 0.75;
var qmin = -1.5;
var qmax = 1.5;

var lastColor = 0;
var mouseDown = false;
var mbX;
var mbY;

var backImage;
var mandelImage;
var mandelPixels;

function textOut ( s, x, y )
{
    ctx.textBaseline = 'top';
    ctx.font = "Tahoma, Verdana, Arial, Helvetica";
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#001";
    ctx.strokeText(s, x, y);
    ctx.fillStyle = "#eeb";
    ctx.fillText(s, x, y);
}

function reportCoordsAndTiming ( msg )
{
    textOut(msg, 4, 4);
    textOut("x: " + pmin + ".." + pmax, 4, 16);
    textOut("y: " + qmin + ".. " + qmax, 4, 28);
}

/**
 * Draw a Pixel on the canvas context. This method is caching the last color used
 * as the ctx.fillStyle is an expensive method.
 *
 * @param x
 * @param y
 * @param c
 */
function drawPixel ( x, y, c )
{
    var iOffset = 4 * (y * iCanvasWidth + x);
    mandelPixels[iOffset    ] = colors[c][0];   // r
    mandelPixels[iOffset + 1] = colors[c][1];   // g
    mandelPixels[iOffset + 2] = colors[c][2];   // b
    mandelPixels[iOffset + 3] = 255;
}

/**
 *
 */
function resetMandel ( w, h )
{
    var scale = 3.0 / h;

    pmin = -(9.0 / 12.0) * w * scale;
    pmax = (3.0 / 12.0) * w * scale;
    qmin = -1.5;
    qmax = 1.5;
}

/**
 *
 */
function resetControlColors ()
{
    controlColors[0] = [0x00, 0x00, 0x20];
    controlColors[1] = [0xff, 0xff, 0xff];
    controlColors[2] = [0x00, 0x00, 0xa0];
    controlColors[3] = [0x40, 0xff, 0xff];
    controlColors[4] = [0x20, 0x20, 0xff];
}

/**
 *
 */
function computeColors ()
{
    var i, k;
    colors[0] = [0, 0, 0];

    for (i = 0; i < MAX_CONTROL_COLORS - 1; i++)
    {
        var rstep = (controlColors[i + 1][0] - controlColors[i][0]) / 63;
        var gstep = (controlColors[i + 1][1] - controlColors[i][1]) / 63;
        var bstep = (controlColors[i + 1][2] - controlColors[i][2]) / 63;

        for (k = 0; k < 64; k++)
        {
            colors[k + (i * 64) + 1] = [Math.round(controlColors[i][0] + rstep * k),
                                        Math.round(controlColors[i][1] + gstep * k),
                                        Math.round(controlColors[i][2] + bstep * k)];
        }
    }

    for (i = 257; i < MAX_COLORS; i++)
    {
        colors[i] = colors[i - 256];
    }
}

function computeMandel ()
{
    var KMAX = 256;
    var xstep = (pmax - pmin) / iCanvasWidth;
    var ystep = (qmax - qmin) / iCanvasHeight;

    // declare and initialise variables, for speed
    var x = 0.0;
    var y = 0.0;
    var r = 1.0;

    // create a back image and get a pointer to the pixels array
    mandelImage = ctx.getImageData(0, 0, iCanvasWidth, iCanvasHeight);
    mandelPixels = mandelImage.data;

    var start = new Date().getTime();
    for (var sy = 0; sy < iCanvasHeight; sy++)
    {
        for (var sx = 0; sx < iCanvasWidth; sx++)
        {
            var p = pmin + xstep * sx;
            var q = qmax - ystep * sy;
            var k = 0;
            var x0 = 0.0;
            var y0 = 0.0;

            do
            {
                x = x0 * x0 - y0 * y0 + p;
                y = 2 * x0 * y0 + q;
                x0 = x;
                y0 = y;
                r = x * x + y * y;
                k++;
            }
            while ((r <= ITERATION_LIMIT) && (k < KMAX));

            if (k >= KMAX)
            {
                k = 0;
            }

            // draw the pixel
            drawPixel(sx, sy, k);
        }
    }

    ctx.putImageData(mandelImage, 0, 0);

    var elapsed = new Date().getTime() - start;
    reportCoordsAndTiming(elapsed + " ms");
}

function onMouseDown ( e )
{
    e = window.event || e;
    mouseDown = true;

    mbX = e.offsetX || (e.clientX - iCanvasX);
    mbY = e.offsetY || (e.clientY - iCanvasY);

    backImage = ctx.getImageData(0, 0, iCanvasWidth, iCanvasHeight);
}

function onMouseMove ( e )
{
    e = window.event || e;
    if (mouseDown)
    {
        var currX = e.offsetX || (e.clientX - iCanvasX);
        var currY = e.offsetY || (e.clientY - iCanvasY);
        var newY = mbY + (booleanToInt(currY > mbY) * 2 - 1) * Math.round(iCanvasHeight * Math.abs(currX - mbX) / iCanvasWidth);

        ctx.putImageData(backImage, 0, 0);
        ctx.strokeStyle = "rgb(170,255,65)";
        ctx.strokeRect(mbX, mbY, currX - mbX, newY - mbY);
    }
}

function onMouseUp ( e )
{
    e = window.event || e;
    if (mouseDown)
    {
        var currX = e.offsetX || (e.clientX - iCanvasX);
        var currY = e.offsetY || (e.clientY - iCanvasY);

        var newX = currX;
        var newY = mbY + (booleanToInt(currY > mbY) * 2 - 1) * Math.round(iCanvasHeight * Math.abs(currX - mbX) / iCanvasWidth);

        if (newX < mbX)
        {
            var hx = newX;
            newX = mbX;
            mbX = hx;
        }
        if (newY < mbY)
        {
            var hy = newY;
            newY = mbY;
            mbY = hy;
        }

        console.log(mbX + ', ' + mbY + ' to ' + newX + ', ' + newY);

        // only bother if the size of the square is more than 3x3 pixels
        if ((Math.abs(newX - mbX) > 3) && (Math.abs(newY - mbY) > 3))
        {
            var pw = pmax - pmin;
            pmin = pmin + mbX * pw / iCanvasWidth;
            pmax = pmax - (iCanvasWidth - newX) * pw / iCanvasWidth;
            var qw = qmax - qmin;
            qmin = qmin + (iCanvasHeight - newY) * qw / iCanvasHeight;
            qmax = qmax - mbY * qw / iCanvasHeight;

            computeMandel();
        }
    }
    mouseDown = false;
}

var tcurrX;
var tcurrY;
function onTouchStart ( e )
{
    e.preventDefault();
    var touch = e.targetTouches[0];
    mouseDown = true;

    mbX = touch.pageX - iCanvasX;
    mbY = touch.pageY - iCanvasY;

    backImage = ctx.getImageData(0, 0, iCanvasWidth, iCanvasHeight);
}

function onTouchMove ( e )
{
    e.preventDefault();
    var touch = e.targetTouches[0];
    if (mouseDown)
    {
        tcurrX = touch.pageX - iCanvasX;
        tcurrY = touch.pageY - iCanvasY;
        var newY = mbY + (booleanToInt(tcurrY > mbY) * 2 - 1) * Math.round(iCanvasHeight * Math.abs(tcurrX - mbX) / iCanvasWidth);

        ctx.putImageData(backImage, 0, 0);
        ctx.strokeStyle = "rgb(170,255,65)";
        ctx.strokeRect(mbX, mbY, tcurrX - mbX, newY - mbY);

        tcurrY = newY;
    }

}

function onTouchEnd ( e )
{
    var touch = e.targetTouches[0];
    if (mouseDown)
    {
        var newX = tcurrX;
        var newY = tcurrY;

        if (newX < mbX)
        {
            var hx = newX;
            newX = mbX;
            mbX = hx;
        }
        if (newY < mbY)
        {
            var hy = newY;
            newY = mbY;
            mbY = hy;
        }

        // only bother if the size of the square is more than 3x3 pixels
        if ((Math.abs(newX - mbX) > 3) && (Math.abs(newY - mbY) > 3))
        {
            var pw = pmax - pmin;
            pmin = pmin + mbX * pw / iCanvasWidth;
            pmax = pmax - (iCanvasWidth - newX) * pw / iCanvasWidth;
            var qw = qmax - qmin;
            qmin = qmin + (iCanvasHeight - newY) * qw / iCanvasHeight;
            qmax = qmax - mbY * qw / iCanvasHeight;

            computeMandel();
        }
    }
    mouseDown = false;
}

/**
 *
 * @param canvasElement
 * @param w
 * @param h
 */
function initMandel ( canvasElement, w, h )
{
    iCanvasWidth = w;
    iCanvasHeight = h;
    var canvas = document.getElementById(canvasElement);
    ctx = canvas.getContext("2d");
    canvas.width = w;
    canvas.height = h;

    // get the location of the canvas on the page
    iCanvasX = canvas.offsetLeft;
    iCanvasY = canvas.offsetTop;

    resetMandel(w, h);
    resetControlColors();
    computeColors();

    canvas.onmousedown = onMouseDown;
    canvas.onmousemove = onMouseMove;
    canvas.onmouseup = onMouseUp;

    canvas.addEventListener('touchstart', onTouchStart);
    canvas.addEventListener('touchmove', onTouchMove);
    canvas.addEventListener('touchend', onTouchEnd);

    console.log('+ canvas initialised at ' + iCanvasX + ' ' + iCanvasY);
}

