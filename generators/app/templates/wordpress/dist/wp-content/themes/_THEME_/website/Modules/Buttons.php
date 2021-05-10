<?php
	namespace Website\Modules;

	class Buttons {
		const TYPE_PRIMARY = [
			'slug' => 'button',
			'nice_name' => 'Primary button'
		];

		const TYPE_PRIMARY_REVERSED = [
			'slug' => 'button-primary-reverse',
			'nice_name' => 'Primary reversed button'
		];

		/**
		 * Gets an associative array of all button types.
		 * 
		 * @return array
		 */
		static public function getButtonTypes() {
			return [
				self::TYPE_PRIMARY['slug'] => self::TYPE_PRIMARY['nice_name'],
				self::TYPE_PRIMARY_REVERSED['slug'] => self::TYPE_PRIMARY_REVERSED['nice_name']
			];
		}

		/**
		 * Use this function when creating fields in any ACF group. Calling this function 
		 * will return a repeater field named "buttons" with the defined button types.
		 * 
		 * @param string $blockSlug The slug of the block where the ACF group is defined
		 * @param int $min Minimum number of buttons in the repeater field. Default value is 0.
		 * @param int $max Maximum number of buttons in the repeater field. Default value is 2.
		 * 
		 * @return array The repeater field
		 */
		static public function getButtonsField($blockSlug, $min = 0, $max = 2) {
			return [
				'key' => 'field_' . $blockSlug . '_buttons',
				'label' => 'Buttons',
				'name' => 'buttons',
				'type' => 'repeater',
				'instructions' => '',
				'required' => 0,
				'conditional_logic' => 0,
				'wrapper' => array(
					'width' => '',
					'class' => '',
					'id' => '',
				),
				'collapsed' => '',
				'min' => $min,
				'max' => $max,
				'layout' => 'block',
				'button_label' => 'Ajouter un button',
				'wpml_cf_preferences' => WPML_TRANSLATE_CUSTOM_FIELD,
				'sub_fields' => [
					[
						"key" =>  'subfield_' . $blockSlug . '_buttons_type',
						"label" => "Type",
						"name" => "type",
						"type" => "select",
						"instructions" => "",
						"required" => 0,
						"conditional_logic" => 0,
						"wrapper" => [
							"width" => "",
							"class" => "",
							"id" => ""
						],
						"choices" => self::getButtonTypes(),
						"default_value" => [
							"button"
						],
						"allow_null" => 0,
						"multiple" => 0,
						"ui" => 0,
						"return_format" => "value",
						"wpml_cf_preferences" => WPML_TRANSLATE_CUSTOM_FIELD,
						"ajax" => 0,
						"placeholder" => ""
					],
					[
						'key' => 'subfield_' . $blockSlug . '_buttons_link',
						'label' => 'Lien',
						'name' => 'link',
						'type' => 'link',
						'return_format' => 'array',
						'instructions' => '',
						'required' => 0,
						'wpml_cf_preferences' => WPML_TRANSLATE_CUSTOM_FIELD,
					]
				],
			];
		}

		/**
		 * Use this function to render or retrieve the different buttons HTML markup.
		 * 
		 * @param object $button A row of the buttons repeater field as defined in `Buttons::getButtonsField`
		 * @param string[] $attributes An array of attributes that will be printed on the HTML tag.
		 * @param boolean $is_link If set to true, will be rendered as a link. Default is true.
		 * @param boolean $echo If set to true, will echo the tag where called, otherwise will return the HTML as a string. Default is true.
		 * 
		 * @return string|false|void If $echo was set to false, returns the buffer contents (string|false) otherwise returns void.
		 */
		static public function renderButton($button, $attributes = [], $is_link = true, $echo = true) {
			ob_start();

			$class = isset($button['class']) ? $button['class'] : '';

			if ($button['link'] === '') {
				$button['link'] = [
					"url" => '#',
					"title" => '',
				];
			}

			if ($is_link) { ?>
				<a href="<?= $button['link']['url'] ?>" 
					class="<?= $button['type'] ?> <?= $class ?>" 
					data-title="<?= $button['link']['title'] ?>" 
					<?= isset($button['link']['target']) && !empty($button['link']['target']) ? ' target="'.$button['link']['target'].'" rel="noopener"' : '' ?> 
					<?= join(' ', $attributes) ?>>
					<span><?= $button['link']['title'] ?></span>
				</a>
			<? } else { ?>
				<button 
					class="<?= $button['type'] ?> <?= $class ?>" 
					data-title="<?= $button['link']['title'] ?>" 
					<?= join(' ', $attributes) ?>
				>
					<span><?= ($button['link']['title']) ? $button['link']['title'] : $button->link->title; ?></span>
				</button>
			<? }
			
			if ($echo) {
				echo ob_get_clean();
			} else {
				$output = ob_get_contents();
				ob_end_clean();
				return $output;
			}
		}
	}
?>