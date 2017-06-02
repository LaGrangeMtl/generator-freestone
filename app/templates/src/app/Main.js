'format es6';
'use strict';

import $ from 'jquery';
import { docReady } from './utils/docReady';
import { isEdge } from './utils/browserDetect'; 

docReady.then(() => {
	if (isEdge([12, 13, 14])) {
		$('img').removeAttr('srcset').removeAttr('sizes');
	}
});