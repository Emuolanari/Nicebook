var BookModule = (function () {
    'use strict';
    //internal functions go here
    function forEach(array, action) {
        //loops through an array
        var i = 0;
		for (i = 0; i < array.length; i += 1) {
			action(array[i]);
		}
	}
    return {
        //external functions go here
        newReview : function (rating, review) {
            return true;
        }
    };
}());