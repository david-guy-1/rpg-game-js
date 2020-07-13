import item from "./item";
import player_skill from "./player_skill";	

class playerC{ // these are base stats, before items change them. 
	attack : number;
	defense: number;
	hp: number;
	mana: number; 
	items : (item | undefined)[]; 
	skills: (player_skill | undefined) [];
    constructor(attack : number,defense: number,hp: number,mana: number, items : (item | undefined)[] = [], skills  : (player_skill | undefined)[] = []){
        this.attack = attack;
        this.defense = defense;
        this.hp = hp;
        this.mana = mana;
		this.items = items; // these are item instances, NOT just the names.
		this.skills = skills; //these are skill instances, NOT just the names
	}
}



export default playerC;
