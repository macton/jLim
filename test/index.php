<?php
$testMinified = isset($_GET['minified']);
$testPackage = isset($_GET['package']);
$timestamp = time();
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en" dir="ltr" id="html">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>jLim Test Suite</title>
	<link rel="stylesheet" type="text/css" media="screen" href="qunit/qunit/qunit.css" />
	<script type="text/javascript" src="qunit/qunit/qunit.js"></script>

	<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>

<?php if ($testPackage): ?>
	<script type="text/javascript" src="../src/package/jlim.min.js"></script>
<?php else: ?>
	<script type="text/javascript" src="../src/external/domready/src/domready.min.js"></script>
	<script type="text/javascript" src="../src/external/simpleselector/src/simpleselector.min.js"></script>

	<script type="text/javascript" src="../src/<?php echo ( $testMinified ) ? 'minified/jlim-core.min.js' : 'jlim-core.js' ?>?nocache=<?php echo $timestamp ?>"></script>
	<script type="text/javascript" src="../src/<?php echo ( $testMinified ) ? 'minified/jlim-css.min.js' : 'jlim-css.js' ?>?nocache=<?php echo $timestamp ?>"></script>
<?php endif; ?>

	<script type="text/javascript" src="unit/jlim-core.js?nocache=<?php echo $timestamp ?>"></script>
	<script type="text/javascript" src="unit/jlim-css.js?nocache=<?php echo $timestamp ?>"></script>
</head>
<body id="body">
	<h1 id="qunit-header">
		<a href="/jquery/test/index.php">jLim Test Suite</a>
		<label>
			<input type="checkbox" name="minified" <?php echo ($testMinified) ? 'checked="checked"' : '' ?> />
			test Minified version
		</label>
		<label>
			<input type="checkbox" name="package" <?php echo ($testPackage) ? 'checked="checked"' : '' ?> />
			test Package version
		</label>
	</h1>
	<h2 id="qunit-banner"></h2>
	<div id="qunit-testrunner-toolbar"></div>
	<h2 id="qunit-userAgent"></h2>
	<ol id="qunit-tests"></ol>

	<div id="wrap" style="display:none">
		<h1>Lorem ipsum</h1>
		<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin egestas commodo urna, sit amet cursus metus porta in. Curabitur et nunc orci, vitae tincidunt ipsum.
		</p>
		<ul>
			<li>Lorem ipsum 1</li>
			<li>Lorem ipsum 2</li>
			<li><span>Lorem ipsum 3</span></li>
			<li>Lorem ipsum 4</li>
		</ul>
		<p class="special" id="controlClass1">
			<button id="btn-test1"><span>button 1</span></button>
			<button id="btn-test2"><span>button 2</span></button>
			<button id="btn-test3"><span>button 3</span></button>
			<button id="btn-test4">button 4</button>
			<button id="btn-test5"><span>button 5</span></button>
		</p>
		<ol class="special" id="controlClass2">
			<li>Lorem ipsum 5</li>
			<li>Lorem ipsum 6</li>
			<li><span>Lorem ipsum 7</span></li>
			<li>Lorem ipsum 8</li>
		</ol>
	</div>
</body>
</html>