module.exports = {
	// search id and remove that item from the list
	// returns the new list
	remove: function(id, list) {
		return list.filter((value) => {
			if (value.get('Id') !== id) {
				return true;
			}
		});
	},

	// search id from the list and return that item
	searchId: function(id, list) {
		for(let i = 0, l = list.size; i < l; i++) {
			if (list.get(i).get('Id') === id) {
				return list.get(i);
			}
		}

		return false;
	},

	// search id from the list and return the index
	getIndex: function(id, list) {
		for(let i = 0, l = list.size; i < l; i++) {
			if (list.get(i).get('Id') === id) {
				return i;
			}
		}

		return -1;
	},

	// convert a List into options label,value
	toOptions: function(list) {
		let options = [];
		for(let i = 0, l = list.size; i < l; i++) {
			options.push({
				label: list.get(i).get('Name'),
				value: list.get(i).get('Id')
			});
		}
		return options;
	},

	// check if all the values of the array is null
	// returns true if all null
	areAllNull: function(arr) {
		let result = true;
		for(let i = 0, l = arr.length; i < l; i++) {
			if (arr[i]) {
				result = false;
				break;
			}
		}

		return result;
	}
};