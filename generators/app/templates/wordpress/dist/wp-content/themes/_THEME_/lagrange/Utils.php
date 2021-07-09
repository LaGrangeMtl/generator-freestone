<?php

/**
 * Returns true if $var starts with the $prefix. Both values and keys are compared and order is important. If used with
 * objects, this function will cast them into arrays before comparison.
 *
 * @param string|object|array $var
 * @param mixed $prefix
 * @return bool
 */
function starts_with($var, $prefix) {
	if (len($prefix) === 0) {
		return true;
	}
	if (is_string($var) && is_string($prefix)) {
		return strpos($var, $prefix) === 0;
	}
	return slice($var, 0, len($prefix)) === $prefix;
}

/**
 * Returns true if $var ends with the $suffix. Both values and keys are compared and order is important. If used with
 * objects, this function will cast them into arrays before comparison.
 *
 * @param string|object|array $var
 * @param  mixed $suffix
 * @return bool
 */
function ends_with($var, $suffix) {
	if (len($suffix) === 0) {
		return true;
	}
	if (is_string($var) && is_string($suffix)) {
		return strpos($var, $suffix, strlen($var) - strlen($suffix)) === strlen($var) - strlen($suffix);
	}
	return slice($var, -len($suffix)) === $suffix;
}

/**
 * Sets an object property or an array key depending on the type of $var.
 *
 * @param object|array $var The object or array to set a key to a given value.
 * @param int|string $key Object key or array offset to assign the value to.
 * @param mixed $value The value to set to the given $var and $key.
 *
 * @return mixed The altered $var.
 */
function set($var, $key, $value) {
	if (is_object($var)) {
		$var->$key = $value;
	} elseif (is_array($var)) {
		$var[$key] = $value;
	}
	return $var;
}

/**
 * Returns the object property or array $key depending on the type of $var. Returns $default if value is not set or if
 * $var is not an object or array.
 *
 * @param object|array $var The object or array to get a value from.
 * @param int|string $key The key or offset to retrieve from $var.
 * @param mixed $default The default value to return if $key is not set or if $var is neither an array or an object.
 *
 * @return mixed The value at $key from $var or the $default value.
 */
function get($var, $key, $default = null) {
	if (is_object($var)) {
		if (isset($var->$key)) {
			return $var->$key;
		}
	} elseif (is_array($var) && isset($var[$key])) {
		return $var[$key];
	}
	return $default;
}

/**
 * Example : get_if($translations['homepage'], 'starts_with', 'section2_list_item');
 *
 * @param $var
 * @param $func
 * @param $by
 *
 * @return mixed|null
 */
function get_if($var, $func, $by) {
	// Complexity level > 9000
	return pluck($var, keys(equal(zip(keys($var), apply_all(keys($var), $func, null, [$by])), true)));
}

/**
 * Sorts an object or array by key and returns it as new array
 *
 * @param object|array $var
 * @param string|int|null $key
 *
 * @return array
 */
function sorted($var, $key = null) {
	if (is_object($var)) {
		$var = (array) $var;
	}
	if (!is_array($var) || empty($var)) {
		return $var;
	}
	if ($key === null) {
		asort($var);
		return $var;
	}
	if (is_object(first($var))) {
		uasort($var, function ($a, $b) use ($key) {
			return $a->$key > $b->$key;
		});
	}
	if (is_array(first($var))) {
		uasort($var, function ($a, $b) use ($key) {
			return $a[$key] > $b[$key];
		});
	}
	return $var;
}

function order_by($var, $keys) {
	if (is_object($var)) {
		$var = (array) $var;
	}
	if (!is_array($var) || empty($var)) {
		return $var;
	}
	uasort($var, function ($a, $b) use ($keys) {
		foreach ($keys as $key => $direction) {
			if (is_int($key)) {
				$key = $direction;
				$direction = 'asc';
			}
			if (get($a, $key) === get($b, $key)) {
				continue;
			}
			if ($direction == 'desc') {
				return get($a, $key) < get($b, $key);
			} else {
				return get($a, $key) > get($b, $key);
			}
		}
	});
	return $var;
}

/**
 * Reverses the order of an array. Alias for array_reverse.
 *
 * @param array $array
 * @param bool $preserve_keys
 *
 * @return array
 */
