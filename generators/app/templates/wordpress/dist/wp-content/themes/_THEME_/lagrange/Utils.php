<?php

function startsWith($iterable, $prefix) {
	if (is_string($iterable)) {
		return stringStartsWith($iterable, $prefix);
	} else {
		die("Not implemented!");
	}
}

function endsWith($iterable, $suffix) {
	if (is_string($iterable)) {
		return stringEndsWith($iterable, $suffix);
	} else {
		die("Not implemented!");
	}
}

function stringStartsWith($haystack, $needle) {
	$length = strlen($needle);
	if ($length == 0) {
		return true;
	}
	return (substr($haystack, 0, $length) === $needle);
}

function stringEndsWith($haystack, $needle) {
	$length = strlen($needle);
	if ($length == 0) {
		return true;
	}
	return (substr($haystack, -$length) === $needle);
}

function check($var, $exception) {
	if (isset($var)) {
		return $var;
	} else {
		throw $exception;
	}
}

function set($var, $index, $value) {
	if (is_object($var)) {
		$var->$index = $value;
	} elseif (is_array($var)) {
		$var[$index] = $value;
	}
	return $var;
}

function get($var, $index, $default = null) {
	if (is_object($var)) {
		return getKey($var, $index, $default);
	} elseif (is_array($var)) {
		return getOffset($var, $index, $default);
	} else {
		return $default;
	}
}

function getOffset($array, $offset, $default = null) {
	if (isset($array[$offset])) {
		return $array[$offset];
	} else {
		return $default;
	}
}

function getKey($object, $key, $default = null) {
	if (isset($object->$key)) {
		return $object->$key;
	} else {
		return $default;
	}
}

function sorted($iter, $key = null) {
	$sorted = [];
	foreach ($iter as $item) {
		$sorted[] = $item;
	}
	uasort($sorted, function($a, $b) use ($key) {
		if ($key !== null) {
			return get($a, $key) < get($a, $key);
		} else {
			return $a < $b;
		}
	});
	return $sorted;
}

function reversed($iterable) {
	for ($i = sizeof($iterable) - 1; $i >= 0; $i--) {
		yield $iterable[$i];
	}
}

function choice($array) {
	return choices($array, 1);
}

function choices($array, $num) {
	$choices = [];
	foreach (array_rand($array, $num) as $id) {
		$choices[] = $array[$id];
	}
	return $choices;
}

function wrap($wrapper, $str) {
	return $wrapper . $str . $wrapper;
}

function deleteColumn(&$array, $offset) {
	return array_walk($array, function (&$v) use ($offset) {
		array_splice($v, $offset, 1);
	});
}

function camel($str) {
	$str = str_replace('-', '_', $str);
	$camel = ucwords($str, '_');
	return str_replace('_', '', $camel);
}

function kebab($str) {
	return str_replace('_', '-', snake($str));
}

function snake($str) {
	$str = str_replace('-', '_', $str);
	$snake = "";
	$isFirst = true;
	foreach (iter($str) as $char) {
		$lower = lower($char);
		if ($char !== $lower) {
			if (!$isFirst) {
				$snake .= '_';
			}
		}
		$snake .= $lower;
		$isFirst = false;
	}
	return $snake;
}

function lower($str) {
	return strtolower($str);
}

function upper($str) {
	return strtoupper($str);
}

function iter($var) {
	if (is_string($var)) {
		foreach (str_split($var) as $element) {
			yield $element;
		}
	}
}

function len($var) {
	if (is_array($var)) {
		return sizeof($var);
	}
	if (is_string($var)) {
		return strlen($var);
	}
	return 0;
}

function filter($iter, $searched_key, $searched_value) {
	$found = [];
	foreach ($iter as $key => $value) {
		if (get($value, $searched_key) === $searched_value) {
			$found[$key] = $value;
		}
	}
	return $found;
}

