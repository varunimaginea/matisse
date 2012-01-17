/** matisse.util **/
matisse.util = {

 /* Throws Error if the value is null. */
 assertNotNull:function (value, str) {
        if (value == null || (value.palette) == null || (value.name) == null) {
            throw new Error(str);
            canvas.activeObject = null;
            return false;
        }
        return true;
    },


	/**
     * Validation method for input field, checks for the user keypress and allows only numbers
     * @method numbersonly
	 * @param myfield, e, dec
     */
  numbersonly : function(myfield, e, dec) {
        var key;
        var keychar;

        if (window.event) key = window.event.keyCode;
        else if (e) key = e.which;
        else return true;
        keychar = String.fromCharCode(key);

        // control keys
        if ((key == null) || (key == 0) || (key == 8) || (key == 9) || (key == 13) || (key == 27)) return true;

        // numbers
        else if ((("0123456789").indexOf(keychar) > -1)) return true;

        // decimal point jump
        else if (dec && (keychar == ".")) {
            myfield.form.elements[dec].focus();
            return false;
        } else return false;
    },

	/**
     * Validation method for input field, checks for the user keypress and allows only letters
     * @method letternumber
	 * @param e
     */
    letternumber : function(e) {
        var key;
        var keychar;

        if (window.event) key = window.event.keyCode;
        else if (e) key = e.which;
        else return true;
        keychar = String.fromCharCode(key);
        keychar = keychar.toLowerCase();

        // control keys
        if ((key == null) || (key == 0) || (key == 8) || (key == 9) || (key == 13) || (key == 27)) return true;

        // alphas and numbers
        else if ((("abcdefghijklmnopqrstuvwxyz0123456789").indexOf(keychar) > -1)) return true;
        else return false;
    },


	/**
     * Calculate width of the given text string and return it
     * @method getStringWidth 
	 * @str
     */
   getStringWidth : function(str)
    {
        var font = '20px delicious_500',
            obj = $('<div id=div1>' + str + '</div>')
                .css({'position': 'absolute', 'float': 'left', 'white-space': 'pre-wrap', 'visibility': 'hidden', 'font': font})
                .appendTo($('body')),
            w = document.getElementById('div1').clientWidth;
        obj.remove();
        return w;
    },

	
	/**
     * Calculate height of the given text string and return it
     * @method getStringHeight 
	 * @param str
     */	
   getStringHeight : function(str)
    {
        var font = '20px delicious_500',
            obj = $('<div id=div1>' + str + '</div>')
                .css({'position': 'absolute', 'float': 'left', 'white-space': 'pre-wrap', 'visibility': 'hidden', 'font': font})
                .appendTo($('body')),
            h = document.getElementById('div1').clientHeight;
        obj.remove();
        return h;
    },
	
	/**
     * Returns unique id to attach to an object
	 * @method uniqid
     * @param null
     */

    uniqid: function() {
        var newDate = new Date;
        return this.randomString()+newDate.getTime();
    },
	
	/**
     * Returns Random String 
	 * @method randomString
     * @param null
     */
    randomString: function() {
        var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
        var string_length = 8;
        var randomstring = '';
        for (var i=0; i<string_length; i++) {
            var rnum = Math.floor(Math.random() * chars.length);
            randomstring += chars.substring(rnum,rnum+1);
        }
        return randomstring;
    },
	
	/**
     * Calculate the offset value for the canvas and return it
     * @method getOffset 
	 * @param el 
     */
    getOffset: function(el) {
        var _x = 0;
        var _y = 0;
        while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
            _x += el.offsetLeft - el.scrollLeft;
            _y += el.offsetTop - el.scrollTop;
            el = el.offsetParent;
        }
        return {
            top: _y,
            left: _x
        };
    }
	



}