function reversed($array, $preserve_keys=true) {
	return array_reverse($array, $preserve_keys);
}

/**
 * Pick a single random item in an array.
 *
 * @param array $array
 * @return mixed
 */
function choice($array) {
	return first(choices($array, 1));
}

/**
 * Pick $num items randomly in an array.
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

/**
 * Wraps a string ($str) with a prefix and a suffix.
 *
 * @param array $strArray
 * @param string $prefix
 * @param string $suffix
 * @return array
 */
function wrap($strArray, $prefix, $suffix = null) {
	if ($suffix === null) {
		$suffix = $prefix;
	}
	$wrapped = [];
	foreach ($strArray as $str) {
		$wrapped[] = $prefix . $str . $suffix;
	}
	return $wrapped;
}

/**
 * Removes the $prefix from $var if present. Intended for strings but will work with arrays and objects too.
 *
 * @param $var string|array|object The $var to remove the $prefix from.
 * @param $prefix string|array|object The $prefix to remove from the $var.
 *
 * @return mixed The $var without the $prefix.
 */
function remove_prefix($var, $prefix) {
	if (starts_with($var, $prefix)) {
		return slice($var, len($prefix));
	} else {
		return $var;
	}
}

/**
 * Removes the $suffix from $var if present. Intended for strings but will work with arrays and objects too.
 *
 * @param $var string|array|object The $var to remove the $suffix from.
 * @param $prefix string|array|object The $suffix to remove from the $var.
 *
 * @return mixed The $var without the $suffix.
 */
function remove_suffix($str, $suffix) {
	if (ends_with($str, $suffix)) {
		return slice($str, 0, len($str) - len($suffix));
	}
	else {
		return $str;
	}
}

function cascade($var, $func, $key = null, $params_groups = []) {
	foreach ($params_groups as $params) {
		$var = apply_all($var, $func, $key, $params);
	}
	return $var;
}

function copy_column($var, $source, $destination) {
	$renamed = [];
	foreach ($var as $i => $row) {
		$renamed[$i] = set($row, $destination, get($row, $source));
	}
	return $renamed;
}

function delete_column($var, $key) {
	$deleted = [];
	foreach ($var as $i => $value) {
		if (is_object($value)) {
			unset($value->$key);
		} elseif (is_array($value)) {
			unset($value[$key]);
		}
		$deleted[$i] = $value;
	}
	return $deleted;
}

function rename_column($var, $old, $new) {
	$renamed = [];
	foreach ($var as $i => $row) {
		$row = set($row, $new, get($row, $old));
		if (is_object($row)) {
			unset($row->$old);
		} elseif (is_array($row)) {
			unset($row[$old]);
		}
		$renamed[$i] = $row;
	}
	return $renamed;
}

/**
 * Change string case to camel case.
 * Ex: ThisIsAString or thisIsAString
 *
 * @param string|array|object $var
 * @param bool $firstLetterIsUpper
 *
 * @return string
 */
function camel($var, $firstLetterIsUpper = true) {
	if (is_string($var)) {
		$var = str_replace('-', '_', $var);
		$camel = ucwords($var, '_/');
		if (!$firstLetterIsUpper) {
			$parts = explode('/', $camel);
			$camel = starts_with($camel, '/') ? '/' : '';
			foreach ($parts as $part) {
				if ($part) {  // This "if" strips empty strings.
					$camel .= lcfirst($part) . '/';
				}
			}
			$camel = rtrim($camel, '/');
		}
		return str_replace('_', '', $camel);
	}
	if (is_array($var) || is_object($var)) {
		return apply_all($var, __FUNCTION__, null, [$firstLetterIsUpper]);
	}
	return $var;
}

/**
 * Change string case to kebab case.
 * Ex: this-is-a-string
 *
 * @param string $var
 * @return string
 */
function kebab($var) {
	if (is_string($var)) {
		return str_replace('_', '-', snake($var));
	}
	if (is_array($var) || is_object($var)) {
		return apply_all($var, __FUNCTION__);
	}
	return $var;
}

/**
 * Change string case to snake case.
 * Ex: this_is_a_string
 *
 * @param string $var
 * @return string
 */
