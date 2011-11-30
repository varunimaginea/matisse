// JavaScript Document
/**
 *
 *
 */


function registerTool(toolname, tooldesc) {
    tools[toolname] = tooldesc;
}

/**
 * Adds Rectangle to canvas
 * @property args
 * @type null
 */
registerTool("Rectangle", {
    displayName: "Rectangle",
    displayIcon: "rect.png",
	displayIcon2: "norectangle.jpg",
    toolAction: function (args) {
        var rect = new fabric.Rect({
            width: args.width,
            height: args.height,
            left: args.left,
            top: args.top,
            fill: args.fillColor,
			stroke:args.strokeColor
        });
        rect.uid = args.uid;
        canvas.add(rect);
        canvas.setActiveObject(rect);
    },
	properties: [
		{
		name:'left',
		type:'number', 
		action:function(args){
				args.obj.left = args.x},
		defaultvalue:100		
		},
		{
		name:'top',
		type:'number',
		action:function(args) {
				args.obj.top = args.y},
		defaultvalue:100		
		},
		{
		name:'width',
		type:'number',
		action:function(args) {
				args.obj.width = args.width},
		defaultvalue:200		
		},
		{
		name:'height',
		type:'number',
		action:function(args) {
				args.obj.height = args.height},
		defaultvalue:100		
		},
		{
		name:'fillColor',
		type:'string',
		action:function(args) {
				args.obj.fill = args.fillColor},
		defaultvalue:'#FF0000'		
		},
		{
		name:'strokeColor',
		type:'string',
		action:function(args) {
				args.obj.strokeColor = args.strokeColor},
		defaultvalue:'#00FF00'		
		},
		{
		name:'angle',
		type:'number',
		action:function(args) {
				args.obj.angle = args.angle},
		defaultvalue:0	
		}
		]
});

/**
 * Adds Circle to canvas
 * @property args
 * @type null
 */
registerTool("Circle", {
    displayName: "Circle",
    displayIcon: "circle.png",
	displayIcon2: "nocircle.png",
    toolAction: function addCircle(args) {
        var cir = new fabric.Circle({
            radius: args.radius,
            left: args.left,
            top: args.top,
            fill: args.fillColor,
            opacity: args.opacity,
            angle: args.angle
        });
        cir.uid = args.uid;
        canvas.add(cir);
        canvas.setActiveObject(cir);
    },
    properties: [
		{
		name:'left',
		type:'number', 
		action:function(args){
				args.obj.left = args.x},
		defaultvalue:100		
		},
		{
		name:'top',
		type:'number',
		action:function(args) {
				args.obj.top = args.y},
		defaultvalue:100		
		},
		{
		name:'radius',
		type:'number',
		action:function(args) {
				args.obj.width = args.radius},
		defaultvalue:20		
		},
		
		{
		name:'fillColor',
		type:'string',
		action:function(args) {
				args.obj.fill = args.fillColor},
		defaultvalue:'#FF0000'		
		},
		{
		name:'strokeColor',
		type:'string',
		action:function(args) {
				args.obj.strokeColor = args.strokeColor},
		defaultvalue:'#00FF00'		
		},
		{
		name:'angle',
		type:'number',
		action:function(args) {
				args.obj.angle = args.angle},
		defaultvalue:0	
		}
		]

});


/**
 * Adds Text to canvas
 * @property args
 * @type null
 */
registerTool("Text", {
    displayName: "Text",
    displayIcon: "text.png",
	displayIcon2: "notext.png",
    toolAction: function addText(args) {
        var text = 'HTML5 IS FUN...';
        var textSample = new fabric.Text(text, {
            left: args.left,
            top: args.top,
            fontFamily: args.fontFamily,
            angle: args.angle,
            fill: args.fillColor,
        });
        //alert(textSample)
        textSample.uid = args.uid;
        canvas.add(textSample);
    },
	properties: [
		{
		name:'left',
		type:'number', 
		action:function(args){
				args.obj.left = args.x},
		defaultvalue:100		
		},
		{
		name:'top',
		type:'number',
		action:function(args) {
				args.obj.top = args.y},
		defaultvalue:100		
		},
		{
		name:'fontFamily',
		type:'string',
		action:function(args) {
				args.obj.width = args.fontFamily},
		defaultvalue:'delicious_500'		
		},
		
		{
		name:'fillColor',
		type:'string',
		action:function(args) {
				args.obj.fill = args.fillColor},
		defaultvalue:'#FF0000'		
		},
		{
		name:'strokeColor',
		type:'string',
		action:function(args) {
				args.obj.strokeColor = args.strokeColor},
		defaultvalue:'#00FF00'		
		},
		{
		name:'angle',
		type:'number',
		action:function(args) {
				args.obj.angle = args.angle},
		defaultvalue:0	
		}
		]
});



/**
 * Adds Drawing to canvas
 * @property args
 * @type null
 */
registerTool("Draw", {
    displayName: "Draw",
    displayIcon: "nobrush.png",
	displayIcon2: "brush.png",
    toolAction: null
    
});





