/*
quests work like this:
there are "phases" in a quest:
a quest can be in four "states":

not received, received and not completed, received and completed but didn't go to collect reward yet, received and collected reward.

gonna call them state 1,2,3,4

quest_mechanics.tsx has methods called every time a player enters a dungeon, leaves a dungeon, picks up items, or finishes fighting
and updates the quests.
*/


export class quest{
	//"type" is to indicate what type (kill, collect, etc.). "data" indicates more information ,and needs to be initialized with "progress";
	name : string;
	 description : string;
	 type : string;
	 data : any
	state : number
    constructor(name : string, description : string, type : string, data : any){
        this.name = name;
		this.description = description
		this.type = type;
		this.data = data;
		this.state = 1;
	}
}

 // kill X enemies with a certain name
export class kill_quest extends quest {
	constructor(name : string, monster : string , count : number){
		super(name, "Kill " + count +  " " + monster,  "kill", {"monster":monster, "count":count, "current":0});
	}
}

