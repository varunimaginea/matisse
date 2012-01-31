/**
 * User: Bhavani Shankar,Pradeep
 * Date: 12/28/11
 * Time: 11:16 AM
 * About this : To set the properties of the object with the received object
 */

require(["matisse", "matisse.main", "matisse.layouts", "matisse.palettes.properties", "matisse.util"], function (matisse, main, layouts, objproperties, util) {
	
	layouts.registerLayout("content", {
		collectionName: 'content',
		layouts: {
			blank: {
				displayName: "blank",
				toolAction: function() {										
					var canvas_width = canvas.width ;
					var canvas_height = canvas.height;					
					var rect = new fabric.Rect({
						width: canvas_width - 20,
						height: canvas_height - 20,
						left: canvas_width/2 ,
						top: canvas_height/2,
						fill: '#ffffff',
						stroke: '#000000'
					});		
					rect.uid = util.uniqid();
					rect.name = "blank";
					rect.layout = "content";
					rect.selectable = false;				
					canvas.add(rect);		
					return rect;
				}				
			},
			column_header: {
				displayName: "column_header",				
				toolAction: function() {
					var canvas_width = canvas.width ;
					var canvas_height = canvas.height;
					var header = new fabric.Polygon(      
						[{x: -canvas_width/2 + 10, y: -canvas_height/2 + 10},{x: canvas_width/2 - 10, y: -canvas_height/2 + 10},{x: canvas_width/2 - 10, y: -canvas_height/2 + 70},{x: -canvas_width/2 + 10, y: -canvas_height/2 + 70}],
						{
							fill: '#ffffff', 
							stroke:'#000000'						
						}
					);	
					var content = new fabric.Polygon(      
						[{x: -canvas_width/2 + 10, y: canvas_height/2 - 10},{x: canvas_width/2 - 10, y: canvas_height/2 - 10},{x: canvas_width/2 - 10, y: -canvas_height/2 + 90},{x: -canvas_width/2 + 10, y: -canvas_height/2 + 90}],
						{
							fill: '#ffffff', 
							stroke:'#000000'						
						}
					);	
					var objects = [];					
					objects.push(content);
					objects.push(header);
					var pathgroup = new fabric.PathGroup (objects,{width: canvas_width, height: canvas_height});
					pathgroup.set({
						left: canvas_width/2,
						top: canvas_height/2 							
					});
					pathgroup.setCoords();
					pathgroup.selectable = false;
					pathgroup.uid = util.uniqid();
					pathgroup.name = "column_header";
					pathgroup.layout = "content";
					canvas.add(pathgroup);
					return pathgroup;
				}
			},
			column_header_footer: {
				displayName: "column_header_footer",				
				toolAction: function() {
					var canvas_width = canvas.width ;
					var canvas_height = canvas.height;
					var header = new fabric.Polygon(      
						[{x: -canvas_width/2 + 10, y: -canvas_height/2 + 10},{x: canvas_width/2 - 10, y: -canvas_height/2 + 10},{x: canvas_width/2 - 10, y: -canvas_height/2 + 70},{x: -canvas_width/2 + 10, y: -canvas_height/2 + 70}],
						{
							fill: '#ffffff', 
							stroke:'#000000'						
						}
					);	
					var content = new fabric.Polygon(      
						[{x: -canvas_width/2 + 10, y: canvas_height/2 - 90},{x: canvas_width/2 - 10, y: canvas_height/2 - 90},{x: canvas_width/2 - 10, y: -canvas_height/2 + 90},{x: -canvas_width/2 + 10, y: -canvas_height/2 + 90}],
						{
							fill: '#ffffff', 
							stroke:'#000000'						
						}
					);
					
					var footer = new fabric.Polygon(      
						[{x: -canvas_width/2 + 10, y: canvas_height/2 - 10},{x: canvas_width/2 - 10, y: canvas_height/2 - 10},{x: canvas_width/2 - 10, y: canvas_height/2 - 70},{x: -canvas_width/2 + 10, y: canvas_height/2 - 70}],
						{
							fill: '#ffffff', 
							stroke:'#000000'						
						}
					);
					var objects = [];					
					objects.push(content);
					objects.push(header);
					objects.push(footer);
					var pathgroup = new fabric.PathGroup (objects,{width: canvas_width, height: canvas_height});
					pathgroup.set({
						left: canvas_width/2,
						top: canvas_height/2 							
					});
					pathgroup.setCoords();
					pathgroup.selectable = false;
					pathgroup.uid = util.uniqid();
					pathgroup.name = "column_header_footer";
					pathgroup.layout = "content";
					canvas.add(pathgroup);
					return pathgroup;
				}
			},
			two_column_header: {
				displayName: "two_column_header",				
				toolAction: function() {
					var canvas_width = canvas.width ;
					var canvas_height = canvas.height;
					var header = new fabric.Polygon(      
						[{x: -canvas_width/2 + 10, y: -canvas_height/2 + 10},{x: canvas_width/2 - 10, y: -canvas_height/2 + 10},{x: canvas_width/2 - 10, y: -canvas_height/2 + 70},{x: -canvas_width/2 + 10, y: -canvas_height/2 + 70}],
						{
							fill: '#ffffff', 
							stroke:'#000000'						
						}
					);	
					var left_content = new fabric.Polygon(
						[{x: -canvas_width/2 + 10, y: canvas_height/2 - 10},{x: - 10, y: canvas_height/2 - 10},{x: - 10, y: -canvas_height/2 + 90},{x: -canvas_width/2 + 10, y: -canvas_height/2 + 90}],
						{
							fill: '#ffffff', 
							stroke:'#000000'						
						}
					);
					var right_content = new fabric.Polygon(      
						[{x: 10, y: canvas_height/2 - 10},{x: canvas_width/2 - 10, y: canvas_height/2 - 10},{x: canvas_width/2 - 10, y: -canvas_height/2 + 90},{x: 10, y: -canvas_height/2 + 90}],
						{
							fill: '#ffffff', 
							stroke:'#000000'						
						}
					);	
					var objects = [];		
					objects.push(header);
					objects.push(left_content);
					objects.push(right_content);
					var pathgroup = new fabric.PathGroup (objects,{width: canvas_width, height: canvas_height});
					pathgroup.set({
						left: canvas_width/2,
						top: canvas_height/2 							
					});
					pathgroup.setCoords();
					pathgroup.selectable = false;
					pathgroup.uid = util.uniqid();
					pathgroup.name = "two_column_header";
					pathgroup.layout = "content";
					canvas.add(pathgroup);
					return pathgroup;
				}
			},
			two_column_header_footer: {
				displayName: "two_column_header_footer",				
				toolAction: function() {
					var canvas_width = canvas.width ;
					var canvas_height = canvas.height;
					var header = new fabric.Polygon(      
						[{x: -canvas_width/2 + 10, y: -canvas_height/2 + 10},{x: canvas_width/2 - 10, y: -canvas_height/2 + 10},{x: canvas_width/2 - 10, y: -canvas_height/2 + 70},{x: -canvas_width/2 + 10, y: -canvas_height/2 + 70}],
						{
							fill: '#ffffff', 
							stroke:'#000000'						
						}
					);	
					var left_content = new fabric.Polygon(      
						[{x: -canvas_width/2 + 10, y: canvas_height/2 - 90},{x: - 10, y: canvas_height/2 - 90},{x: - 10, y: -canvas_height/2 + 90},{x: -canvas_width/2 + 10, y: -canvas_height/2 + 90}],
						{
							fill: '#ffffff', 
							stroke:'#000000'						
						}
					);
					var right_content = new fabric.Polygon(      
						[{x: 10, y: canvas_height/2 - 90},{x: canvas_width/2 - 10, y: canvas_height/2 - 90},{x: canvas_width/2 - 10, y: -canvas_height/2 + 90},{x: 10, y: -canvas_height/2 + 90}],
						{
							fill: '#ffffff', 
							stroke:'#000000'						
						}
					);	
					var footer = new fabric.Polygon(      
						[{x: -canvas_width/2 + 10, y: canvas_height/2 - 10},{x: canvas_width/2 - 10, y: canvas_height/2 - 10},{x: canvas_width/2 - 10, y: canvas_height/2 - 70},{x: -canvas_width/2 + 10, y: canvas_height/2 - 70}],
						{
							fill: '#ffffff', 
							stroke:'#000000'						
						}
					);
					var objects = [];
					objects.push(header);
					objects.push(left_content);
					objects.push(right_content);
					objects.push(footer);
					var pathgroup = new fabric.PathGroup (objects, {width: canvas_width, height: canvas_height});
					pathgroup.set({
						left: canvas_width/2,
						top: canvas_height/2 							
					});
					pathgroup.setCoords();
					pathgroup.selectable = false;
					pathgroup.uid = util.uniqid();
					pathgroup.name = "two_column_header_footer";
					pathgroup.layout = "content";
					canvas.add(pathgroup);
					return pathgroup;
				}
			},
			three_column_header: {
				displayName: "three_column_header",				
				toolAction: function() {
					var canvas_width = canvas.width ;
					var canvas_height = canvas.height;
					var header = new fabric.Polygon(      
						[{x: -canvas_width/2 + 10, y: -canvas_height/2 + 10},{x: canvas_width/2 - 10, y: -canvas_height/2 + 10},{x: canvas_width/2 - 10, y: -canvas_height/2 + 70},{x: -canvas_width/2 + 10, y: -canvas_height/2 + 70}],
						{
							fill: '#ffffff', 
							stroke:'#000000'						
						}
					);	
					var left_content = new fabric.Polygon(      
						[{x: -canvas_width/2 + 10, y: canvas_height/2 - 10},{x: -canvas_width/6 - 10, y: canvas_height/2 - 10},{x: -canvas_width/6 - 10, y: -canvas_height/2 + 90},{x: -canvas_width/2 + 10, y: -canvas_height/2 + 90}],
						{
							fill: '#ffffff', 
							stroke:'#000000'						
						}
					);
					var middle_content = new fabric.Polygon(      
						[{x: -canvas_width/6, y: canvas_height/2 - 10},{x: canvas_width/6, y: canvas_height/2 - 10},{x: canvas_width/6, y: -canvas_height/2 + 90},{x: -canvas_width/6 , y: -canvas_height/2 + 90}],
						{
							fill: '#ffffff', 
							stroke:'#000000'						
						}
					);
					var right_content = new fabric.Polygon(      
						[{x: canvas_width/6 + 10, y: canvas_height/2 - 10},{x: canvas_width/2 - 10, y: canvas_height/2 - 10},{x: canvas_width/2 - 10, y: -canvas_height/2 + 90},{x: canvas_width/6 + 10, y: -canvas_height/2 + 90}],
						{
							fill: '#ffffff', 
							stroke:'#000000'						
						}
					);	
					var objects = [];		
					objects.push(header);
					objects.push(left_content);
					objects.push(middle_content);
					objects.push(right_content);
					var pathgroup = new fabric.PathGroup (objects, {width: canvas_width, height: canvas_height});
					pathgroup.set({
						left: canvas_width/2,
						top: canvas_height/2 							
					});
					pathgroup.setCoords();
					pathgroup.selectable = false;
					pathgroup.uid = util.uniqid();
					pathgroup.name = "three_column_header";
					pathgroup.layout = "content";
					canvas.add(pathgroup);
					return pathgroup;
				}
			},
			
			three_column_header_footer: {
				displayName: "three_column_header_footer",				
				toolAction: function() {
					var canvas_width = canvas.width ;
					var canvas_height = canvas.height;
					var header = new fabric.Polygon(      
						[{x: -canvas_width/2 + 10, y: -canvas_height/2 + 10},{x: canvas_width/2 - 10, y: -canvas_height/2 + 10},{x: canvas_width/2 - 10, y: -canvas_height/2 + 70},{x: -canvas_width/2 + 10, y: -canvas_height/2 + 70}],
						{
							fill: '#ffffff', 
							stroke:'#000000'						
						}
					);	
					var left_content = new fabric.Polygon(      
						[{x: -canvas_width/2 + 10, y: canvas_height/2 - 90},{x: -canvas_width/6 - 10, y: canvas_height/2 - 90},{x: -canvas_width/6 - 10, y: -canvas_height/2 + 90},{x: -canvas_width/2 + 10, y: -canvas_height/2 + 90}],
						{
							fill: '#ffffff', 
							stroke:'#000000'						
						}
					);
					var middle_content = new fabric.Polygon(      
						[{x: -canvas_width/6, y: canvas_height/2 - 90},{x: canvas_width/6, y: canvas_height/2 - 90},{x: canvas_width/6, y: -canvas_height/2 + 90},{x: -canvas_width/6 , y: -canvas_height/2 + 90}],
						{
							fill: '#ffffff', 
							stroke:'#000000'						
						}
					);
					var right_content = new fabric.Polygon(      
						[{x: canvas_width/6 + 10, y: canvas_height/2 - 90},{x: canvas_width/2 - 10, y: canvas_height/2 - 90},{x: canvas_width/2 - 10, y: -canvas_height/2 + 90},{x: canvas_width/6 + 10, y: -canvas_height/2 + 90}],
						{
							fill: '#ffffff', 
							stroke:'#000000'						
						}
					);
					var footer = new fabric.Polygon(      
						[{x: -canvas_width/2 + 10, y: canvas_height/2 - 10},{x: canvas_width/2 - 10, y: canvas_height/2 - 10},{x: canvas_width/2 - 10, y: canvas_height/2 - 70},{x: -canvas_width/2 + 10, y: canvas_height/2 - 70}],
						{
							fill: '#ffffff', 
							stroke:'#000000'						
						}
					);
					var objects = [];		
					objects.push(header);
					objects.push(left_content);
					objects.push(middle_content);
					objects.push(right_content);
					objects.push(footer);
					var pathgroup = new fabric.PathGroup(objects, {width: canvas_width, height: canvas_height});
					pathgroup.set({
						left: canvas_width/2,
						top: canvas_height/2 							
					});
					pathgroup.setCoords();
					pathgroup.selectable = false;
					pathgroup.uid = util.uniqid();
					pathgroup.name = "three_column_header_footer";
					pathgroup.layout = "content";
					canvas.add(pathgroup);
					return pathgroup;
				}
			}			
		} // end of shapes
	}); // end of basic shapes
});