<?php

/**
 * startsWith (not implemented)
 *
 * @param mixed $iterable
 * @param mixed $prefix
 * @return void
 */
function startsWith($iterable, $prefix) {
	if (is_string($iterable)) {
		return stringStartsWith($iterable, $prefix);
	} else {
		die("Not implemented!");
	}
}

/**
 * endsWith (not implemented)
 *
 * @param  mixed $iterable
 * @param  mixed $suffix
 * @return void
 */
function endsWith($iterable, $suffix) {
	if (is_string($iterable)) {
		return stringEndsWith($iterable, $suffix);
	} else {
		die("Not implemented!");
	}
}


/**
 * stringStartsWith
 *
 * @param string $haystack
 * @param string $needle
 * @return void
 */
function stringStartsWith($haystack, $needle) {
	$length = strlen($needle);
	if ($length == 0) {
		return true;
	}
	return (substr($haystack, 0, $length) === $needle);
}


/**
 * stringEndsWith
 *
 * @param string $haystack
 * @param string $needle
 * @return void
 */
function stringEndsWith($haystack, $needle) {
	$length = strlen($needle);
	if ($length == 0) {
		return true;
	}
	return (substr($haystack, -$length) === $needle);
}


/**
 * Checks if var is set or throws
 *
 * @param  mixed $var
 * @param  mixed $exception
 * @return void
 */
function check($var, $exception) {
	if (isset($var)) {
		return $var;
	} else {
		throw $exception;
	}
}


/**
 * Sets an object property or an array index depending on the type of $var
 *
 * @param mixed $var
 * @param mixed $index
 * @param mixed $value
 * @return void
 */
function set($var, $index, $value) {
	if (is_object($var)) {
		$var->$index = $value;
	} elseif (is_array($var)) {
		$var[$index] = $value;
	}
	return $var;
}

/**
 * Get the object property or array index depending on the type of $var.
 * Returns default if value is not set or if $var is not an object or array.
 *
 * @param mixed $var
 * @param mixed $index
 * @param mixed $default
 * @return mixed
 */
function get($var, $index, $default = null) {
	if (is_object($var)) {
		return getKey($var, $index, $default);
	} elseif (is_array($var)) {
		return getOffset($var, $index, $default);
	} else {
		return $default;
	}
}

/**
 * Returns the array value matching the defined offset or else returns
 * the default value
 *
 * @param array $array
 * @param mixed $offset Key or index
 * @param mixed $default
 * @return mixed
 */
function getOffset($array, $offset, $default = null) {
	if (isset($array[$offset])) {
		return $array[$offset];
	} else {
		return $default;
	}
}

/**
 * Returns the object property matching the defined key or else returns
 * the default value
 * @param object $object
 * @param string $key
 * @param mixed $default
 * @return mixed
 */
function getKey($object, $key, $default = null) {
	if (isset($object->$key)) {
		return $object->$key;
	} else {
		return $default;
	}
}

/**
 * Sorts an object or array by key and returns it as new array
 *
 * @param object|array $iter
 * @param string|int $key
 * @return array
 */
function sorted($iter) {
	asort($iter);
	return $iter;
}

/**
 * Reverses the order of the object or array
 *
 * @param object|array $iterable
 * @return object|array
 */
function reversed($array, $preserve_keys=true) {
	return array_reverse($array, $preserve_keys);
}

/**
 * Pick a single random item in an array
 *
 * @param array $array
 * @return mixed
 */
function choice($array) {
	return first(choices($array, 1));
}

/**
 * Pick $num items randomly in an array
 *
 * @param array $array
 * @param int $num
 * @return array
 */
function choices($array, $num) {
	$choices = [];
	$random_keys = array_rand($array, $num);
	if ($num === 1) {
		// If you are picking only one entry, array_rand returns the key for a random entry. Otherwise, it returns an
		// array of keys for the random entries.
		$random_keys = [$random_keys];
	}
	foreach ($random_keys as $id) {
		$choices[] = $array[$id];
	}
	return $choices;
}

function conceal($iterable) {
	$a = [];
	foreach ($iterable as $key => $value) {
		$a[$key] = $value;
	}
	return $a;
}

function i2a($iterable) {
	return iterator_to_array($iterable);
}

