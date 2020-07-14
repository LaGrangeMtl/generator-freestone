<?php

namespace LaGrange\DataStructure;

class ContentBlocks {
	public static function registerAll() {
		$dir = opendir(dirname( __FILE__ ) . '/../../website/Blocks');

		while (false !== ($className = readdir($dir))) {
			if ($className != "." && $className != "..") {
				$resolvedModule = str_replace(".php", "", "\Website\Blocks\\$className");

				add_action('acf/init', function() use ($resolvedModule) {
					$r = new \ReflectionClass($resolvedModule);
					$block = $r->newInstanceArgs();
					$args = array_merge(
						[
							'render_callback' => [$block, 'render'],
						],
						isset($block->args) ? $block->args : []
					);
					acf_register_block_type($args);
				});
			}
		}

		closedir($dir);
	}
}
