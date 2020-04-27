
function give_item(item){ // if inventory is full, returns failure.
	for(var i=0;i<inventory.length;i++){
		if(inventory[i] == null){
			inventory[i] =item.clone();
			return "success";
		}
	}
	return "failure";
}

function equip_item(equipped_id, inventory_id){ // these are integers between 0 and limit
    if(equipped_id < 0 || equipped_id >= equipped_limit){
		alert("error equipping item");
	}
	if(inventory_id < 0 || inventory_id >= inventory_limit){
		alert("error equipping item (inv)");
	}
	var equip_success = true;
	//check if equipping is possible.
	if(equip_success){
		var temp = items[equipped_id]
		items[equipped_id] = inventory[inventory_id];
		inventory[inventory_id] = temp;
	}
}