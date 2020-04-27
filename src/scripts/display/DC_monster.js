import React from 'react';
import {display_constants  as c, images_lst as im} from "../tables.js";

class DC_monster extends React.Component{
	constructor(props){
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
		var monster_cd = Math.min(monster.current_cd,max_cd_color )* 255 / max_cd_color; // this is a number from 0 to 255
		var red = Math.max(0,Math.floor(-monster_cd + 255));
		var green = Math.max(0, Math.floor(monster_cd));
		console.log([red, green, monster_cd])
		var bg_string = "rgb(" + red + "," +green+",0)";

		return <div style={{"width":c.monster_width + "px", "border":"1px solid black", "position":"absolute", "top":c.monsters_top_left[0] ,"left":c.monsters_top_left[1] + (id)*(c.monster_width + c.monsters_gap) ,  }}>
		{/* icon */}
		<div style={{"height":c.icon_height + "px"}} id={"icon_" + id}> 
<img src={require("../../images/" + im[monster.name])} />  </div>
		{/* attack indicator */}	

		<div style={{"position":"absolute", "top":c.attack_indicator_top_left[1], "left":c.attack_indicator_top_left[0], "width":c.attack_indicator_width}}>Cooldown: </div>
		
		<div style={{"position":"absolute", "top":c.attack_indicator_top_left[1]+30, "left":c.attack_indicator_top_left[0], "width":c.attack_indicator_width, "height":c.attack_indicator_height,"background-color":bg_string}}> </div>
		{/* name */}
		<div style={{"height":c.name_height + "px", "background-color" :(target? "#ffaaaa" : "#ffffff") ,}} id={"name_" + id}> <h3 style={{"text-align":"center"}}>{monster.name}</h3></div>		
		{/* hp */}
		<div style={{"height":c.hp_height + "px"}} id={"hp_" + id} className="hp_box"> HP: {monster.hp }/ {monster.max_hp}</div>
		{/* effects */}
		<div style={{"height":c.effects_height + "px"}} id={"effects_" + id} className="effect_box"> 
		{
		// rendering effects
		function(){
//			console.log(monster.effects)
			var components = [];
			for(var i=0; i<monster.effects.length;i++){
				var effect = monster.effects[i];
				components.push(effect.name + " " + effect.strength.toString() + " (" + effect.duration.toString() +")");
			}
			return components;
		}()
		}
		
		</div>

		{/* hp bar*/}
		<div style={{"height":c.hp_bar_height + "px" , "background-color":"red"}} id={"health_bar_" + id} className="enemy_health_bar"> 
		
		<div style={{"width":(monster.hp*100 / monster.max_hp) + "%","height":c.hp_bar_height + "px","background-color":"green" }} id={"health_bar_" + id + "_inner"} className="enemy_health_bar_inner"> </div>
		
		</div>		
	

		</div>;
  
	}
}

export default DC_monster;
