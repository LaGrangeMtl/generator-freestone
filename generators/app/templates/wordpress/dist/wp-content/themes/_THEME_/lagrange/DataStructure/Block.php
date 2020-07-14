<?php

namespace LaGrange\DataStructure;

interface Block {
	public function render($block, $content = '', $is_preview = false, $post_id = 0);
}