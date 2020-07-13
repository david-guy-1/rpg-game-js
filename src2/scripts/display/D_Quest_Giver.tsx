import React from 'react';
import * as U from "../utilities";
import DC_quest from "./DC_quest";
import * as T from "../tables";
import {game_context} from "../../AppContext";
class D_Quest_Giver extends React.Component {
	constructor(props : any){
		super(props);
		this.props = props; // props : item is a single item
	}
	render(){
	var name = this.props.name; // name should contain the "display" 
	var quests = this.props.quests;	
	var boxLocation = T.quest_giver_data[name].location;
	
	return <div>
		
		<div id="instructions" style={{"position":"absolute", "top":10,"left":500}} >{T.instructions_text["quest giver"]}</div>
					  
		<img src={require("../../images/" + T.quest_giver_data[name].image ) } 
		style={{"position":"absolute", "top":0,"left":0}}/> 
		
		<div style={{"position":"absolute", "top":boxLocation[1],"left":boxLocation[0], "width":boxLocation[2] - boxLocation[0], "height":boxLocation[3] - boxLocation[1], "overflow-y":"scroll", "overflow-x":"hidden"}}> 
		{/* quests...*/}
		{quests.map(function(x, index) { return <DC_quest quest={x} index={index} width={boxLocation[2] - boxLocation[0]}  />})}
		{/* back button...*/}
		<game_context.Consumer>{function({game, view, controller}){
		return  <button onClick ={function(){game.end_quest_giver(); controller.rerender()}}>Back</button>
		}.bind(this)}</game_context.Consumer>
		</div>
		 
	</div>
	}
}

export default D_Quest_Giver;