function snake($var) {
	if (is_string($var)) {
		$var = str_replace('-', '_', $var);
		$snake = "";
		$isFirst = true;
		foreach (str_split($var) as $char) {
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
	if (is_array($var) || is_object($var)) {
		return apply_all($var, __FUNCTION__);
	}
	return $var;
}

/**
 * Change string case to lower case. Alias for strtolower. If $var is an array or object, it will lower each element.
 * Ex: thisisastring
 *
 * @param string|array $var
 * @return string|array
 */
function lower($var) {
	if (is_string($var)) {
		return strtolower($var);
	}
	if (is_array($var) || is_object($var)) {
		return apply_all($var, __FUNCTION__);
	}
	return $var;
}

/**
 * Change string case to upper case. Alias for strtoupper.
 * Ex: THISISASTRING
 *
 * @param string $var
 * @return string
 */
function upper($var) {
	if (is_string($var)) {
		return strtoupper($var);
	}
	if (is_array($var) || is_object($var)) {
		return apply_all($var, __FUNCTION__);
	}
	return $var;
}

/**
 * Creates a generator out of a string, array or object.
 *
 * @param string $var
 * @return generator
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
 * Returns the length of an array or string. Alias for sizeof and strlen. This function returns 0 if $var is not an
 * array or a string.
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
 * Filters an array of array or objects where the passed key equals the passed value.
 *
 * @param object[]|array[] $iter
 * @param string|int $searched_key
 * @param mixed $searched_value
 *
 * @return array
 */
function filter($iter, $searched_key, $searched_value) {
	return equal($iter, $searched_value, $searched_key);
}

/**
 * Returns the first element of an object or array.
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
 * Returns the last element of an object or array. Alias for end.
 *
 * @param object|array $iter
 * @return mixed
 */
function last($iter) {
	if (is_array($iter)) {
		return end($iter);
	}
	return first(reversed($iter));
}

/**
 * Clone an object or array by serializing and unserializing it.
 *
 * @param object|array $object
 * @return object|array
 */
function copy_of($object) {
	return unserialize(serialize($object));
}

/**
 * Returns the keys of $var. Alias for array_keys but works with objects too.
 *
 * @param object|array $var The $var to retrieve the keys from.
 *
 * @return array The keys of $var.
 */
function keys($var) {
	if (is_object($var)) {
		$var = (array) $var;
	}
	return array_keys($var);
}

/**
 * Returns the values of $var. Alias for array_values but works with objects too.
 *
 * @param object|array $var The $var to retrieve the values from.
 *
 * @return array The keys of $var.
 */
function values($var) {
	if (is_object($var)) {
		$var = (array) $var;
	}
	return array_values($var);
}

/**
 * Cast an object as an instance of a Class. This is a hack. Beware!
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
 * Returns the basename of a Class.
 * Ex.: classBasename("My\Very\long\namespace\classname") will return "classname".
 *
 * @param string $str The classname with or without its namespace.
 *
 * @return string The classname without its namespace.
 */
function classBasename($str) {
	return basename(str_replace('\\', '/', $str));
}

/**
 * Recursively sorts an array by keys.
 *
 * Note this method returns a boolean and not the array.
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
 * Return all values on the matching key of the object/array. Similar to array_column but works for objects too.
 *
 * @param object|array $var
 * @param string|int $key
 * @param mixed $default
 * @return array
 */
function column($var, $key, $default = null) {
	$column = [];
	foreach ($var as $i => $row) {
		$column[$i] = get($row, $key, $default);
	}
	return $column;
}

function defaults($keys, $defaults) {
	if ($defaults === null) {
		$defaults = array_fill(0, len($keys), null);
	}
	return array_combine($keys, $defaults);
}

function pluck($var, $keys, $defaults = null) {
	$plucked = [];
	foreach (defaults($keys, $defaults) as $key => $default) {
		$plucked[$key] = get($var, $key, $default);
	}
	return $plucked;
}

function columns($var, $keys, $defaults = null) {
	$columns = [];
	foreach ($var as $i => $row) {
		$columns[$i] = pluck($row, $keys, $defaults);
	}
	return $columns;
}

/**
 * Returns the sum of all values in an iterable.
 *
 * @param iterable $iter
 * @return int
 */
function sum($iter) {
	$sum = 0;
	foreach ($iter as $element) {
		$sum += $element;
	}
	return $sum;
}

/**
 * Generates a unique id with an optional prefix.
 *
 * @param string $prefix
 * @return string
 */
function new_id($prefix = "") {
	return strtolower(md5(uniqid($prefix, true)));
}

/**
 * Flattens an array of arrays into a new array.
 *
 * @param array[] $array
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
 * Check if the passed timestamp is expired.
 *
 * @param int|string $timestamp
 * @param int $delay
 * @return bool
 */
function is_expired($timestamp, $delay) {
	if ($timestamp === null) {
		return true;
	} else {
		if (is_string($timestamp)) {
			$timestamp = strtotime($timestamp);
		}
	}
	$timestamp += $delay;
	return $timestamp <= strtotime("now");
}

/**
 * Returns a timestamp as a string.
 *
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
	$milliseconds = str_pad("$milliseconds", 6, "0", STR_PAD_LEFT);
	return date(preg_replace('`(?<!\\\\)u`', $milliseconds, $format), $timestamp);
}

/**
 * Returns the current timestamp as an int. Precision is limited to seconds. Alias for time() or strtotime("now").
 *
 * @return int Returns the current time measured in the number of seconds since the Unix Epoch (January 1 1970
 * 00:00:00 GMT).
 */
function now() {
	return time();
}

function merge($lower, $upper, $how_deep = null) {
	foreach ($upper as $key => $sub_upper) {
		$sub_lower = get($lower, $key);
		if ($sub_lower != null && (is_array($sub_upper) || is_object($sub_upper)) && ($how_deep == null || $how_deep > 0)) {
			if (is_int($how_deep)) {
				$how_deep--;
			}
			$lower = set($lower, $key, merge($sub_lower, $sub_upper, $how_deep));
		} else {
			$lower = set($lower, $key, $sub_upper);
		}
	}
	return $lower;
}

/**
 * Alias for array_combine.
 * Creates and returns an associative array out of an array of keys and an array of values.
 *
 * @param array $keys
 * @param array $values
 * @return array
 */
function zip($keys, $values) {
	return array_combine($keys, $values);
}

/**
 * Alias for array_column passing null to the column_key.
 * Returns an associative array keyed by the values for the specified key.
 *
 * @param array $iterable
 * @param string|int $key
 * @return array
 */
function key_by($iterable, $key) {
	return array_column($iterable, null, $key);
}

/**
 * Returns an associative keyed by the values for the specified key. Values with the same key are appended into a
 * sub-array.
 *
 * @param array $iterable
 * @param string|int $key
 * @param array|null $columns
 * @return array
 */
function group_by($iterable, $key, $columns = null) {
	$grouped = [];
	foreach ($iterable as $i => $value) {
		if ($columns !== null) {
			$grouped[get($value, $key)][$i] = pluck($value, $columns);
		} else {
			$grouped[get($value, $key)][$i] = $value;
		}
	}
	return $grouped;
}

/**
 * Joins paths (passed as parameters), prevents double slashes
 *
 * @return string
 */
function join_paths() {
	return preg_replace('#/+#','/', join('/', array_diff(func_get_args(), [""])));
}

/**
 * Returns an inflated array of parents with their respective child under a sub_key.
 *
 * @param array $parents The parents under which children will be assigned.
 * @param array $children The children to assign under the parents.
 * @param string $sub_key The sub key in which to append the childrens.
 * @param string $parent_key The key in the parent that identifies the parent.
 * @param array $default The default value to assign a parent if no child is found.
 *
 * @return array An inflated array of parents with their respective child under a sub_key.
 */
function plug($parents, $children, $parent_key, $sub_key = null, $default = null) {
	$sub_key = $sub_key ?? $parent_key;
	$plugged = [];
	foreach ($parents as $i => $parent) {
		$plugged[$i] = set($parent, $sub_key, get($children, get($parent, $parent_key), $default));
	}
	return $plugged;
}

/**
 * Returns an inflated array of parents with their respective children under a sub_key.
 *
 * @param array $parents The parents under which children will be assigned.
 * @param array $children The children to assign under the parents.
 * @param string $sub_key The sub key in which to append the childrens.
 * @param string $child_key The key in the child that specifies to which parent it belongs to.
 * @param string $parent_key The key in the parent that identifies the parent.
 * @param array $default The default value to assign a parent if no child is found.
 *
 * @return array An inflated array of parents with their respective children under a sub_key.
 */
function inflate($parents, $children, $child_key, $parent_key, $sub_key, $default = []) {
	return plug($parents, group_by($children, $child_key), $parent_key, $sub_key, $default);
}

/**
 * Formats a string using {} or {key} and the values provided in an array.
 *
 * @param $str string The format string.
 * @param $values array The array of values to insert in the format string.
 *
 * @return string|string[]|null
 */
function format($str, $values) {
	if (is_string(first(keys($values)))) {
		foreach ($values as $key => $value) {
			$str = preg_replace("/{".$key."}/", $value, $str);
		}
	} else {
		foreach ($values as $value) {
			$str = preg_replace("/{}/", $value, $str, 1);
		}
	}
	return $str;
}

/**
 * Somehow PHP doesn't have a built-in function for that.
 * @param $array
 *
 * @return float|int
 */
function avg($array) {
	return sum($array) / len($array);
}

function time_it($func, $n = 1000) {
	$uTimestampBefore = microtime(true);
	foreach (range(0, $n) as $i) {
		$func();
	}
	$uTimestampAfter = microtime(true);
	$elapsed = ($uTimestampAfter - $uTimestampBefore) * 1000;
	return "Took $elapsed ms";
}

const ascii_lower = 'abcdefghijklmnopqrstuvwxyz';
const ascii_upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const ascii_letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const ascii_digits = '0123456789';
const ascii_hexdigits = '0123456789abcdefABCDEF';
const ascii_octdigits = '01234567';
const ascii_ponctuation = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';
const ascii_whitespace = ' \t\n\r\v\f';

function random_string($length, $extended = false) {
	$letters = ascii_letters;
	if ($extended) {
		$letters .= ascii_ponctuation;
	}
	return implode('', choices(str_split($letters), $length));
}

/**
 * Alias for array_unique but also works with objects.
 *
 * @param array|object $var
 *
 * @return array
 */
function unique($var) {
	if (is_object($var)) {
		$var = (array) $var;
	}
	return array_unique($var);
}

/**
 * Alias for array_map.
 *
 * @param $func
 * @param $iterable
 *
 * @return mixed
 */
function map($iterable, $func) {
	if (is_array($iterable)) {
		return array_map($func, $iterable);
	}
	if (is_object($iterable)) {
		$iterable = clone $iterable;
		foreach ($iterable as $key => $value) {
			$iterable->$key = $func($value);
		}
		return $iterable;
	}
	return null;
}

/**
 * Alias for array_reduce.
 *
 * @param $input
 * @param $function
 * @param $carry
 *
 * @return mixed|null
 */
function reduce($input, $function, $carry = null) {
	if (is_array($input)) {
		return array_reduce($input, $function, $carry);
	}
	foreach ($input as $value) {
		$carry = $function($carry, $value);
	}
	return $carry;
}

/**
 * Alias for array_slice or substr.
 *
 * @param mixed $iterable
 * @param $offset
 * @param null $length
 * @param false $preserve_keys
 *
 * @return mixed
 */
function slice($iterable, $offset, $length = null, $preserve_keys = false) {
	if (is_string($iterable)) {
		// substr actually checks if $length is null or if it is a variable that is set to null.
		if ($length === null) {
			return substr($iterable, $offset);
		} else {
			return substr($iterable, $offset, $length);
		}
	}
	if (is_object($iterable)) {
		$iterable = (array) $iterable;
	}
	return array_slice($iterable, $offset, $length, $preserve_keys);
}

function apply_all($iterable, $func, $key=null, $params=[]) {
	return map($iterable, function($element) use ($func, $key, $params) {
		if ($key) {
			return set($element, $key, $func(get($element, $key), ...$params));
		} else {
			return $func($element, ...$params);
		}
	});
}

/**
 * Appends params to a function callable with or without params.
 *
 * @param callable $function
 * @param array $params
 * @return callable
 */
function prefix_params($function, $params) {
	return function (...$p) use ($function, $params) {
		return $function(...$params, ...$p);
	};
}

/**
 * Appends params to a function callable with or without params.
 *
 * @param callable $function
 * @param array $params
 * @return callable
 */
function suffix_params($function, $params) {
	return function (...$p) use ($function, $params) {
		return $function(...$p, ...$params);
	};
}

/**
 * Returns all values that are lower than the passed $value. Works with two dimensional arrays (or objects) if a
 * key is provided.
 *
 * @param mixed $var
 * @param mixed $value
 * @param string|int|null $key
 * @return mixed
 */
function less_than($var, $value, $key = null) {
	$filtered = [];
	foreach ($var as $k => $v) {
		if ($key) {
			if (get($v, $key) < $value) {
				$filtered[$k] = $v;
			}
			continue;
		}
		if ($v < $value) {
			$filtered[$k] = $v;
		}
	}
	return $filtered;
}

/**
 * Returns all array values that are greater than the passed $value. Works with two dimensional arrays (or objects) if a
 * key is provided.
 *
 * @param mixed $var
 * @param mixed $value
 * @param string|int|null $key
 * @return array
 */
function greater_than(&$var, $value, $key = null) {
	$filtered = [];
	foreach ($var as $k => $v) {
		if ($key) {
			if (get($v, $key) > $value) {
				$filtered[$k] = $v;
			}
			continue;
		}
		if ($v > $value) {
			$filtered[$k] = $v;
		}
	}
	return $filtered;
}

/**
 * Returns whether or not the $var is in $iter. Alias for in_array, but works also for objects.
 *
 * @param $var
 * @param $values
 * @param string|int|null $key
 * @param mixed $default
 *
 * @return array
 */
function in($var, $values, $key = null, $default = null) {
	$filtered = [];
	foreach ($var as $k => $v) {
		if ($key) {
			if (in_array(get($v, $key, $default), $values, true)) {
				$filtered[$k] = $v;
			}
			continue;
		}
		if (in_array($v, $values, true)) {
			$filtered[$k] = $v;
		}
	}
	return $filtered;
}

/***
 * @param $var
 * @param $values
 * @param null $key
 *
 * @return array
 */
function not_in($var, $values, $key = null, $strict = true) {
	$filtered = [];
	foreach ($var as $k => $v) {
		if ($key) {
			if (!in_array(get($v, $key), $values, $strict)) {
				$filtered[$k] = $v;
			}
			continue;
		}
		if (!in_array($v, $values, $strict)) {
			$filtered[$k] = $v;
		}
	}
	return $filtered;
}

/**
 * @param $var
 * @param $value
 * @param null $key
 * @param bool $strict
 *
 * @return array
 */
function equal($var, $value, $key = null, $strict = true) {
	$filtered = [];
	foreach ($var as $k => $v) {
		if ($key) {
			$v = get($v, $key);
		}
		if ($strict) {
			if ($v === $value) {
				$filtered[$k] = $v;
			}
		} else {
			if ($v == $value) {
				$filtered[$k] = $v;
			}
		}
	}
	return $filtered;
}

/**
 * @param $var
 * @param $value
 * @param null $key
 * @param bool $strict
 *
 * @return array
 */
function not_equal($var, $value, $key = null, $strict = true) {
	$filtered = [];
	foreach ($var as $k => $v) {
		if ($key) {
			$v = get($v, $key);
		}
		if ($strict) {
			if ($v !== $value) {
				$filtered[$k] = $v;
			}
		} else {
			if ($v != $value) {
				$filtered[$k] = $v;
			}
		}
	}
	return $filtered;
}

function truthy($value, $default) {
	if (!$value) {
		return $default;
	}
	return $value;
}

function to_sql_select($tableName, $filters = null, $limit = null) {
	list($filters, $values) = to_sql_filters($filters);
	$whereKeyword = $filters ? "WHERE" : "";
	$limitKeyword = $limit ? "LIMIT" : "";
	$query = rtrim("SELECT * FROM `$tableName` {$whereKeyword} {$filters} {$limitKeyword} {$limit}") . ";";
	return [$query, $values];
}

function to_sql_insert($dataObject, $tableName) {
	list($fields, $values) = to_sql_fields($dataObject);
	$query = "INSERT INTO `$tableName` SET " . $fields;
	return [$query, $values];
}

function to_sql_update($dataObject, $tableName, $key = 'id') {
	list($fields, $values) = to_sql_fields($dataObject);
	$query = "UPDATE `$tableName` SET " . $fields . " WHERE `$key` = ?";
	$values[] = get($dataObject, $key);
	return [$query, $values];
}

function to_sql_save($dataObject, $tableName) {
	list($fields, $values) = to_sql_fields($dataObject);
	$query = "INSERT INTO `{$tableName}` SET {$fields} ON DUPLICATE KEY UPDATE {$fields}";
	$values = array_merge(values($values), values($values));
	return [$query, $values];
}

function to_sql_delete($tableName, $filters = null) {
	list($filters, $values) = to_sql_filters($filters);
	$where = $filters ? "WHERE" : "";
	$query = rtrim("DELETE FROM `$tableName` {$where} $filters").";";
	return [$query, $values];
}

function to_sql_fields($fields) {
	$columns = wrap(keys($fields), '`', '` = ?');
	return [implode(', ', $columns), values($fields)];
}

function to_sql_in($array) {
	return '(' . implode(', ', array_fill(0, sizeof($array), '?')) . ')';
}

function to_sql_filters($filters) {
	$query = "";
	$params = [];
	if ($filters !== null and sizeof($filters) > 0) {
		foreach ($filters as $filterKey => $filterValues) {
			if ($filterValues === [null]) {
				continue;
			}
			$query .= "`$filterKey` in " . to_sql_in($filterValues) . " AND ";
			$params = array_merge($params, $filterValues);
		}
		$query = remove_suffix($query, " AND ");
	}
	return [$query, $params];
}

/**
 * Returns the ip of the client. It looks up the $_SERVER array for the following keys 'HTTP_CLIENT_IP',
 * 'HTTP_X_FORWARDED_FOR' and 'REMOTE_ADDR'. The first value found will be returned. If none is set, this function
 * returns null.
 *
 * @return string|null The ip of the client or null if is not set.
 */
function ip() {
	if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
		return $_SERVER['HTTP_CLIENT_IP'];
	}
	if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
		return $_SERVER['HTTP_X_FORWARDED_FOR'];
	}
	if (!empty($_SERVER['REMOTE_ADDR'])) {
		return $_SERVER['REMOTE_ADDR'];
	}
	return null;
}