/**
 * Wraps a string ($str) with another string ($wrapper);
 *
 * @param string $wrapper
 * @param string $str
 * @return string
 */
function wrap($wrapper, $str) {
	return $wrapper . $str . $wrapper;
}

/**
 * Removes a key or index in an array
 *
 * @param array $array
 * @param string|int $offset
 * @return bool
 */
function deleteColumn(&$array, $offset) {
	return array_walk($array, function (&$v) use ($offset) {
		array_splice($v, $offset, 1);
	});
}

/**
 * Change string case to camel case.
 *
 * @param string $str
 * @return string
 */
function camel($str, $firstLetterIsUpper = true) {
	$str = str_replace('-', '_', $str);
	$camel = ucwords($str, '_/');
	if (!$firstLetterIsUpper) {
		$parts = explode('/', $camel);
		$camel = startsWith($camel, '/') ? '/' : '' ;
		foreach ($parts as $part) {
			if ($part) {  // This "if" strips empty strings.
				$camel .= lcfirst($part) . '/';
			}
		}
		$camel = rtrim($camel, '/');
	}
	return str_replace('_', '', $camel);
}

/**
 * Change string case to kebab case.
 *
 * @param string $str
 * @return string
 */
function kebab($str) {
	return str_replace('_', '-', snake($str));
}

/**
 * Change string case to snake case.
 *
 * @param string $str
 * @return string
 */
function snake($str) {
	$str = str_replace('-', '_', $str);
	$snake = "";
	$isFirst = true;
	foreach (str_split($str) as $char) {
		$lower = strtolower($char);
		if ($char !== $lower) {
			if (!$isFirst) {
				$snake .= '_';
			}
		}
		$snake .= $lower;
		$isFirst = $lower == '/' ?: false;
	}
	$sanitized = '';
	while ($sanitized !== $snake) {
		$snake = $sanitized ?: $snake;
		$sanitized = str_replace('__', '_', $snake);
	}
	return $snake;
}

/**
 * Change string case to lower case.
 *
 * @param string $str
 * @return string
 */
function lower($str) {
	return strtolower($str);
}

/**
 * Change string case to upper case.
 *
 * @param string $str
 * @return string
 */
function upper($str) {
	return strtoupper($str);
}

/**
 * Iterate on each characters of a string
 *
 * @param string $var
 * @return void
 */
function iter($var) {
	if (is_string($var)) {
		foreach (str_split($var) as $element) {
			yield $element;
		}
	}
	if (is_array($var)) {
		foreach ($var as $key => $value) {
			yield $key => $value;
		}
	}
}

/**
 * Returns the length of an array or string
 *
 * @param array|string $var
 * @return int
 */
function len($var) {
	if (is_array($var)) {
		return sizeof($var);
	}
	if (is_string($var)) {
		return strlen($var);
	}
	return 0;
}

/**
 * Filters an array or object where the passed key matches 
 * the passed value
 *
 * @param object|array $iter
 * @param string|int $searched_key
 * @param mixed $searched_value
 * @return array
 */
function filter($iter, $searched_key, $searched_value) {
	$found = [];
	foreach ($iter as $key => $value) {
		if (get($value, $searched_key) === $searched_value) {
			$found[$key] = $value;
		}
	}
	return $found;
}

/**
 * Returns all object/array keys as an array matching the passed value
 *
 * @param object|array $iter
 * @param mixed $value
 * @return array
 */
function getKeys($iter, $value) {
	if (is_array($iter)) {
		return array_keys($iter, $value, true);
	}
	$keys = [];
	foreach ($iter as $key => $v) {
		if ($v === $value) {
			$keys[] = $key;
		}
	}
	return $keys;
}

/**
 * Returns the first element of an object or array
 *
 * @param object|array $iter
 * @return mixed
 */
function first($iter) {
	if ($iter !== null) {
		foreach ($iter as $value) {
			return $value;
		}
	}
	return null;
}

/**
 * Returns the last element of an object or array
 *
 * @param object|array $iter
 * @return mixed
 */
function last($iter) {
	return first(reversed($iter));
}

/**
 * Clone an object or array
 *
 * @param object|array $object
 * @return object|array
 */
function copyOf($object) {
	return unserialize(serialize($object));
}

/**
 * Returns all object or array keys
 *
 * @param object|array $array
 * @return array
 */