function first($iter) {
	if ($iter !== null) {
		foreach ($iter as $value) {
			return $value;
		}
	}
	return null;
}

function last($iter) {
	return first(reversed($iter));
}

function copyOf($object) {
	return unserialize(serialize($object));
}

function keys($array) {
	if (is_object($array)) {
		$array = (array)$array;
	}
	return array_keys($array);
}

function values($array) {
	if (is_object($array)) {
		$array = (array)$array;
	}
	return array_values($array);
}
/**
 * Source: https://stackoverflow.com/questions/3243900/convert-cast-an-stdclass-object-to-another-class
 * @param $instance
 * @param $className
 * @return mixed
 */
function cast($instance, $className) {
	return unserialize(sprintf('O:%d:"%s"%s', strlen($className), $className, strstr(strstr(serialize($instance), '"'), ':')));
}

function classBasename($str) {
	return basename(str_replace('\\', '/', $str));
}
// Note this method returns a boolean and not the array
function recur_ksort(&$array) {
	foreach ($array as &$value) {
		if (is_array($value)) {
			recur_ksort($value);
		}
	}
	return ksort($array);
}

function column($var, $key) {
	$column = [];
	foreach ($var as $subKey => $subVar) {
		$column[$subKey] = get($subVar, $key, null);
	}
	return $column;
}

function sum($iter) {
	$sum = 0;
	foreach ($iter as $element) {
		$sum += $element;
	}
	return $sum;
}

function lessThan($iter, $value, $key = null) {
	foreach ($iter as $elem) {
		if ($key === null ) {
			if ($elem < $value) {
				yield $elem;
			}
		} else {
			if (get($elem, $key) < $value) {
				yield $elem;
			}
		}
	}
}

function greaterThan($iter, $value, $key = null) {
	foreach ($iter as $elem) {
		if ($key === null ) {
			if ($elem > $value) {
				yield $elem;
			}
		} else {
			if (get($elem, $key) > $value) {
				yield $elem;
			}
		}
	}
}

function nullOr($var) {
	return valueOr($var, null);
}

function valueOr($var, $default) {
	return $var === null ? $default : $var;
}

function newId($prefix = "") {
	return strtolower(md5(uniqid($prefix, true)));
}

function flat($array) {
	$flat = [];
	foreach ($array as $key => $subArray) {
		foreach ($subArray as $subValue) {
			$flat[] = $subValue;
		}
	}
	return $flat;
}

function isExpired($timestamp, $delay) {
	if ($timestamp === null) {
		return true;
	} else {
		$timestamp = strtotime($timestamp);
	}
	$timestamp += $delay;
	return $timestamp <= strtotime("now");
}
/**
 * @param string $format
 * @param null $uTimestamp
 * @return false|string
 */
function timestamp($format = 'Y-m-d H:i:s.u T', $uTimestamp = null) {
	if (is_null($uTimestamp)) {
		$uTimestamp = microtime(true);
	}
	$timestamp = floor($uTimestamp);
	$milliseconds = round(($uTimestamp - $timestamp) * 1000000);
	return date(preg_replace('`(?<!\\\\)u`', $milliseconds, $format), $timestamp);
}

function ifNull($var, $default) {
	if ($var === null)
		return $default;
	return $var;
}

function noArgs($function, $params) {
	return function () use ($function, $params) {
		return call_user_func_array($function, $params);
	};
}

function now() {
	return strtotime("now");
}

function merge($lower, $upper) {
	if (is_array($lower)) {
		if (!is_array($upper)) {
			$upper = (array)$upper;
		}
		return array_merge($lower, $upper);
	}
	if (is_object($lower)) {
		$copy = unserialize(serialize($lower));
		foreach ($upper as $key => $value) {
			$copy->$key = $value;
		}
		return $copy;
	}
	return null;
}

function zip($keys, $values) {
	return array_combine($keys, $values);
}

function keyBy($iterable, $key) {
	return array_column($iterable, null, $key);
}