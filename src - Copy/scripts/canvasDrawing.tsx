
export function drawLine(context, x0, y0, x1, y1, color, width){
//	////console.log(x0, y0, x1, y1)
  context.strokeStyle = (color == undefined ? "black" : color);
  context.lineWidth = (width == undefined ? 1 : width);
  context.beginPath();
  context.stroke(); 
  context.moveTo(x0,y0);
  context.lineTo(x1,y1);
  context.stroke();
}


export function drawImage(ctx, img, x, y, width, height){ //draws an image whose top-left corner is given

	ctx.drawImage(img,x,y,width,height);
	
}

//draws a circle with the given coordinates and color
export function drawCircle(context, x,y,r, color, width){
  //////console.log(x,y,r)
  context.strokeStyle = (color == undefined ? "black" : color);
  context.lineWidth = (width == undefined ? 1 : width);
  context.beginPath();
  context.arc(x,y,r,0*Math.PI,2*Math.PI);
  context.stroke();
  var p1 = { x: x, y: y };
  var p2 = { x: x, y: y };
	
}
//draws a circle with the given coordinates and color
export function drawRectangle(context, tlx, tly, brx, bry, color, width){
	context.strokeStyle = (color == undefined ? "black" : color);
	context.lineWidth = (width == undefined ? 1 : width);
	context.beginPath();
	context.rect(tlx, tly, brx-tlx, bry-tly);
	context.stroke();
}