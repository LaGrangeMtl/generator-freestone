<?php
/**
 * Copyright (c) 2019. La Grange
 * https://la-grange.ca/
 */

namespace LaGrange\Markup;

class Title {
	const T1 = 't1';
	const T2 = 't2';
	const T3 = 't3';
	const T4 = 't4';
	const T5 = 't5';
	const T6 = 't6';
	
	/**
	 * getLevels
	 * 
	 * Calculates h tag levels depending on the start index (1 based)
	 *
	 * @param int $start Start index (1 based)
	 * @param array $titles Array of titles values (if empty (null, false, ''), will be skipped in the calculation)
	 * @return array Object mapping titles and levels, and last/next level values
	 */
	static function getLevels($start, $titles) {
		if ($start < 1) $start = 1;
		$last = $start - 1;
		$i = 0;
		$array = array_reduce($titles, function($c, $t) use (&$last, &$i) {
			if (!empty($t)) $last++;
			$c['t'.($i+1)] = !empty($t) ? (object) [
				'level' => $last,
				'content' => $t,
			] : null;
			$i++;
			return $c;
		}, []);
		$array['last'] = $last;
		$array['next'] = $last + 1;
		return (object) $array;
	}
		
	/**
	 * getTag
	 * 
	 * Returns a heading tag for a title object with a level
	 *
	 * @param  object $title { content: String, level: Int } Content of the tag 
	 * @param  array $attrs Will be added to tag, assoc and keys, ex: ['data-attr', 'class' => 'some-class]
	 * @return string Heading tag or returns a div if $level is empty, or empty string if content is empty.
	 */
	static function getTag($title, $attrs = []) {
		if (empty($title)) return '';
		$level = $title->level;
		$content = $title->content;
		$rootTag = !empty($level) ? 'h' . $level : 'div';
		$attrs = (array) $attrs;
		$parsedAttrs = array_reduce(array_keys($attrs), function($parsed, $attr) use ($attrs) {
			$value = $attrs[$attr];
			// key is numeric, it is not an html attribute name. We only need the value
			if (is_numeric($attr)) {
				$cur = $value;
			} else {
				$cur = "$attr=\"$value\"";
			}
			return "$parsed $cur";
		}, '');
		$tag = '<' . $rootTag . $parsedAttrs . '>';
		$endtag = '</' . $rootTag . '>';
		return $tag . $content . $endtag;
	}
}
