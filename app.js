/**
 * Author: Marcela Estrada
 *
 * Interactive program that shows to the user the equation of a straight line,
 * and how it looks on a graph, giving the user the opportunity to
 * manipulate the coordinates of the graph by dragging the points,
 * and manipulate the slope(m) and y-intercept(b) of the graph.
 **/

const color1 = '#7161EF';
const color2 = '#D6E5E3';
const bgColor = '#fff';
const colorP1 = '#FB8B24';
const colorP2 = '#294059';
const colorLine = '#9c7cb7';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// setting up backup canvas
const canvasTemp = document.createElement('canvas');
const ctxTemp = canvasTemp.getContext('2d');

const slope = document.getElementById('slope');
const yIntercept = document.getElementById('yIntercept');

const coordinates1 = document.getElementById("coordinates1");
const coordinates2 = document.getElementById("coordinates2");

let m = 0;
let b = 0;

// object storing information for the x1 and y1 coordinate on graph
const p1 = {
    name: "point1",
    color: colorP1,
    touch: false,
    r: 20,
    x: canvas.width / 2,
    y: canvas.height / 2,
    xCoor: 0,
    yCoor: 0
}

// object storing information for the x2 and y2 coordinates on graph
const p2 = {
    name: "point2",
    color: colorP2,
    touch: false,
    r: 20,
    x: canvas.width * 0.75,
    y: canvas.height / 3,
    xCoor: 0,
    yCoor: 0
}

const line = {
    color: colorLine,
    width: 2
}


// initializing program
load();
/**
Function to initialize the program, and to reload
**/
function load() {

    drawBackground();

    backUpCanvas();

    drawLine(p1, p2, line);

    drawPoints(p1);
    drawPoints(p2);


    const bounds = canvas.getBoundingClientRect();
    let scaledX = canvas.width / bounds.width;
    let scaledY = canvas.height / bounds.height;
    let dragging = false;

    /*
     adding eventlistener for checking when mouse is down, if the mouse clicks on the
     coordinates of the points, then it'll set dragging to true in order to activate
     the move function.
    */
    canvas.addEventListener('mousedown', function (e) {
        const currentX = (e.clientX - bounds.left) * scaledX; // get the x position of the mouse click relative to the canvas
        const currentY = (e.clientY - bounds.top) * scaledY;

        // checking if the click is in the bounding area of the point on the graph
        if ((currentX <= p1.x + p1.r && currentX >= p1.x - p1.r) &&
            (currentY <= p1.y + p1.r && currentY >= p1.y - p1.r)) { // give a 20 pixel width of the position that the mouse can click
            p1.touch = true;
            p2.touch = false;
            dragging = true;

        }
        // checking if the click is in the bounding area of the point on the graph
        if ((currentX <= p2.x + p2.r && currentX >= p2.x - p2.r) &&
            (currentY <= p2.y + p2.r && currentY >= p2.y - p2.r)) { // give a 20 pixel width of the position that the mouse can click
            p1.touch = false;
            p2.touch = true;
            dragging = true;
        }

    });

    /*
     eventlistener to check for when the mouse is moving. Once the const dragging is set
     to true, then it'll trigger the rest of the function to enable the user to move
     the point around the graph
    */
    canvas.addEventListener('mousemove', function (e) {
        if (dragging === true) {

            // this if else checks which point was selectec
            if (p1.touch === true) {

                ctx.clearRect(p1.x - p1.r, p1.y - p1.r, p1.r * 2, p1.r * 2); // clearing the orginal point
                ctx.drawImage(canvasTemp, 0, 0); // setting the new point
                p1.x = e.clientX - bounds.left; //updating the points data
                p1.y = e.clientY - bounds.top;

                drawLine(p1, p2, line);
                drawPoints(p1);
                drawPoints(p2);

            } else {

                ctx.clearRect(p2.x - p2.r, p2.y - p2.r, p2.r * 2, p2.r * 2);
                ctx.drawImage(canvasTemp, 0, 0);
                p2.x = e.clientX - bounds.left;
                p2.y = e.clientY - bounds.top;

                drawLine(p1, p2, line);
                drawPoints(p2);
                drawPoints(p1);
            }
        }
    });

    /*
    event listener for stopping the movement once the user releases the mouse
    */
    canvas.addEventListener('mouseup', function (e) {
        dragging = false;

    });

    /*
    adding event listener to buttons to adjust the slope(m) of the graph
    */
    document.getElementById('upM').addEventListener('click', function () {
        m += 0.1;
        adjustingSlope(); // updates the graph
    });

    /*
    adding event listener to buttons to adjust the slope(m) of the graph
    */
    document.getElementById('downM').addEventListener('click', function () {
        m -= 0.1;
        adjustingSlope();
    });

    /*
    adding event listener to buttons to adjust the y-intercept(b) of the graph
    */
    document.getElementById('upB').addEventListener('click', function () {
        b++;
        p1.coorY++;
        p2.coorY++;
        adjustingB();
    });

    /*
    adding event listener to buttons to adjust the y-intercept(b) of the graph
    */
    document.getElementById('downB').addEventListener('click', function () {
        b--;
        p1.coorY--;
        p2.coorY--;
        adjustingB();
    });

    /*
    event listener for resize
    */
    window.addEventListener('resize', function () {
        load();
    }, true);

    /*
    event listener for scrolling to reload, otherwise the website is unresponsive
    */
    window.addEventListener('scroll', function () {
        load();
    });

}

