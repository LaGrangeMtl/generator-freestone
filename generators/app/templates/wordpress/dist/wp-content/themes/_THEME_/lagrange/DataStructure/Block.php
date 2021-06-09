<?php

namespace LaGrange\DataStructure;

interface Block {
	public function render($block, $content = '', $is_preview = false, $post_id = 0);

	static public function getFields();

	static public function createFields();
	
	static public function template(array|object $fields, int $startingTitleLevel, bool $isPreview);
}