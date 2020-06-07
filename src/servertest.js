var books = (function() {
    var list = [];
    
    return {
        add: function(book) {
            if (book) {
                var item = {timestamp: Date.now(), text: book};
                list.push(item);
                return true;
            }
            return false;
        },
	    remove: function(index) {},
	    count: function() {
	        return list.length;
	    },
	    list: function() {},
	    find: function(str) {},
	    clear: function() {
            list.splice(0, list.length);
        }
        }
    }());


