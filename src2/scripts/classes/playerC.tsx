class playerC{ // these are base stats, before items change them. 
    constructor(attack,defense,hp,mana, items=[], skills =[]){
        this.attack = attack;
        this.defense = defense;
        this.hp = hp;
        this.mana = mana;
		this.items = items; // these are item instances, NOT just the names.
		this.skills = skills; //these are skill instances, NOT just the names
	}
}



export default playerC;
