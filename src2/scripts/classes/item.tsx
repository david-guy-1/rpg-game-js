class item{
    constructor(name,attack,defense,hp,mana,description, flags = {}){
        this.name = name;
        this.attack = attack;
        this.defense = defense;
        this.hp = hp;
        this.mana = mana;
        this.description = description;
		this.flags = flags;
	}
	has_flag(flag_name){
		return this.flags[flag_name] != undefined
	}
	get_flag(flag_name){
		return this.flags[flag_name];
	}
	
    clone(){
        return new item(this.name,this.attack,this.defense,this.hp,this.mana,this.description);
    }
}

export default item;
