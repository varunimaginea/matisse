// JavaScript Document
/**
*
*
*/
function registerAction(action, drawCommand) {
	actions[action] = drawCommand;
}


/**
 * Adds Rectangle to canvas
 * @property _width, _height, _left, _top, _fill, _angle
 * @type null
 */

function addRectangle(_width, _height, _left, _top, _fill, _angle, _uid) {
    var rect = new fabric.Rect({
        width: _width,
        height: _height,
        left: _left,
        top: _top,
        fill: _fill
    });
    rect.uid = _uid;
    canvas.add(rect);
    canvas.setActiveObject(rect);
}

registerAction("rect", addRectangle);


function addCircle(_radius, _left, _top, _fill, _opacity, _angle, _uid) {
    var cir = new fabric.Circle({
        radius: _radius,
        left: _left,
        top: _top,
        fill: _fill,
        opacity: _opacity,
        angle: _angle
    });
    cir.uid = _uid;
    canvas.add(cir);
    canvas.setActiveObject(cir);
}

registerAction("circle", addCircle);


function addText(_uid) {
    var text = 'HTML5 IS FUN...';
    var textSample = new fabric.Text(text, {
        left: 100,
        top: 50,
        fontFamily: 'delicious_500',
        angle: 0,
        fill: fillColor,
        scaleX: 0.5,
        scaleY: 0.5,
        height: 20

    });
	alert(textSample)
    textSample.uid = _uid;
    canvas.add(textSample);
}
registerAction("text", addText);