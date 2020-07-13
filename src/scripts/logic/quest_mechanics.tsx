//quest_mechanics.tsx has methods called every time a player enters a dungeon, leaves a dungeon, picks up items, or finishes fighting

// first called thing is always a list of quests

// "items" is a list of 
export function items_obtained(quests, items){
	
}
// "dungeon" is a dungeon class object (not the I_Dungeon instance)
export function dungeon_entered(quests, dungeon){
	
}

// "dungeon_instance is the I_Dungeon instance, not the dungeon class"
export function dungeon_finished(quests, dungeon_instance){
	
}
// monsters is a list of monsters
export function fight_ended(quests, monsters){
	quests.forEach(function(quest){ // for each quest:
		if(quest.type == "kill") { // "kill X of a certain monster" quest
			monsters.forEach(function(monster){ // for each monster:
				if(monster.name == quest.data.monster){
					quest.data.current ++; 
					if(quest.data.current >= quest.data.count && quest.state == 2){
						quest.state = 3;
					}
				}
			})
		}
		
		
		
	})	
}
