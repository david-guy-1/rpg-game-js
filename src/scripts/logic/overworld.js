

function move_player_overworld(direction){  // direction is "up", "down", "left", "right"
	switch(direction){
		case "left":
			overworld_location[0]-=1;
			break;
		case "right":
			overworld_location[0]+=1;
			break;
		case "up":
			overworld_location[1]-=1;
			break;
		case "down":
			overworld_location[1]+=1;
			break;
		default:
			alert("error" + direction);
			return;
		}
		var item = oo.get_item(overworld_location[0], overworld_location[1]).split(",");
		if(item[1] != "nothing special" && overworld_cleared_list[overworld_location[0] + "," + overworld_location[1]] == undefined){ // something is there
			
			fight_begin([create_monster("test_monster")]);
			
		}
}