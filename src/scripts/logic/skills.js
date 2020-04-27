

function equip_skill(id, name){ // what slot to equip to, and the name
	
	if(name == null){
		player_skills[id] = null;
		return "success";
	}
	//does this skill exist?
	if(Object.keys(player_skill_levels).indexOf(name) == -1){
		return "equipping a skill the player did not learn yet"
	}
	else if(player_skills.indexOf(name) != -1){
		return "already have this skill"
	}
	else{
		player_skills[id] = name;
		return "success";
	}
}