/*
draw background function
sets up the background of the graph
*/
function drawBackground() {
    ctx.lineWidth = 2;
    ctx.strokeStyle = color2;

    //Start drawing rounded background box
    ctx.moveTo(0, 20); // start of the line (start point)
    ctx.quadraticCurveTo(2, 2, 20, 0); // (control point, end point)
    ctx.lineTo(canvas.width - 20, 0);
    ctx.quadraticCurveTo(canvas.width - 2, 2, canvas.width, 20)
    ctx.lineTo(canvas.width, canvas.height - 20);
    ctx.quadraticCurveTo(canvas.width - 2, canvas.height - 2, canvas.width - 20, canvas.height)
    ctx.lineTo(20, canvas.height);
    ctx.quadraticCurveTo(2, canvas.height - 2, 0, canvas.height - 20);
    ctx.closePath();
    ctx.fillStyle = color2;
    ctx.fill();
    ctx.stroke();

    //Start drawing grid
    ctx.beginPath();
    ctx.strokeStyle = bgColor;

    let temp = 50;

    for (i = temp; i <= canvas.width - temp; i += temp) {
        ctx.lineWidth = 2;
        // set wider stroke for x and y axis
        if (i === canvas.width / 2) {
            ctx.lineWidth = 5;
        }

        ctx.beginPath();
        ctx.moveTo(0, i)
        ctx.lineTo(canvas.width, i);

        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();

    }
    ctx.stroke();
}

/*
function to draw the points on the graph depending on the given point
@param - object
*/
function drawPoints(point) {
    ctx.beginPath();
    ctx.arc(point.x, point.y, point.r, 0, Math.PI * 2)
    ctx.fillStyle = point.color;
    ctx.fill();
    ctx.stroke;

    gettingFakeCoordinates(point); // needed to make coordinates user friendly

    slope.innerHTML = (Math.floor(gettingSlope() * 10) / 10);
    yIntercept.innerHTML = (Math.floor(gettingInterceptY() * 10) / 10);

    if (point.name === p1.name) {
        coordinates1.innerHTML = "(" + point.coorX + ", " + point.coorY + ")";
    } else {
        coordinates2.innerHTML = "(" + point.coorX + ", " + point.coorY + ")";
    }

}

/**
function for drawing the line that goes through both points on the graph
@param start - the first point object
@paran end - the second point object
@param line - line object
*/
function drawLine(start, end, line) {

    ctx.strokeStyle = line.color;
    ctx.lineWidth = line.width;

    ctx.beginPath();

    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();

}


/**
function for creating temporary canvas to store cartesian plane,
since in order to redraw the points, the background is erased and needs to
be redrawn. This function stores the original canvas to save time
**/
function backUpCanvas() {
    canvasTemp.width = canvas.width;
    canvasTemp.height = canvas.height;
    ctxTemp.drawImage(canvas, 0, 0); // right now the background is backed up
}

/**
Function for getting user friendly coordinates, helps with doing the calculations
for other functions a lot easier. Also makes the graph have an interval from
-25 to 25, instead of 500.
@param point object
**/
function gettingFakeCoordinates(point) {
    point.coorX = Math.round((point.x / 10) - 25, 1);
    point.coorY = -1 * (Math.round((point.y / 10) - 25, 1));
    m = gettingSlope(); // since we have user friendly coordinates, we can get the slope
    b = gettingInterceptY();

}

/**
Function for reverting back to the normal coordinates from Canvas, this is needed
in order to get the coordinate of point2 when manipulating the slope
@param point object
**/
function gettingActualCoordinates(point) {
    point.x = (point.coorX + 25) * 10;
    point.y = ((point.coorY * (-1)) + 25) * 10;
}

/**
Function for calculating slope
@return m float
**/
function gettingSlope() {
    m = (p2.coorY - p1.coorY) / (p2.coorX - p1.coorX);
    return m;
}

/**
Function for calculating y-yIntercept
@return b float
**/
function gettingInterceptY() {
    b = p2.coorY - (gettingSlope() * p2.coorX)
    return b;
}

/*
Function for updating the graph whenever the user adjusts the slope
calculated the distance of the current line before adjusting slope, then once having
the slope, was able to calcute where the second coordinate would fall on then
graph*/

function adjustingSlope() {

    let d = Math.sqrt(Math.pow(p2.coorX, 2) + Math.pow(p2.coorY, 2), 2);

    //calculating the second coordinate with the distance and slope
    p2.coorX = d * (1 / Math.sqrt(1 + Math.pow(m, 2)));
    p2.coorY = d * (m / Math.sqrt(1 + Math.pow(m, 2)));

    slope.innerHTML = m; //update the slope on the page
    yIntercept.innerHTML = b; //upadate the y-intercept on the page

    //clear and redraw the line and points
    ctx.clearRect(p1.x - p1.r, p1.y - p1.r, p1.r * 2, p1.r * 2);
    ctx.drawImage(canvasTemp, 0, 0);

    gettingActualCoordinates(p2); // need this to redraw in the right position

    drawLine(p1, p2, line);
    drawPoints(p1);
    drawPoints(p2);

}

/**
Function for updating the graph when adjusting the y-intercept, since coordinates
were updated already when pressing the button, just need to redraw the points
**/
function adjustingB() {

    ctx.clearRect(p1.x - p1.r, p1.y - p1.r, p1.r * 2, p1.r * 2);
    ctx.drawImage(canvasTemp, 0, 0);

    gettingActualCoordinates(p2);
    gettingActualCoordinates(p1);

    drawLine(p1, p2, line);
    drawPoints(p1);

    drawPoints(p2);

}