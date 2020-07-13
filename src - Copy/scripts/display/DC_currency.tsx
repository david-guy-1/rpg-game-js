import React from 'react';
import item_class from "../classes/item.tsx";
import * as U from "../utilities.tsx";
import * as T from "../tables.tsx";
class DC_currency extends React.Component {
	constructor(props){
		super(props);
		this.props = props; // props is a currency object
	}
	render(){
		var currency = this.props.currency;
		return <ul>
			{function(){
				
				var list = [];
				Object.keys(currency).forEach(function(type){
					list.push(<li>{type} : {currency[type]}</li>)
				});
				return list;
			}()
			}
		</ul>  
	}
}

export default DC_currency;
 