/**
 * Deletes the directory and its content recursively. This is the equivalent to the bash command `rm -rf`. The optional
 * parameter $emptyOnly can be set to true in order to avoid deleting the directory itself (i.e. to delete the content
 * only). This can be useful to preserve the ownership and permission on the directory.
 *
 * @param string $directoryPath Path to the directory to delete.
 * @param false $emptyOnly Whether to empty the directory instead of deleting it.
 *
 * @return bool True if the deletion is successful, false otherwise.
 */
function delete_directory($directoryPath, $emptyOnly = false) {
	if (!file_exists($directoryPath)) {
		return true;
	}
	if (!is_dir($directoryPath)) {
		return unlink($directoryPath);
	}
	foreach (scandir($directoryPath) as $item) {
		if ($item == '.' || $item == '..') {
			continue;
		}
		if (!delete_directory($directoryPath . DIRECTORY_SEPARATOR . $item)) {
			return false;
		}
	}
	if (!$emptyOnly) {
		return rmdir($directoryPath);
	}
	return true;
}

/**
 * Delete the content of the directory recursively.
 *
 * @param string $directoryPath Path to the directory to delete.
 * @return bool True if the deletion is successful, false otherwise.
 */
function empty_directory($directoryPath) {
	return delete_directory($directoryPath, true);
}

function common_keys($x, $y) {
	return in(keys($x), keys($y));
}

function intersect_diff($original, $latest, $strict = true) {
	$common_keys = common_keys($latest, $original);
	return diff(pluck($original, $common_keys), pluck($latest, $common_keys), $strict);
}

function diff($original, $latest, $strict = true) {
	$diff = [];
	foreach ($original as $key => $value) {
		$newValue = get($latest, $key);
		if ($strict) {
			if ($value !== $newValue) {
				$diff[$key] = $newValue;
			}
		} else {
			if ($value != $newValue) {
				$diff[$key] = $newValue;
			}
		}
	}
	return $diff;
}

function identify($iterable, $composed_key, $keys = [], $separator = '_') {
	$identified = [];
	foreach ($iterable as $i => $row) {
		$identified[$i] = set($row, $composed_key, implode($separator, pluck($row, $keys)));
	}
	return $identified;
}
