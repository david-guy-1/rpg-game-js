import React from 'react';
import * as U from "../utilities.js";
import * as T from "../tables.js";
import * as draw from "../canvasDrawing.js";

class D_Town extends React.Component {
	constructor(props){
		super(props);
		this.props = props; // props is a town instance
//name,dungeons,shops,quest_takers
	}
	render(){
		this.canvasRef = React.createRef();
		var town = this.props.town;
		console.log(T.town_data);
		// first , check if it's valid
		if(T.town_data[town.name].dungeons.length < town.dungeons.length || 
		T.town_data[town.name].shops.length < town.shops.length || 
		T.town_data[town.name].quest_takers.length < town.quest_takers.length ){
			throw new ReferenceError("town parameters are invalid for " + town.name);	
		}
		return (<div>
					  <div id="instructions" style={{"position":"absolute", "top":10,"left":500}} >{T.instructions_text["town"]}</div>
					  
		<img src={require("../../images/" + T.town_data[town.name].image ) } 
		style={{"position":"absolute", "top":0,"left":0}}/>
		
		<canvas ref={this.canvasRef} style={{"position":"absolute", "top":0,"left":0}} width={1920} height={750}/>
		</div>
	    );
	}
	componentDidMount(){
		//draw rectangles;
		var town = this.props.town;
		var town_coords =  T.town_data[town.name];
		var ctx = this.canvasRef.current.getContext("2d");
		for (var rect of town_coords.dungeons){
			draw.drawRectangle(ctx, rect[0], rect[1], rect[2], rect[3], "red");
		}
		for (var rect of town_coords.shops){
			draw.drawRectangle(ctx, rect[0], rect[1], rect[2], rect[3], "blue");
		}
		for (var rect of town_coords.quest_takers){
			draw.drawRectangle(ctx, rect[0], rect[1], rect[2], rect[3], "green");
		}
	}
}


export default D_Town;


/*
try{
    asjda
} catch(e){
	if(e instanceof EvalError){
		console.log("eval");
	} 
	else if(e instanceof ReferenceError){
		console.log("reference");
	}else {
		throw e;
	}
} 	
*/