import React from 'react';
import * as U from "../utilities.js";
import * as T from "../tables.js";
import DC_skill_desc from "./DC_skill_desc.js";


class D_Skills extends React.Component {
	constructor(props){
		super(props);
		this.props = props; // props is a combat instance
	}
	render(){
		var skills = this.props.skills;
		var equip = this.props.equip;
		var c = T.display_constants;
		var selected_skill = this.props.selected_skill;
		var selected_equip = this.props.selected_equip;
		console.log([skills],[equip])
	    return (
		<div>
		  
		  <div id="instructions" style={{"position":"absolute", "top":10,"left":500}} >{T.instructions_text["skills"]}</div>
		  
			  { /*render skills names*/ }
		  
		  <div style={{"position":"absolute", "top":c.skill_names_top_left[1],"left":c.skill_names_top_left[0], "width":c.skill_name_width*(c.skill_table_cols+0.2), "height":c.skill_name_height * (c.skill_table_rows+0.2), }}>
			 {// render boxes..
				function(){
					var components = [];
					for(var i=0; i<c.skill_table_rows; i++){
						for(var j=0; j<c.skill_table_cols;j++){
							//render row i, col j at position (width *j, height * i)
							var d = c.skill_table_cols*i+j; // d is item index
							console.log([d,i,j])
							var skill = skills[d];
							console.log(d)
							components.push(<div style={{"position":"absolute", "top":c.skill_name_height * i,"left":c.skill_name_width * j,"width":c.skill_name_width,"height":c.skill_name_height,"background-color" : selected_skill == d ? "cyan" : "white"}} onClick={function(){window.view.selected_skill=this;window.controller.rerender()}.bind(d)}>
								{skill == undefined? "" : skill.name};
							</div>);
							}
						}
					return components;
				}()  
			 }
		   </div>
		
		{ /* render equipped skill */ }
		
		  <div style={{"position":"absolute", "top":c.equipped_skills_top_left[1],"left":c.equipped_skills_top_left[0], "width":c.skill_name_width*(5.2), "height":c.skill_name_height * (2.2), }}>
		{// render boxes.
				function(){
					var components = [];
					var skill_labels = ["A","S","D","F","G","Z","X","C","V","B"];
					for(var i=0; i<10; i++){
							var skill = equip[i]

							components.push(<div style={{"position":"absolute", "top":c.skill_name_height *Math.floor(i/5),"left":c.skill_name_width * (i%5), "width":c.skill_name_width,"height":c.skill_name_height,"background-color" : selected_equip == i? "cyan" : "white"}}
							
							onClick = {function(){window.view.move_equipped_skill(this);window.controller.rerender()}.bind(skill_labels[i])}
							
							>
								{skill_labels[i]} : {skill == undefined?  "" :skill.name};
							</div>);
					}		
					return components;
				}()  
			}
		   </div>
		   
		   { /*render details */}
		<h1 style={{"position":"absolute", "top":c.skill_desc_top_left[1]-60,"left":c.skill_desc_top_left[0]}}>Selected: </h1>
		
		{ skills[selected_skill] ==undefined ? undefined :   <div style={{"position":"absolute", "top":c.skill_desc_top_left[1],"left":c.skill_desc_top_left[0]}}>{skills[selected_skill].name}<DC_skill_desc skill={skills[selected_skill]}> </DC_skill_desc> </div> }
		
		<h1 style={{"position":"absolute", "top":c.skill_desc_top_left[1]-60,"left":c.skill_desc_top_left[0]+250}}>Currently equipped: </h1>
		
		{ equip[selected_equip] ==undefined ? undefined :   <div style={{"position":"absolute", "top":c.skill_desc_top_left[1],"left":c.skill_desc_top_left[0]+300}}><DC_skill_desc skill={equip[selected_equip]}> </DC_skill_desc> </div>}
		
		
			{ /*buttons for equipping and going back */}
		<button style={{"position":"absolute", "top":c.skills_equip_top_left[1],"left":c.skills_equip_top_left[0], "width":c.skills_equip_width, "height":c.skills_equip_height,"background-color":"lightgreen"}} onClick={function(){window.game.equip_skill(window.view.selected_skill, window.view.selected_equip_skill); window.controller.rerender();}}> <h2 style={{"text-align":"center"}} > Equip skill</h2></button>
		
		<button style={{"position":"absolute", "top":c.skills_back_top_left[1],"left":c.skills_back_top_left[0], "width":c.skills_back_width, "height":c.skills_back_height,"background-color":"lightblue"}} onClick={function(){window.view.leave_skills(); window.controller.rerender();}}> <h2 style={{"text-align":"center"}} > Go back</h2></button>
		
		
		
		</div>
	    );
	}
}

export default D_Skills;
