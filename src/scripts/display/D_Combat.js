import React from 'react';
import '../instances/I_Combat.js';
import * as U from "../utilities.js";
import * as T from "../tables.js";
import DC_monster from "./DC_monster.js";
import DC_skill from "./DC_skill.js";
class D_Combat extends React.Component {
	constructor(props){
		super(props);
		this.props = props; // props is a combat instance
		this.zero_last_tick = false;
	}
	render(){
		var combat = this.props.combat;
		var c = T.display_constants;
		var cd = combat.player_current_cd;
		// player cd 0 two frames in a row?
		var zero_twice = this.zero_last_tick && cd ==0 && combat.current_ticks != 0; 
		this.zero_last_tick = cd == 0;
		//console.log(combat);
	    return (
		  <div className="App">
		  <div id="instructions" style={{"position":"absolute", "top":10,"left":500}} >{T.instructions_text["fight"]}</div>
		  <div id="screen">
		  
		  { // render enemies....
			function(){
			var components = [];
			for(var i=0; i<combat.fighting_monsters.length;i++){
				components.push(<div style={{"position":"absolute","top":c.monster_screen_top_left[1] , "left":c.monster_screen_top_left[0],  }}
				id="monster_NUM" className ="monster_div"
				onClick = {function(){combat.currently_attacking_monster = this}.bind(i)}
				><DC_monster monster={combat.fighting_monsters[i]} key={i}  id={i} target = {combat.currently_attacking_monster == i} /> </div>);

			}
			return components;
			}()
		  }
		  
		  {/* render skills  */}
		  
		<div style={{ "position":"absolute", "top" : c.skill_top_left[1] + "px", "left" : c.skill_top_left[0] + "px"}}>
		{
			function(){
				var components = [];
				for(var i=0; i<10; i++){
					if(combat.player.skills[i] != undefined){
						components.push(<div onClick = {function(){combat.currently_queued_attack = this}.bind(i)}><DC_skill key={i} id={i} skill={combat.player.skills[i]}  selected={combat.currently_queued_attack == i}/></div>);
					}
				}
				return components;
			}()
		}
		</div>
	{ /* health bars */ }
		<div id="player_health_bar" style={
		{"position":"absolute","top":c.player_health_bar_top_left[1]+"px","left":c.player_health_bar_top_left[0],"width":c.player_health_bar_width + "px", "height":c.player_health_bar_height + "px", "background-color":"grey",}

}> <div id="player_health_bar_inner" style={
		{"width": (combat.player_hp*100 / combat.player_max_hp) + "%", "height":c.player_health_bar_height  + "px", "background-color":"green",} 
}> </div></div>

		{/* player stats */}

	<table id="player_stats" style = {{

		"position":"absolute",
		"top":c.player_stats_top_left[1] + "px",
		"left":c.player_stats_top_left[0],
		"width":c.player_stats_full_width + "px",
		"height":c.player_stats_full_height + "px",
		"border": "1px solid black",
		"background-color":zero_twice? "cyan" : "white",
}}> <tbody>
	<tr style={{"height":c.player_stats_height + "px",}}>
	<td style={{"width":c.player_stats_width + "px"}} id="player_hp_2">HP: {Math.floor(combat.player_hp)} / {combat.player_max_hp} </td>
	<td style={{"width":c.player_stats_width + "px"}} id="player_attack_2">Attack:{combat.player_attack}</td>
	<td  style={{"width":c.player_stats_width + "px"}} id="player_defense_2">Defense:{combat.player_defense} </td>
	<td  style={{"width":c.player_stats_width + "px"}} id="player_mana_2"> Mana:{combat.player_mana}/ {combat.player_max_mana}</td>
	<td  style={{"width":c.player_stats_width + "px"}} id="player_cd_2"> Delay:{combat.player_current_cd}</td>
	</tr>
	<tr style={{"height":c.player_stats_height + "px",}}><td colSpan={5} id="player_effects_2"> 
		{
		// render player effects
		function(){
			if(combat.current_ticks == 0){
				return <h2>Press any key to begin combat</h2>
			} else {
				var component = [];
				for(var j=0; j<combat.player_effects.length;j++){
					var effect = combat.player_effects[j];
					component.push(effect.name + " " + effect.strength.toString() + "(" + effect.duration.toString() + "). ") ;
				}
				return component;
			}
		}()
		}
	</td>
	</tr>
	</tbody></table>
		
		<div id="ticks_counter" style={{"position":"absolute", "left":c.ticks_top_left[0] + "px", "top":c.ticks_top_left[1] + "px"}}> {combat.current_ticks}</div>
		</div>
		  </div>
	    );
	}
}

export default D_Combat;
