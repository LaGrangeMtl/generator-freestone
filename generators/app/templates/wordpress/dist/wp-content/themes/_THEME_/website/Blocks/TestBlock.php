<?php

namespace Website\Blocks;

use LaGrange\DataStructure\Block;
use Website\Modules\Buttons;
use LaGrange\Markup\Title;

class TestBlock implements Block {
	const slug = 'kauysgdfjysdhvkb';
	const title = 'Test Block';

	function __construct() {
		$this->args = [
			'name'              => self::slug,
			'title'             => self::title,
			'description'       => self::title,
			'category'          => 'formatting',
			'icon'              => 'admin-comments',
			'keywords'          => array('test-block'),
		];
	}

	public function render($block, $content = '', $is_preview = false, $post_id = 0) {
		$fields = get_fields();
		$startingTitleLevel = Title::getBlockLevel($block['id'], get_post()) ? 1 : 2;

		self::template($fields, $startingTitleLevel, $is_preview);
	}

	static public function template($fields, $startingTitleLevel, $isPreview = false) {
			$buttons = get($fields, 'buttons');
		?>
			Test in template

			<?php foreach ($buttons as $button): ?>
				<?php Buttons::renderButton($button); ?>
			<?php endforeach; ?>
		<?php
	}

	static public function getFields() {
		return [
			Buttons::getButtonsField(self::slug),
		];
	}

	static public function createFields() {
		acf_add_local_field_group(array(
			'key' => 'group_' . self::slug,
			'title' => 'Content Block : ' . self::title,
			'fields' => self::getFields(),
			'location' => array(
				array(
					array(
						'param' => 'block',
						'operator' => '==',
						'value' => 'acf/' . self::slug,
					),
				),
			),
		));
	}
}