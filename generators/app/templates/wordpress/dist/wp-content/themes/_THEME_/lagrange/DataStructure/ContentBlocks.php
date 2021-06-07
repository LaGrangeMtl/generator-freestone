<?php
namespace LaGrange\DataStructure;

class ContentBlocks {
	public static $blocks = [];
	public static $included_blocks = [];

	/**
	 * @return ReflectionClass[]
	 */
	public static function getBlocksClasses() {
		$blocksClasses = [];
		
		$dir = opendir(dirname( __FILE__ ) . '/../../website/Blocks');
		while (false !== ($className = readdir($dir))) {
			if ($className != "." && $className != "..") {
				$resolvedModule = str_replace(".php", "", "\Website\Blocks\\$className");
				$module = new \ReflectionClass($resolvedModule);

				array_push($blocksClasses, $module);
			}
		}
		closedir($dir);

		return $blocksClasses;
	}

	public static function registerAll() {
		remove_theme_support( 'core-block-patterns' );

		$blockClasses = self::getBlocksClasses();

		foreach ($blockClasses as $blockClass) {
			$block = $blockClass->newInstanceArgs();
			$args = array_merge(
				[
					'render_callback' => [$block, 'render'],
				],
				isset($block->args) ? $block->args : []
			);
			self::$blocks[] = 'acf/' . $blockClass->getConstant('slug');
			add_action('acf/init', function() use ($args, $block) {
				acf_register_block_type($args);
				$block->createFields();
			});
		}
	}

	/**
	 * @param $included assoc array containing a map of post_types and allowed blocks.
	 */
	public static function filterWPBlocks($included = []) {
		self::$included_blocks = $included;
		add_filter( 'allowed_block_types', [get_called_class(), 'allowed_block_types'], 10, 2 );
	}

	// In Guttenberg, show all custom blocks + some WP blocks added in the $included_blocks
	public static function allowed_block_types( $allowed_block_types, $post ) {
		$included = get(self::$included_blocks, $post->post_type, []);
		if (array_search('only', $included) !== FALSE) {
			return $included;
		}
		return array_merge([], self::$blocks);
	}
}