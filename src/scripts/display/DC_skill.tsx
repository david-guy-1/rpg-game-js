import React from 'react';
import player_skill from "../classes/player_skill"

// skill in the combat interface!

import {display_constants  as c} from "../tables";

class DC_skill extends React.Component{
	props : {"skill":player_skill, "selected":boolean, id:number, cooldown:number}
	constructor(props : {"skill":player_skill, "selected":boolean, id:number, cooldown:number}){
		super(props);
		this.props = props; 
	}
	render(){
		var skill = this.props.skill;
		var chosen = this.props.selected;
		var id = this.props.id; 
		var cd = this.props.cooldown;
		var attacks_labels = ["A","S","D","F","G","Z","X","C","V","B"];
		// background color
		var background_color = "";
		if(chosen && cd == 0){ //chosen and ready
			var background_color = "#ffaaaa";
		} else if(!chosen && cd == 0){ //not chosen and ready
			var background_color = "#ffffff";
		} else if(chosen && cd != 0){ //chosen and not ready
			var background_color = "#cc7777";
		} else if(!chosen && cd != 0){ //not chosen and not ready
			var background_color = "#777777";
		}  	
		return <div style={
			{
			"width":c.skill_width + "px",
			"height":c.skill_height + "px",	
			"border":"1px solid black",
			"padding":c.skill_internal_padding + "px",
			"backgroundColor":background_color,
			
		} }
		><span >{attacks_labels[id]}: </span> {skill.name} {cd}<br />Mana : {skill.mana} , cd : {skill.cd}</div>
	}
}

export default DC_skill;
