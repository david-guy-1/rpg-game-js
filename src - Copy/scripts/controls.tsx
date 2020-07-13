
var previous_state = "";
var key_processing = false;

function key_pressed(e){ 
	var game_state = game_stack[game_stack.length-1]
	if(game_state == undefined){
		throw "game stack is empty";
	}
	if(key_processing == true){
		console.log("still processing interface.....");
		return;
	}else{
		key_processing = true;
		console.log(e.key);
	}
	if("asdfgzxcvb".indexOf(e.key) != -1 && game_state == "fighting"){ // changing attack style
		currently_queued_attack = "asdfgzxcvb".indexOf(e.key);
	}
	else if("12345".indexOf(e.key) != -1 && game_state == "fighting"){ // changing target
		currently_attacking_monster = "12345".indexOf(e.key);
	}
	else if(game_state == "fight end"){
		if(e.key == "a" && selected_drop_item != 0){
			selected_drop_item-=1;
		}		
		if(e.key == "s" && selected_drop_item+1 < items_dropped.length){
			selected_drop_item+=1;
		}		
		if(e.key == " "){
			if(count(chosen_items, 1) > count(inventory, null)){
				set_data("information", "You have chosen to take too many items for your inventory to hold");
			} else{
				for(var i=0;i<items_dropped.length;i++){
					if(chosen_items[i] == 1){
						give_item(items_dropped[i])
					}
				}
				game_stack.pop();
			}
		}
		if(e.key == "q"){
			chosen_items[selected_drop_item] = 1 - chosen_items[selected_drop_item];
			console.log(chosen_items[selected_drop_item]);
		}
	}
	else if("wasd".indexOf(e.key) != -1    && game_state == "walking"){
		move_player(["up", "left", "down", "right"]["wasd".indexOf(e.key)]);
	}
	else if(e.key == "i" && game_state != "fighting" && game_state != "inventory"){ //checking if we can switch to inventory in the interface might not be a good idea
		game_stack.push("inventory")
	}
	else if(e.key == "i" && game_state == "inventory"){
		game_stack.pop();
	}
	else if(e.key == "z" && game_state != "fighting" && game_state != "skills"){ //checking if we can switch to inventory in the interface might not be a good idea
		game_stack.push("skills")
	}
	else if(e.key == "z" && game_state == "skills"){
		game_stack.pop();
	}
	
	else if(game_state == "inventory"){
		if("wasd".indexOf(e.key) != -1){ // move selected item
			var old_chosen_item = chosen_item;
			switch(e.key){
				case "w":
					chosen_item -= 6;
					break;
				case "s":
					chosen_item +=6;
					break;
				case "a":
					chosen_item -=1;
					break;
				case "d":
					chosen_item +=1;
					break;
				
				default:
					alert("well, this should never happen. (moving selected inventory item)");
				}
			//moving off the grid
			if(chosen_item <0 || chosen_item >= 36){
				chosen_item = old_chosen_item;
			}
			
		}
		else if("ol".indexOf(e.key) != -1){ // move selected equipped
			if(e.key == "o" && chosen_equipped != 0){
				chosen_equipped -=1;
			}
			else if(e.key == "l" && chosen_equipped != 5){
				chosen_equipped +=1;
			}
		}
		else if(e.key == "t"){
			equip_item(chosen_equipped, chosen_item);
		}
	}
	else if(game_state == "skills"){
		if("asdfgzxcvb".indexOf(e.key) != -1 && game_state == "skills"){ // changing chosen skill
			chosen_skill = " asdfgzxcvb".indexOf(e.key);
		}
		if(e.key == "r" ){ // equip skill
			var skills = Object.keys(player_skill_levels);
			skills.push("")
			if(skills[chosen_skill_left] == ""){
				var result = equip_skill(chosen_skill-1, null);
			} else{
				var result = equip_skill(chosen_skill-1, skills[chosen_skill_left])
			}
			set_data("outcome", result);
		}
		if(e.key == "q" ){ // equip skill
			var skills = Object.keys(player_skill_levels);
			skills.push("")
			chosen_skill_left -=1;
			if(chosen_skill_left <0){
				chosen_skill_left+= skills.length;
			}
		}
		if(e.key == "w" ){ // equip skill
			var skills = Object.keys(player_skill_levels);
			skills.push("")
			chosen_skill_left +=1;
			if(chosen_skill_left >= skills.length){
				chosen_skill_left-= skills.length;
			}
		}
	}
	else if(game_state == "overworld"){
		if("wasd".indexOf(e.key) != -1){
			move_player_overworld(["up","down","left","right"]["wsad".indexOf(e.key)]);
		}
	}
	else if(game_state == "town"){
		if(e.key == "1"){
			game_stack.push("overworld");
		} else if (e.key == "2"){
			dungeon_begin(standard_dungeon.clone());
		}
	}
	if(currently_displayed != "fighting"){
		interface_();
	}
	setTimeout("key_processing = false;", 10);
}