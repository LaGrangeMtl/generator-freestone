<?php
namespace Website\DataStructure;

class ImageSizes {
	// everytime you add new resize, or change value, run wp media regenerate --yes in your terminal.
	const FULL_WIDTH = 'full_width';
	const FULL_WIDTH_HEIGHT = 'full_width_height';
	const TWO_THIRD = 'two_third';
	const HALF_HALF = 'half_half';
	const HALF_HALF_FULL = 'half_half_full';
	const CARD_IMG = 'card_img';
	const MARQUEE = 'marquee_logo';

	static function init() {
		add_action('init', function () {
			add_image_size(self::FULL_WIDTH, 1920);
			add_image_size(self::FULL_WIDTH_HEIGHT, 1920, 960);
			add_image_size(self::TWO_THIRD, 935, 600);
			add_image_size(self::HALF_HALF, 770, 600);
			add_image_size(self::HALF_HALF_FULL, 960, 720);
			add_image_size(self::CARD_IMG, 500, 380);
			add_image_size(self::MARQUEE, 150, 150);
		});
	}
}