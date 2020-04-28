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

		return (<div>
					  <div id="instructions" style={{"position":"absolute", "top":10,"left":500}} >{T.instructions_text["town"]}</div>
					  
		<img src={require("../../images/" + T.town_data[town.name].image ) } 
		style={{"position":"absolute", "top":0,"left":0}}/>
		
		<canvas ref={this.canvasRef} style={{"position":"absolute", "top":0,"left":0}} width={1600} height={720}/>
		</div>
	    );
	}
	componentDidMount(){
		//draw rectangles;
		var town = this.props.town;
		var town_coords =  T.town_data[town.name];
		var ctx = this.canvasRef.current.getContext("2d");
		for (var rect of town_coords.rectangles){
			if(rect[4] != undefined){
				draw.drawRectangle(ctx, rect[0], rect[1], rect[2], rect[3], rect[4]);
			}
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