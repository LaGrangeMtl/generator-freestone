'format es6';
'use strict';

import $ from 'jquery';
import { docReady } from './utils/docReady';

docReady.then(() => {
	
	// Edge srcset fix
	function isEdge(versions) { // array of numbers
		return versions.reduce((c, version) => {
			return c + (~window.navigator.userAgent.indexOf(`Edge/${version}`) ? 1 : 0);
		}, 0) !== 0;
	}

	if (isEdge([12, 13, 14])) {
		$('img').removeAttr('srcset').removeAttr('sizes');
	}
});