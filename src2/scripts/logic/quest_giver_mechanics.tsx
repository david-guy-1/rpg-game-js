
import {quest,kill_quest} from '../classes/quest';


// returns a list of quests to give, might mutate progress
export function decide_quests(name, progress){ 
	if(name == "quester1" && progress.quester1 == undefined){
		progress.quester1 = 0;
		return [new kill_quest("quest 1", "goblin", 3)];
	}
	return [];
}

//returns a boolean on whether or not the quest is completed. might also mutate progress.
export function decide_finished(name, quest,progress){ 
	return true;
}

