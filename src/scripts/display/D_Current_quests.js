import React from 'react';
import * as U from "../utilities.js";
import * as T from "../tables.js";
import * as draw from "../canvasDrawing.js";
import DC_quest from "./DC_quest.js";
class D_Current_quests extends React.Component {
	constructor(props){
		super(props);
		this.props = props; // props is a town instance
//name,dungeons,shops,quest_takers
	}
	render(){
		var quests  = this.props.quests;
		var completed = quests.filter((x) => x.state == 4);
		var uncompleted = quests.filter((x) => x.state != 4);
		var c = T.display_constants;
		return <div>
		{/*Incomplete quests */}
		<div style = {{"position":"absolute", "top":c.quest_display_top_left[1], "left":c.quest_display_top_left[0], 
		"width":c.quest_display_width, "height":c.quest_display_height,  "overflow-y":"scroll", "overflow-x":"hidden"
		}}>
		{uncompleted.map(function(x, index) { return <DC_quest quest={x} index={index} width={c.quest_display_width}  />})}
		</div>
		
		{/*Completed quests */}
		<div style = {{"position":"absolute", "top":c.quest_display_completed_top_left[1], "left":c.quest_display_completed_top_left[0], 
		"width":c.quest_display_completed_width, "height":c.quest_display_completed_height,  "overflow-y":"scroll", "overflow-x":"hidden"
		}}>
		{completed.map(function(x, index) { return <DC_quest quest={x} index={index} width={c.quest_display_width}  />})}
		
		</div>
		
		</div>
	}
}


export default D_Current_quests;

//