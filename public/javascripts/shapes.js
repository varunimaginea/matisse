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
registerTool("rect", {
    displayName: "rect",
    displayIcon: "rect.png",
	displayIcon2: "norectangle.jpg",
    toolAction: function (args) {
        var rect = new fabric.Rect({
            width: args.width,
            height: args.height,
            left: args.left,
            top: args.top,
            fill: args.fill,
			stroke:args.stroke,
			angle:args.angle,
			scaleX:1,
			scaleY:1
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
				(args.obj).set("left", args.property);
				},
		defaultvalue:100		
		},
		{
		name:'top',
		type:'number',
		action:function(args) {
				(args.obj).set("top", args.property);
				},
		defaultvalue:100		
		},
		{
		name:'width',
		type:'number',
		action:function(args) {
				(args.obj).set("width", args.property/args.obj.scaleX);},
		defaultvalue:200		
		},
		{
		name:'height',
		type:'number',
		action:function(args) {
				(args.obj).set("height", args.property/args.obj.scaleY);},
		defaultvalue:100		
		},
		{
		name:'scaleX',
		type:'number',
		action:function(args) {
				(args.obj).set("scaleX", args.property);},
		defaultvalue:200		
		},
		{
		name:'scaleY',
		type:'number',
		action:function(args) {
				(args.obj).set("scaleY", args.property);},
		defaultvalue:100		
		},
		{
		name:'fill',
		type:'string',
		action:function(args) {
				(args.obj).set("fill", args.property);},
		defaultvalue:'#FF0000'		
		},
		{
		name:'stroke',
		type:'string',
		action:function(args) {
				(args.obj).set("stroke", args.property);},
		defaultvalue:'#00FF00'		
		},
		{
		name:'angle',
		type:'number',
		action:function(args) {
				(args.obj).set("angle", args.property);},
		defaultvalue:0	
		}
		]
});

/**
 * Adds Circle to canvas
 * @property args
 * @type null
 */
registerTool("circle", {
    displayName: "circle",
    displayIcon: "circle.png",
	displayIcon2: "nocircle.png",
    toolAction: function addCircle(args) {
        var cir = new fabric.Circle({
            radius: args.radius,
            left: args.left,
            top: args.top,
            fill: args.fill,
			stroke: args.stroke,
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
				(args.obj).set("left", args.property);},
		defaultvalue:100		
		},
		{
		name:'top',
		type:'number',
		action:function(args) {
				(args.obj).set("top", args.property);},
		defaultvalue:100		
		},
		{
		name:'radius',
		type:'number',
		action:function(args) {
				(args.obj).set("radius", args.property/args.obj.scaleX);},
		defaultvalue:20		
		},
		
		{
		name:'fill',
		type:'string',
		action:function(args) {
				(args.obj).set("fill", args.property);},
		defaultvalue:'#FF0000'		
		},
		{
		name:'stroke',
		type:'string',
		action:function(args) {
				(args.obj).set("stroke", args.property);},
		defaultvalue:'#00FF00'		
		},
		{
		name:'angle',
		type:'number',
		action:function(args) {
				(args.obj).set("angle", args.property);},
		defaultvalue:0	
		}
		]

});


/**
 * Adds Text to canvas
 * @property args
 * @type null
 */
registerTool("text", {
    displayName: "text",
    displayIcon: "text.png",
	displayIcon2: "notext.png",
    toolAction: function addText(args) {
        var text = 'HTML5 IS FUN...';
        var textSample = new fabric.Text(text, {
            left: args.left,
            top: args.top,
            fontFamily: args.fontFamily,
            angle: args.angle,
            fill: args.fill,
			stroke: args.stroke
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
				(args.obj).set("left", args.property);},
		defaultvalue:100		
		},
		{
		name:'top',
		type:'number',
		action:function(args) {
				(args.obj).set("top", args.property);},
		defaultvalue:100		
		},
		{
		name:'fontFamily',
		type:'string',
		action:function(args) {
				(args.obj).set("fontFamily", args.property);},
		defaultvalue:'delicious_500'		
		},
		
		{
		name:'fill',
		type:'string',
		action:function(args) {
				(args.obj).set("fill", args.property);},
		defaultvalue:'#FF0000'		
		},
		{
		name:'stroke',
		type:'string',
		action:function(args) {
				(args.obj).set("stroke", args.property);},
		defaultvalue:'#00FF00'		
		},
		{
		name:'angle',
		type:'number',
		action:function(args) {
				(args.obj).set("angle", args.property);},
		defaultvalue:0	
		}
		]
});



/**
 * Adds Drawing to canvas
 * @property args
 * @type null
 */
registerTool("path", {
    displayName: "path",
    displayIcon: "nobrush.png",
	displayIcon2: "brush.png",
    toolAction: null
    
});





