(function ($) {

module('CSS');

/* helper */
function colorRgbToHex(rgb) {
	var hex = function (code) {
			return ('0' + parseInt(code, 10).toString(16)).slice(-2);
		},
		match;

	match = $.trim(rgb).match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

	return match ? '#' + hex(match[1]) + hex(match[2]) + hex(match[3]) : null;
}

test('colorRgbToHex test helper', function () {
	expect(4);

	strictEqual(colorRgbToHex('rgb(25, 156, 0)'), '#199c00');
	strictEqual(colorRgbToHex('   rgb(255, 2, 34)  '), '#ff0222');

	strictEqual(colorRgbToHex('rgb()'), null);
	strictEqual(colorRgbToHex('bla'), null);
});


test('$.toCamelCase()', function () {
	expect(4);

	strictEqual($.toCamelCase('margin-left'), 'marginLeft');
	strictEqual($.toCamelCase('border-top-color'), 'borderTopColor');
	strictEqual($.toCamelCase('color'), 'color');
	strictEqual($.toCamelCase(''), '');
});


test('.addClass()', function () {
	var $el = $('#wrap h1');

	expect(6);

	strictEqual($el.length, 1);
	strictEqual($el[0].className, '');

	$el.addClass('first');
	strictEqual($el[0].className, 'first');

	$el.addClass('second-special');
	strictEqual($el[0].className, 'first second-special');

	// don't add same class twice
	$el.addClass('first');
	strictEqual($el[0].className, 'first second-special');

	// add multiple classes
	$el.addClass('third fourth');
	strictEqual($el[0].className, 'first second-special third fourth');
});

test('.removeClass()', function () {
	var $el = $('#wrap p').eq(0);
	$el[0].className = 'first second-special third fourth';

	expect(5);

	$el.removeClass('first');
	strictEqual($el[0].className, 'second-special third fourth');

	$el.removeClass('third');
	strictEqual($el[0].className, 'second-special fourth');

	$el.removeClass('first');
	strictEqual($el[0].className, 'second-special fourth');

	$el.removeClass('fourth');
	strictEqual($el[0].className, 'second-special');

	$el.removeClass('second-special');
	strictEqual($el[0].className, '');

});

test('.hasClass()', function () {
	var $el = $('#wrap #btn-test1');
	$el[0].className = 'first second-special third fourth';

	expect(10);

	ok($el.hasClass('first'));
	ok($el.hasClass('second-special'));
	ok($el.hasClass('third'));
	ok($el.hasClass('fourth'));

	ok(!$el.hasClass('whatever'));
	ok(!$el.hasClass(''));
	ok(!$el.hasClass(null));

	$el[0].className = '';
	ok(!$el.hasClass('first'));
	ok(!$el.hasClass(''));
	ok(!$el.hasClass(null));
});

test('.css()', function () {
	var $el = $('#wrap #btn-test2'),
		$otherEl = $('#wrap #btn-test3'),
		toHex = function (val) {
			return colorRgbToHex(val) || val;
		};

	expect(11);
	$el.css('margin-left', '10px');
	strictEqual($el.css('margin-left'), '10px');

	$otherEl.css('margin', '5px 2px');
	strictEqual($otherEl.css('margin'), '5px 2px');

	$el.css('border', '1px solid #cccccc');
	strictEqual($el.css('border-left-width'), '1px');
	strictEqual($el.css('border-left-style'), 'solid');
	strictEqual(toHex($el.css('border-left-color')), '#cccccc');

	$otherEl.css('border-left-width', '1px');
	strictEqual($otherEl.css('border-left-width'), '1px');
	$otherEl.css('border-left-style', 'solid');
	strictEqual($otherEl.css('border-left-style'), 'solid');
	$otherEl.css('border-left-color', '#cccccc');
	strictEqual(toHex($otherEl.css('border-left-color')), '#cccccc');

	// set multiple css properties
	$el.css({
		'color': '#333333',
		'padding-right': '25px',
		'background': '#eeeeee'
	});
	strictEqual(toHex($el.css('color')), '#333333');
	strictEqual($el.css('padding-right'), '25px');
	strictEqual(toHex($el.css('background-color')), '#eeeeee');
});

})(jLim);