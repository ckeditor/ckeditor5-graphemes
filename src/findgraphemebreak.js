/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import splitter from './lib/grapheme-splitter.js';

/**
 * Scans given `text` starting from `offset` looking for first grapheme break. Returns given `offset` if there is
 * a grapheme break at that offset.
 *
 *		findGraphemeBreak( 'foobar', 2 ); // 2
 *		findGraphemeBreak( 'f̥̂oobar', 0 ); // 0
 *		findGraphemeBreak( 'f̥̂oobar', 1 ); // 3
 *		findGraphemeBreak( 'f̥̂oobar', 2 ); // 3
 *		findGraphemeBreak( 'f̥̂oobar', 2, false ); // 0
 *		findGraphemeBreak( 'f̥̂oobar', 3 ); // 3
 *		findGraphemeBreak( 'நிலைக்கு', 0 ); // 0
 *		findGraphemeBreak( 'நிலைக்கு', 1 ); // 2
 *		findGraphemeBreak( 'நிலைக்கு', 1, false ); // 0
 *		findGraphemeBreak( 'நிலைக்கு', 2 ); // 2
 *		findGraphemeBreak( 'நிலைக்கு', 3 ); // 4
 *
 * @memberOf utils
 * @param {String} text String to look for grapheme break in.
 * @param {Number} [offset=0] Offset in `text`.
 * @param {Boolean} [lookAfterOffset=true] Flag specifying whether to look for grapheme break after given `offset`
 * (`true`) or before (`false`).
 * @returns {Number} Grapheme break offset.
 */
export default function findGraphemeBreak( text, offset = 0, lookAfterOffset = true ) {
	let prevOffset = 0;
	let nextOffset;

	for ( let grapheme of splitter.splitGraphemes( text ) ) {
		nextOffset = prevOffset + grapheme.length;

		if ( prevOffset == offset ) {
			return offset;
		}

		if ( prevOffset < offset && offset < nextOffset ) {
			break;
		}

		prevOffset = nextOffset;
	}

	return lookAfterOffset ? nextOffset : prevOffset;
}
