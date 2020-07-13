import React from 'react';
import * as U from "../utilities";
import monster from "../classes/monster"

import {display_constants  as c, images_lst as im} from "../tables";

class DC_monster extends React.Component{
	props:{"monster":monster, "id":number, "target":boolean} 
	constructor(props : {"monster":monster, "id":number, "target":boolean} ){
		super(props);
		this.props = props; 
		// props.monster is a monster instance, id is the position the monster is in (which might be not present) , and "target" is whether or not this monster is being attacked (which might also be not present)
	}
	render(){
		var monster=this.props.monster;
		var id = this.props.id;
		var target = this.props.target; // if we are currently attacking this monster
		// compute the monster's cd (= background)
		var max_cd_color = 70; // should this be in tables?
		var monster_cd = Math.min(monster.current_delay,max_cd_color )* 255 / max_cd_color; // this is a number from 0 to 255
		var red = Math.max(0,Math.floor(-monster_cd + 255)); 
		var green = Math.max(0, Math.floor(monster_cd));
		//console.log([red, green, monster_cd])
		var bg_string = "rgb(" + red + "," +green+",0)";

		return <div style={{"width":c.monster_width + "px", "border":"1px solid black", "position":"absolute", "top":c.monsters_top_left[0] ,"left":c.monsters_top_left[1] + (id)*(c.monster_width + c.monsters_gap) ,  } as React.CSSProperties}>
		{/* icon */}
		<div style={{"height":c.icon_height + "px"} as React.CSSProperties} id={"icon_" + id}> 
<img src={require("../../images/" + im[monster.name])} />  </div>
		{/* attack indicator */}	

		<div style={{"position":"absolute", "top":c.attack_indicator_top_left[1], "left":c.attack_indicator_top_left[0], "width":c.attack_indicator_width} as React.CSSProperties}>Cooldown: </div>
		
		<div style={{"position":"absolute", "top":c.attack_indicator_top_left[1]+30, "left":c.attack_indicator_top_left[0], "width":c.attack_indicator_width, "height":c.attack_indicator_height,"backgroundColor":bg_string} as React.CSSProperties}> </div>
		{/* name */}
		<div style={{"height":c.name_height + "px", "backgroundColor" :(target? "#ffaaaa" : "#ffffff") ,} as React.CSSProperties} id={"name_" + id}> <h3 style={{"textAlign":"center"} as React.CSSProperties}>{monster.name}</h3></div>		
		{/* hp */}
		<div style={{"height":c.hp_height + "px"} as React.CSSProperties} id={"hp_" + id} className="hp_box"> HP: {monster.hp }/ {monster.max_hp}</div>
		{/* effects */}
		<div style={{"height":c.effects_height + "px"} as React.CSSProperties} id={"effects_" + id} className="effect_box"> 
		{
		// rendering effects
		function(){
//			console.log(monster.effects)
			var components  : any[]= [];
			var effects = U.union_lst(monster.effects);
			for(var effect of effects){
				components.push(effect.name + " " + effect.strength.toString() + " (" + effect.duration.toString() +")");
			}
			return components;
		}()
		}
		
		</div>

		{/* hp bar*/}
		<div style={{"height":c.hp_bar_height + "px" , "backgroundColor":"red"} as React.CSSProperties} id={"health_bar_" + id} className="enemy_health_bar"> 
		
		<div style={{"width":(monster.hp*100 / monster.max_hp) + "%","height":c.hp_bar_height + "px","backgroundColor":"green" } as React.CSSProperties} id={"health_bar_" + id + "_inner"} className="enemy_health_bar_inner"> </div>
		
		</div>		
	

		</div>;
  
	}
}

export default DC_monster;
