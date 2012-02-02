(function () {

module('Core');

// helper
function el(id) {
	return document.getElementById(id);
};


test('Required objects and globals', function () {
	expect(5);
	ok(DOMReady, 'DOMReady');
	ok($$, '$$ - SimpleSelector');
	ok(jLim, 'jLim');
	ok(jLim.fn, 'jLim.fn');
	deepEqual($, jLim);
});

/**
 * Static methods
 */

test('$.extend()', function () {
	// object
	var obj = {id: 10, name: 'obj1', child: {id: 11, name: 'childObj', child: false}};

	deepEqual($.extend(obj, {}), obj);
	deepEqual($.extend({}, obj), obj);
	deepEqual($.extend({}, {}, obj), obj);
	deepEqual($.extend({}, {}, {}, obj, {}, {}), obj);

	deepEqual($.extend(obj, {extra: true}), $.extend({extra: true}, obj));
	deepEqual($.extend(obj, {extra: true}), {id: 10, name: 'obj1', child:{id: 11, name: 'childObj', child: false}, extra: true});

	// reference
	var extObj = $.extend(obj, {}),
		extEmptyObj = $.extend({}, obj);

	obj.id = 33;
	obj.child.id = 44;

	strictEqual(extObj.id, 33);
	strictEqual(extObj.child.id, 44);
	strictEqual(extEmptyObj.id, 10);
	strictEqual(extEmptyObj.child.id, 44);

	// deep extend object
	var deepObj = $.extend(true, obj, {}),
		deepEmptyObj = $.extend(true, {}, obj);

	obj.child.id = 55;

	strictEqual(deepObj.child.id, 55);
	strictEqual(deepEmptyObj.child.id, 44);

	// array
	var arr = ['test', 123, true, 'more', [12, 'sub']];
	deepEqual($.extend( [], arr ), arr);
	deepEqual($.extend( arr, [] ), arr);
	deepEqual($.extend( [], [], arr, [], []), arr);

	// reference
	var extArr = $.extend(arr, []),
		extEmptyArr = $.extend([], arr);

	arr[2] = false;
	arr[4][0] = 66;
	strictEqual(extArr[2], false);
	strictEqual(extArr[4][0], 66);
	strictEqual(extEmptyArr[2], true);
	strictEqual(extEmptyArr[4][0], 66);

	// deep extend array
	var deepArr = $.extend(true, arr, []),
		deepEmptyArr = $.extend(true, [], arr);

	arr[4][0] = 77;

	strictEqual(deepArr[4][0], 77);
	strictEqual(deepEmptyArr[4][0], 66);
});

test('$.selector()', function () {
	var $els = $.selector('#qunit-header', 'body'),
		$$els = $$('#qunit-header', 'body');

	expect(1);
	deepEqual($els, $$els);
});

test('$.ready()', function () {
	var readyDone = false,
		arg1;

	$.ready(function (p1) {
		arg1 = p1;
		readyDone = true;
	});

	expect(2);
	ok(readyDone, 'readyDone');
	strictEqual(arg1, jLim);
});

test('$.create()', function () {
	var html = '<ul><li>example 1</li><li>example 2</li></ul>',
		el = $.create(html);

	expect(1);
	strictEqual(el.innerHTML, '<li>example 1</li><li>example 2</li>');
});

test('$.each()', function () {
	// with array
	var arr = ['one', 'two', 'three', 'four'],
		count = 0;

	$.each(arr, function (key, item) {
		equal(key, count++);
		equal(this, item);
	});

	equal(count, 4);

	// with object
	var obj = {id: 'unique', name: 'TestObject', child: {id: 'uniqueChild', name: 'littleTestObject'}},
		keys = [],
		items = [];

	$.each(obj, function (key, item) {
		keys[keys.length] = key;
		items[items.length] = item;
		equal(this, item);
	});

	equal(keys.length, 3);
	equal(items.length, 3);
	deepEqual(keys, ['id', 'name', 'child']);
	deepEqual(items, ['unique', 'TestObject', {id: 'uniqueChild', name: 'littleTestObject'}]);

	// stop on return false
	items = [];
	$.each(arr, function (key, item) {
		items[items.length] = item;

		if (item == 'two')
			return false;
	});

	equal(items.length, 2);
	deepEqual(items, ['one', 'two']);
});

test('$.trim()', function () {
	var s = 'this is a test';
	expect(6);
	strictEqual($.trim(s), s);
	strictEqual($.trim(' '+ s), s);
	strictEqual($.trim(s +'  '), s);
	strictEqual($.trim('   '+ s +'  '), s);
	strictEqual($.trim('\n'+ s + '\n'), s);
	strictEqual($.trim('\n\t  '+ s + '\t   \n'), s);
});

test('$.itemExists()', function () {
	var $sel = $('#wrap'),
		div = el('wrap'),
		a = ['test', 99, $sel, true, div];

	ok($.itemExists(a, 'test'));
	ok($.itemExists(a, 99));
	ok($.itemExists(a, $sel));
	ok($.itemExists(a, true));
	ok($.itemExists(a, div));
	ok($.itemExists(a, el('wrap')));

	ok(!$.itemExists(a, 'notok'));
	ok(!$.itemExists(a, 12));
	ok(!$.itemExists(a, $('#wrap')));
	ok(!$.itemExists(a, false));
	ok(!$.itemExists(a, null));
	ok(!$.itemExists(a, undefined));
});

test('$.clearDuplicates()', function () {
	var $sel = $('#wrap'),
		div = el('wrap'),
		arr = [$sel, 'test', div, 99, $sel, true, 12, 'test', 99, 12, 'test', el('wrap')],
		clearArr = $.clearDuplicates(arr);

	strictEqual(clearArr.length, 6);
	deepEqual(clearArr, [$sel, 'test', el('wrap'), 99, true, 12]);
});

test('$.isArray()', function () {
	expect(10);
	ok($.isArray([]));
	ok($.isArray([ 1, 2, 3]));

	ok(!$.isArray('test'));
	ok(!$.isArray(123));
	ok(!$.isArray(null));
	ok(!$.isArray(undefined));
	ok(!$.isArray({}));
	ok(!$.isArray(jLim));
	ok(!$.isArray());
	ok(!$.isArray(function () {}));
});

test('$.isFunction()', function () {
	expect(10);
	ok($.isFunction(new Function()));
	ok($.isFunction(function () {
		alert('test isArray');
	}));
	ok($.isFunction(jLim));

	ok(!$.isFunction('test'));
	ok(!$.isFunction(123));
	ok(!$.isFunction(null));
	ok(!$.isFunction(undefined));
	ok(!$.isFunction({}));
	ok(!$.isFunction());
	ok(!$.isFunction([]));
});

/**
 * jLim functions
 */

test('jLim()', function () {
	expect(28);

	// empty
	strictEqual($().els.length, 0);

	// body
	var $body = $('body'),
		$noBody1 = $('body', 'html'),
		$noBody2 = $('body', '#wrap');

	strictEqual($body.els.length, 1);
	strictEqual($body.els[0], document.body);
	strictEqual($noBody1.els.length, 1);
	strictEqual($noBody2.els.length, 0);

	// create
	var $create = $('  <ul> ');

	strictEqual($create.els.length, 1);
	strictEqual($create.els[0].tagName.toUpperCase(), 'UL');

	// selector
	var $sel = $('.special', '#wrap');

	strictEqual($sel.els.length, 2);
	strictEqual($sel.els[0].tagName.toUpperCase(), 'P');
	strictEqual($sel.els[1].tagName.toUpperCase(), 'OL');

	// ready
	var readyDone = false,
		arg1;

	$(function (p1) {
		arg1 = p1;
		readyDone = true;
	});

	ok(readyDone, 'readyDone');
	strictEqual(arg1, jLim);

	// jLim
	var $jlim = $($body);

	strictEqual($jlim.els.length, 1);
	strictEqual($jlim.els[0], document.body);

	// else ...
	var $wrap = $(el('wrap')),
		$special = $([el('controlClass1'), el('controlClass2')]);

	strictEqual($wrap.els.length, 1);
	strictEqual($wrap.els[0], el('wrap'));
	strictEqual($special.els.length, 2);
	strictEqual($special.els[0], el('controlClass1'));
	strictEqual($special.els[1], el('controlClass2'));

	strictEqual($([]).els.length, 0);
	strictEqual($(undefined).els.length, 0);
	strictEqual($(null).els.length, 0);
	strictEqual($(true).els.length, 1);
	strictEqual($(true).els[0], true);
	strictEqual($(123).els.length, 1);
	strictEqual($(123).els[0], 123);
	strictEqual($({}).els.length, 1);
	deepEqual($({}).els[0], {});
});

test('[..]', function () {
	var $sel = $('.special li');

	expect(5);
	strictEqual($sel.els.length, 4);
	strictEqual($sel[0], $sel.els[0]);
	strictEqual($sel[1], $sel.els[1]);
	strictEqual($sel[2], $sel.els[2]);
	strictEqual($sel[3], $sel.els[3]);
});

test('.length', function () {
	var $sel = $('#wrap li');

	expect(2);
	strictEqual($sel.length, 8);
	strictEqual($sel.length, $sel.els.length);
});

test('.size()', function () {
	var $sel = $('#wrap button');

	expect(2);
	strictEqual($sel.size(), 5);
	strictEqual($sel.size(), $sel.els.length);
});

test('.get()', function () {
	var $sel = $('li, button', '.special');

	expect(22);
	strictEqual($sel.els.length, 9);
	strictEqual($sel.get(), $sel.els);
	strictEqual($sel.get(0), $sel.els[0]);
	strictEqual($sel.get(1), $sel.els[1]);
	strictEqual($sel.get(2), $sel.els[2]);
	strictEqual($sel.get(3), $sel.els[3]);
	strictEqual($sel.get(4), $sel.els[4]);
	strictEqual($sel.get(5), $sel.els[5]);
	strictEqual($sel.get(6), $sel.els[6]);
	strictEqual($sel.get(7), $sel.els[7]);
	strictEqual($sel.get(8), $sel.els[8]);

	strictEqual($sel.get(9), null);

	strictEqual($sel.get(-1), $sel.els[8]);
	strictEqual($sel.get(-2), $sel.els[7]);
	strictEqual($sel.get(-3), $sel.els[6]);
	strictEqual($sel.get(-4), $sel.els[5]);
	strictEqual($sel.get(-5), $sel.els[4]);
	strictEqual($sel.get(-6), $sel.els[3]);
	strictEqual($sel.get(-7), $sel.els[2]);
	strictEqual($sel.get(-8), $sel.els[1]);
	strictEqual($sel.get(-9), $sel.els[0]);

	strictEqual($sel.get(-10), null);
});

test('.each()', function () {
	var $sel = $('#wrap button'),
		count = 0;

	expect(10);

	$sel.each(function (index, element) {
		equal(index, count++);
		strictEqual(element, $sel.els[index]);
	});
});

test('.chain()', function () {
	var $sel = $('#wrap'),
		$chain = $sel.chain('#controlClass1'),
		$chainMore = $chain.chain('#controlClass2');

	expect(10);
	strictEqual($sel.els.length, 1);
	strictEqual($sel.prevjLim, undefined);

	strictEqual($chain.els.length, 1);
	strictEqual($chain.els[0], el('controlClass1'));
	deepEqual($chain.prevjLim, $sel);

	strictEqual($chainMore.els.length, 1);
	strictEqual($chainMore.els[0], el('controlClass2'));
	deepEqual($chainMore.prevjLim, $chain);
	deepEqual($chainMore.prevjLim.prevjLim, $sel);

	// alias (deprecated)
	strictEqual($().chain, $().$);
});

test('.find()', function () {
	var $sel = $('#wrap'),
		$find = $sel.find('p'),
		$check = $('p', '#wrap');

	expect(3);
	strictEqual($find.els.length, 2);
	deepEqual($find.els, $check.els);
	deepEqual($find.prevjLim, $sel);
});

test('.add()', function () {
	var $sel = $('#wrap p'),
		$add = $sel.add('#controlClass1, #controlClass2'),
		$check = $('#wrap p, #controlClass1, #controlClass2');

	expect(16);

	strictEqual($add.els.length, 3);
	deepEqual($add.els, $check.els);
	deepEqual($add.prevjLim, $sel);

	// add with context
	var $context = $sel.add('span', '.special li');

	strictEqual($context.els.length, 3);
	strictEqual($context.els[2].tagName.toUpperCase(), 'SPAN');

	// add html
	var $html = $sel.add('<button>Click</button>');

	strictEqual($html.els.length, 3);
	strictEqual($html.els[0].tagName.toUpperCase(), 'P');
	strictEqual($html.els[1].tagName.toUpperCase(), 'P');
	strictEqual($html.els[2].tagName.toUpperCase(), 'BUTTON');
	deepEqual($html.prevjLim, $sel);

	// add element
	var $el = $sel.add(el('btn-test1'));

	strictEqual($el.els.length, 3);
	strictEqual($el.els[2], el('btn-test1'));
	deepEqual($el.prevjLim, $sel);

	// add jLim
	var $jlim = $sel.add($('button'));

	strictEqual($jlim.els.length, 7);
	strictEqual($jlim.els[2], el('btn-test1'));
	deepEqual($jlim.prevjLim, $sel);
});

test('.eq()', function () {
	var $sel = $('li, button', '.special');

	expect(40);
	strictEqual($sel.els.length, 9);
	deepEqual($sel.eq().els, $sel.els);
	strictEqual($sel.eq(0).els.length, 1);
	strictEqual($sel.eq(0).els[0], $sel.els[0]);
	strictEqual($sel.eq(1).els.length, 1);
	strictEqual($sel.eq(1).els[0], $sel.els[1]);
	strictEqual($sel.eq(2).els.length, 1);
	strictEqual($sel.eq(2).els[0], $sel.els[2]);
	strictEqual($sel.eq(3).els.length, 1);
	strictEqual($sel.eq(3).els[0], $sel.els[3]);
	strictEqual($sel.eq(4).els.length, 1);
	strictEqual($sel.eq(4).els[0], $sel.els[4]);
	strictEqual($sel.eq(5).els.length, 1);
	strictEqual($sel.eq(5).els[0], $sel.els[5]);
	strictEqual($sel.eq(6).els.length, 1);
	strictEqual($sel.eq(6).els[0], $sel.els[6]);
	strictEqual($sel.eq(7).els.length, 1);
	strictEqual($sel.eq(7).els[0], $sel.els[7]);
	strictEqual($sel.eq(8).els.length, 1);
	strictEqual($sel.eq(8).els[0], $sel.els[8]);

	strictEqual($sel.eq(9).els.length, 0);

	strictEqual($sel.eq(-1).els.length, 1);
	strictEqual($sel.eq(-1).els[0], $sel.els[8]);
	strictEqual($sel.eq(-2).els.length, 1);
	strictEqual($sel.eq(-2).els[0], $sel.els[7]);
	strictEqual($sel.eq(-3).els.length, 1);
	strictEqual($sel.eq(-3).els[0], $sel.els[6]);
	strictEqual($sel.eq(-4).els.length, 1);
	strictEqual($sel.eq(-4).els[0], $sel.els[5]);
	strictEqual($sel.eq(-5).els.length, 1);
	strictEqual($sel.eq(-5).els[0], $sel.els[4]);
	strictEqual($sel.eq(-6).els.length, 1);
	strictEqual($sel.eq(-6).els[0], $sel.els[3]);
	strictEqual($sel.eq(-7).els.length, 1);
	strictEqual($sel.eq(-7).els[0], $sel.els[2]);
	strictEqual($sel.eq(-8).els.length, 1);
	strictEqual($sel.eq(-8).els[0], $sel.els[1]);
	strictEqual($sel.eq(-9).els.length, 1);
	strictEqual($sel.eq(-9).els[0], $sel.els[0]);

	strictEqual($sel.eq(-10).els.length, 0);
});

test('.slice()', function () {
	var $sel = $('#controlClass1 button'),
		$slice1 = $sel.slice(3),
		$slice2 = $sel.slice(1, 3),
		$slice3 = $sel.slice(-2, -1);

	expect(9);
	strictEqual($sel.els.length, 5);

	strictEqual($slice1.els.length, 2);
	strictEqual($slice1.els[0], el('btn-test4'));
	strictEqual($slice1.els[1], el('btn-test5'));

	strictEqual($slice2.els.length, 2);
	strictEqual($slice2.els[0], el('btn-test2'));
	strictEqual($slice2.els[1], el('btn-test3'));

	strictEqual($slice3.els.length, 1);
	strictEqual($slice3.els[0], el('btn-test4'));
});

test('.end()', function () {
	var $sel = $('#wrap'),
		$chain = $sel.chain('#controlClass1'),
		$chainMore = $chain.chain('#controlClass2');

	expect(4);
	deepEqual($sel.end(), $(null));
	deepEqual($chain.end(), $sel);
	deepEqual($chainMore.end(), $chain);
	deepEqual($chainMore.end().end(), $sel);
});

})();