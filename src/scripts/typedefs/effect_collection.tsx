import effect from "../classes/effect"
export interface effect_collection  {
	"name":string;
	"attack":effect[]; 
	"defense": effect[];
 "poison": effect[];
 "speed": effect[];
"mana": effect[];
"other": effect[]
}


export default effect_collection;
