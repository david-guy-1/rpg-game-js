import React from 'react';
import * as U from "../utilities.tsx";
import * as D from "../canvasDrawing.tsx";
import * as T from "../tables.tsx";
import Dungeon from "../classes/dungeon.tsx";
import {game_context} from "../../AppContext.tsx";
class D_Dungeon extends React.Component {
	constructor(props){
		super(props);
		this.props = props; // props : "dungeon" : a I_Dungeon instance
		// x and y : the person's start and end location
		// cleared: list of locations (x,y) pairs, that are cleared. 
	}
	render(){

	var c = T.display_constants;
	//css for buttons to go to skills or inventory
	var skills_button_css = {"position":"absolute", "top":c.skills_button_top_left[1], "left":c.skills_button_top_left[0], "width":c.skills_button_width, "height":c.skills_button_height , "background-color":"lightgreen"};
	var inv_button_css = {"position":"absolute", "top":c.inv_button_top_left[1], "left":c.inv_button_top_left[0],"width":c.inv_button_width, "height":c.inv_button_height , "background-color":"lightblue"};
	//css for canvas
	var canvas_css = {"position":"absolute", "top":c.dungeon_top_left[1], "left":c.dungeon_top_left[0]};
	
	return <div>
			  <div id="instructions" style={{"position":"absolute", "top":10,"left":500}} >{T.instructions_text["dungeon"]}</div>
	<game_context.Consumer>{function({game, view, controller}){return<span>
	<button style={skills_button_css} onClick={function() {view.go_to_skills();controller.rerender();}}> <h2 style={{"text-align":"center"}}>Skills</h2> </button>
	<button style={inv_button_css} onClick={function(){view.go_to_inventory();controller.rerender();}}> <h2 style={{"text-align":"center"}}>Inventory</h2></button></span>
	}.bind(this)}</game_context.Consumer>
	<canvas ref="dungeon_canvas" width={c.dungeon_width} height = {c.dungeon_height} style={canvas_css}> </canvas></div>
	}
	componentDidMount(){
		this.rerender();
	}
	componentDidUpdate(){
	//	console.log("A");
		this.rerender();
	}
	rerender(){
		//load variables
		var dungeon = this.props.dungeon_instance;
		var px = dungeon.player_x;
		var py = dungeon.player_y;
	//	console.log(px);
	//	console.log(py);
		var entities = dungeon.entities;
		
		var canvas = this.refs.dungeon_canvas;
		var context = canvas.getContext("2d");
		context.clearRect(0,0,800,800);
		var width = T.display_constants.dungeon_cell_width;
		var height = T.display_constants.dungeon_cell_height;
		
		var tlX = T.display_constants.dungeon_coords[0];
		var tlY = T.display_constants.dungeon_coords[1];
		//draw lines
		
		//remember: row i, column j -> (j, i) in x-y coordinates. 
		
		
		//draw the squares
		for(var i=0; i<dungeon.dungeon.rows;i++){
			for(var j=0; j<dungeon.dungeon.cols;j++){
				//row i, column j at 
				D.drawRectangle(context,tlX+j*width,tlY + i*height,tlX+j*width+width,tlY + i*height+height,"grey",1);
			}
		}
		
		//draw the walls
		for(var i=0; i<dungeon.dungeon.walls.length; i++){
			var wall = dungeon.dungeon.walls[i];
			var x = wall[0];
			var y = wall[1];
			if(wall[2] == "right"){

				D.drawLine(context,tlX + width * (x+1) , tlY + height * y ,tlX + width * (x + 1) , tlY + height * (y +1),"black",3);
			} else if(wall[2] == "down"){
				D.drawLine(context,tlX + width * x , tlY + height * (y+1) ,tlX + width * (x + 1) , tlY + height * (y +1),"black",3)			;	
			} else {
				throw new TypeError("wall has invalid direction");
			}
			
		}
		//draw the locks
		
		var lock_key_colors = ["purple", "red", "aqua", "Chartreuse", "DarkGreen", "Gold"];
		
		/*for(var i=0; i < lock_key_colors.length;  i++){
			D.drawLine(context,50*i+200, 100, 50*i+200, 400 ,lock_key_colors[i],10);
		}*/
		
		for(var i=0; i<dungeon.dungeon.locks.length; i++){
			if(dungeon.unlocked[i] == true){
				continue;
			}
			var color = lock_key_colors[i%5]
			var wall = dungeon.dungeon.locks[i];
			var x = wall[0];
			var y = wall[1];
				
			if(wall[2] == "right"){
				D.drawLine(context,tlX + width * (x+1) , tlY + height * y ,tlX + width * (x + 1) , tlY + height * (y +1),color,3);
			} else if(wall[2] == "down"){
				D.drawLine(context,tlX + width * x , tlY + height * (y+1) ,tlX + width * (x + 1) , tlY + height * (y +1),color,3)			;	
			} else {
				throw new TypeError("wall has invalid direction");
			}
			
		}
		//draw the player
		var player_coords = this.getCenter(px,py);
		D.drawCircle(context,player_coords[0],player_coords[1], 15, "green");

		//draw each entity;
		for(var i=0; i<entities.length;i++){
			var entity = entities[i];
			var entity_coords = this.getCenter(entity[0], entity[1])
			if(entity[2].type == "monster"){
				D.drawCircle(context,entity_coords[0],entity_coords[1], 15,"red");
				D.drawLine(context, entity_coords[0], entity_coords[1]-10, entity_coords[0]-6, entity_coords[1]+10, "red");
				D.drawLine(context, entity_coords[0]-6, entity_coords[1]+10, entity_coords[0]+6, entity_coords[1]+10, "red");
				D.drawLine(context, entity_coords[0]+6, entity_coords[1]+10, entity_coords[0], entity_coords[1]-10, "red");
				
			} else if(entity[2].type == "item"){
				D.drawCircle(context,entity_coords[0],entity_coords[1], 15,"blue");		
				D.drawRectangle(context, entity_coords[0]-5, entity_coords[1]-5, entity_coords[0]+5, entity_coords[1]+5,"blue",3)
			}
		}
		//draw the keys
		for(var i=0; i<dungeon.dungeon.keys.length; i++){
			var key = dungeon.dungeon.keys[i];
			var keyLoc = this.getCenter(key[0], key[1]);
			D.drawCircle(context,keyLoc[0], keyLoc[1]+10, 5,lock_key_colors[i%5]);
			D.drawLine(context,keyLoc[0], keyLoc[1]+5, keyLoc[0], keyLoc[1]-5,lock_key_colors[i%5], 3);
			D.drawLine(context,keyLoc[0], keyLoc[1]-5, keyLoc[0]+5, keyLoc[1]-5,lock_key_colors[i%5]);
			D.drawLine(context,keyLoc[0], keyLoc[1], keyLoc[0]+5, keyLoc[1],lock_key_colors[i%5]);
		}
	}
	//get the coordinates of the center of the cell with given coordinates
	getCenter(x,y){
		var width = T.display_constants.dungeon_cell_width;
		var height = T.display_constants.dungeon_cell_height;
		
		var tlX = T.display_constants.dungeon_coords[0];
		var tlY = T.display_constants.dungeon_coords[1];
		return [tlX + width * (x + 0.5) , tlY + height * (y + 0.5)] 
		
	}
}

export default D_Dungeon;


/* 
def process(string):
    s = "{{\""
    s += string.replace(":","\":\"").replace(";","\",\"")
    #optional: repalce numbers
    for i in "0123456789":
        s = s.replace("\"" + i, i)
        s = s.replace(i + "\"" , i) 
    s=s[0:len(s)-2] + "}}"
    print(s)
*/
