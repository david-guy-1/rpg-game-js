/*
What should a "town" class contain?

- name (might be used to choose which image to display, where buttons go, etc, however, that's part of the display and we don't have it here)

- list of shops (skip for now, add later)

- list of quest takers (again, skip)

- a list of dungeons to go to

- a button to leave the town (and go to overworld?)

- not sure if "town" or "overworld"  should be root. 
*/

class town{
    constructor(name,dungeons,shops,quest_takers){
        this.name = name;
        this.dungeons = dungeons;
        this.shops = shops;
        this.quest_takers = quest_takers;
	}
    clone(){
        return new town(this.name,this.dungeons,this.shops,this.quest_takers);
    }
}

export default town;