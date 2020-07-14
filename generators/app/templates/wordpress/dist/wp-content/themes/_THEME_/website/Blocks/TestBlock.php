<?php

namespace Website\Blocks;

use LaGrange\DataStructure\Block;

class TestBlock implements Block {
	const slug = 'kauysgdfjysdhvkb';

	function __construct() {
		$this->args = [
			'name'              => self::slug,
			'title'             => 'Test Block',
			'description'       => 'Test Block',
			'category'          => 'formatting',
			'icon'              => 'admin-comments',
			'keywords'          => array('test-block'),
		];
	}

	public function render($block, $content = '', $is_preview = false, $post_id = 0) {
?>
	Test in template
<?php
	}
}