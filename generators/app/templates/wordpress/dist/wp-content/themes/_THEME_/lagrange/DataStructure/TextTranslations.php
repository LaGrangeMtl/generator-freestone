<?php

namespace LaGrange\DataStructure;

class TextTranslations {
	const SLUG = 'text_translations';
	const OPTIONS_PAGE_NAME = 'options-text-translations';
	const OPTIONS_PAGE_ID = 'options-text-translations-id';
	const ACF_GROUP_ID = 'group_' . self::SLUG;

	/**
	 * When called, will parse its JSON argument to create the text translations options page and fields.
	 * 
	 * @param string $schema A JSON string
	 */
	public static function init($schema) {
		acf_add_options_page([
			'post_id' => self::OPTIONS_PAGE_ID,
			'menu_slug' => self::OPTIONS_PAGE_NAME,
			'page_title' => 'Text translations',
			'menu_title' => 'Text translations',
			'capability' => 'edit_posts',
			'redirect' => false,
		]);

		self::createTextTranslations($schema);
	}

	/**
	 * @return JSON The text translations
	 */
	public static function toJSON() {
		return json_encode(self::getTextTranslations());
	}

	/**
	 * Gets all text translation fields as an associative array. To get a JSON object,
	 * use `toJSON()` instead.
	 * 
	 * @return array An associative array of all fields.
	 */
	public static function getTextTranslations() {
		$fields = acf_get_fields(self::ACF_GROUP_ID);

		$translations = [];
		$currentBranch = null;

		foreach ($fields as $field) {
			$type = $field['type'];
			$key = $field['key'];
			
			if ($type === 'tab') {
				$translations[$key] = [];
				$currentBranch = $key;
			} else {
				// Must do this contorsion because acf_get_fields does not return the value of the field,
				// There is no way to get both the tabs fields and the values of the other fields in one call.
				$realField = get_field_object($field['key'], self::OPTIONS_PAGE_ID);

				// Remove branch name from key
				$humanUsableKey = preg_replace('/^' . $currentBranch . '_/', '', $field['key']);

				$translations[$currentBranch][$humanUsableKey] = $realField['value'] ?? $realField['default_value'];
			}
		}
		
		return $translations;
	}

	/**
	 * Creates the ACF field group.
	 * 
	 * @param string $schema A JSON string
	 */
	private static function createTextTranslations($schema = null) {
		$branches = json_decode($schema, true);

		if ($branches === null) {
			throw new \Exception('Schema is not valid', 400);
		}

		$fields = self::mapBranches($branches);

		acf_add_local_field_group([
			'key' => self::ACF_GROUP_ID,
			'title' => 'Text Translations',
			'fields' => $fields,
			'location' => [
				[
					[
						'param' => 'options_page',
						'operator' => '==',
						'value' => self::OPTIONS_PAGE_NAME,
					],
				],
			],
		]);
	}

	/**
	 * Loops over all branches, calling `mapLeaves` on each one, to retrieve a list of fields 
	 * separated by tab fields to output in the ACF field group.
	 * 
	 * @param mixed $branches The json_decoded schema
	 * 
	 * @return array An associative array of ACF fields
	 */
	private static function mapBranches($branches) {
		if (!is_array($branches)) return;

		$fieldGroup = [];

		foreach ($branches as $branchName => $leaves) {
			$fields = self::mapLeaves($branchName, $leaves);
			$tabFields = [
				[
					'key' => $branchName,
					'label' => $branchName,
					'name' => $branchName,
					'type' => 'tab',
				],
			];
			
			$fieldGroup = array_merge($fieldGroup, $tabFields, $fields);
		}

		return $fieldGroup;
	}

	/**
	 * Loops over all leaves of a branch to retrieve a list of fields.
	 * 
	 * @param string $branchName The key of the current branch. Used in the naming of fields.
	 * @param array $leaves An associative array of key-values that will be outputed as fields.
	 * 
	 * @return array An associative array of ACF fields
	 */
	private static function mapLeaves($branchName, $leaves) {
		return array_map(function($key, $defaultValue) use ($branchName) {
			return [
				'key' => $branchName . '_' . $key,
				'label' => $key,
				'name' => $branchName . '_' . $key,
				'type' => 'text',
				'default_value' => $defaultValue,
			];
		}, array_keys($leaves), $leaves);
	}

}