function keys($array) {
	if (is_object($array)) {
		$array = (array)$array;
	}
	return array_keys($array);
}

/**
 * Returns all object or array values
 *
 * @param object|array $array
 * @return array
 */
function values($array) {
	if (is_object($array)) {
		$array = (array)$array;
	}
	return array_values($array);
}

/**
 * Cast an object as an instance of a Class
 * 
 * Source: https://stackoverflow.com/questions/3243900/convert-cast-an-stdclass-object-to-another-class
 * 
 * @param object $instance
 * @param string $className
 * @return object
 */
function cast($instance, $className) {
	return unserialize(sprintf('O:%d:"%s"%s', strlen($className), $className, strstr(strstr(serialize($instance), '"'), ':')));
}

/**
 * Gets the basename of a Class
 *
 * @param string $str
 * @return string
 */
function classBasename($str) {
	return basename(str_replace('\\', '/', $str));
}

/**
 * Recursively sorts an array by keys
 * 
 * Note this method returns a boolean and not the array
 *
 * @param array $array
 * @return bool
 */
function recur_ksort(&$array) {
	foreach ($array as &$value) {
		if (is_array($value)) {
			recur_ksort($value);
		}
	}
	return ksort($array);
}

/**
 * Return all values on the matching key of the object/array
 * Similar to array_column but works for objects too
 *
 * @param object|array $var
 * @param string|int $key
 * @return array
 */
function column($var, $key) {
	$column = [];
	foreach ($var as $subKey => $subVar) {
		$column[$subKey] = get($subVar, $key, null);
	}
	return $column;
}

/**
 * Returns the sum of all keys of an array or object
 *
 * @param array|object $iter
 * @return int|float
 */
function sum($iter) {
	$sum = 0;
	foreach ($iter as $element) {
		$sum += $element;
	}
	return $sum;
}

/**
 * Returns all array values that are lower than the passed $value
 *
 * @param array $iter
 * @param mixed $value
 * @param string|int $key
 * @return array
 */
function lessThan($array, $value, $key = null) {
	return array_filter($array, function($otherValue) use ($key, $value) {
		if ($key !== null) {
			return get($otherValue, $key) < $value;
		} else {
			return $otherValue < $value;
		}
	});
}

/**
 * Returns all array values that are higher than the passed $value
 *
 * @param array $iter
 * @param mixed $value
 * @param string|int $key
 * @return array
 */
function greaterThan($array, $value, $key = null) {
	return array_filter($array, function($otherValue) use ($key, $value) {
		if ($key !== null) {
			return get($otherValue, $key) > $value;
		} else {
			return $otherValue > $value;
		}
	});
}

/**
 * Generates a unique id with an optional prefix
 *
 * @param string $prefix
 * @return string
 */
function newId($prefix = "") {
	return strtolower(md5(uniqid($prefix, true)));
}

/**
 * Flattens an array into a new array
 *
 * @param array $array
 * @return array
 */
function flat($array) {
	$flat = [];
	foreach ($array as $key => $subArray) {
		foreach ($subArray as $subValue) {
			$flat[] = $subValue;
		}
	}
	return $flat;
}

/**
 * Check if the passed timestamp is expired
 *
 * @param int $timestamp
 * @param int $delay
 * @return bool
 */
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

/**
 * Call defined function with an array of parameters
 *
 * @param callable $function
 * @param array $params
 * @return callable
 */
function noArgs($function, $params) {
	return function () use ($function, $params) {
		return call_user_func_array($function, $params);
	};
}

/**
 * Returns the current timestamp
 *
 * @return int
 */
function now() {
	return strtotime("now");
}

/**
 * Merge 2 arrays or objects
 *
 * @param object|array $lower
 * @param object|array $upper
 * @return object|array
 */
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

/**
 * Alias for array_combine
 *
 * @param array $keys
 * @param array $values
 * @return array
 */
function zip($keys, $values) {
	return array_combine($keys, $values);
}

function keyBy($iterable, $key) {
	return array_column($iterable, null, $key);
}

/**
 * Joins paths (passed as parameters), prevents double slashes
 *
 * @return string
 */
function join_paths() {
	return preg_replace('#/+#','/', join('/', array_diff(func_get_args(), [""])));
}

