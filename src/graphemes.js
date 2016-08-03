/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import findGraphemeBreak from './findgraphemebreak.js';
import Feature from '../core/feature.js';
import Position from '../engine/model/position.js';
import CKEditorError from '../utils/ckeditorerror.js';

/**
 * Adds support for better handling of grapheme clusters in text data.
 *
 * Adds a callback to {@link engine.model.Composer#event:modifySelection} that prevents putting selection between code points
 * that form a grapheme, i.e. 'ஜெ'.
 *
 * Adds a callback to {@link engine.model.Document#selection model document's selection} {@link engine.model.Selection#event:change}
 * that throws an error if document selection is placed inside a grapheme.
 *
 * @memberOf graphemes
 * @extends core.Feature
 */
export default class Graphemes extends Feature {
	init() {
		const document = this.editor.document;

		this.listenTo( document.composer, 'modifySelection', ( evt, data ) => {
			const selection = data.selection;
			const isForward = data.options.direction != 'backward';
			const textNode = selection.focus.textNode;

			if ( data.options.unit == 'character' && textNode !== null ) {
				const offsetInTextNode = selection.focus.offset - textNode.startOffset;
				const graphemeBreak = findGraphemeBreak( textNode.data, offsetInTextNode, isForward );

				selection.setFocus( Position.createAt( textNode.parent, textNode.startOffset + graphemeBreak ) );
			}
		} );

		this.listenTo( document.selection, 'change:range', () => {
			for ( let range of document.selection.getRanges() ) {
				if ( !validateSelectionRange( range ) ) {
					/**
					 * Range from document selection starts or ends at incorrect position.
					 *
					 * @error document-selection-wrong-position
					 * @param {engine.model.Range} range
					 */
					throw new CKEditorError( 'document-selection-wrong-position: ' +
						'Range from document selection starts or ends at incorrect position.', { range } );
				}
			}
		} );
	}
}

/**
 * Checks whether given offset in a string is inside a grapheme cluster.
 *
 * @param {String} string String to check.
 * @param {Number} offset Offset to check.
 * @returns {Boolean}
 */
export function isInsideGrapheme( string, offset ) {
	return findGraphemeBreak( string, offset ) != offset;
}

// Checks whether given range is a valid range for document's selection.
function validateSelectionRange( range ) {
	return validateTextNodePosition( range.start ) && validateTextNodePosition( range.end );
}

// Checks whether given range boundary position is valid for document selection, meaning that is not between
// unicode surrogate pairs or base character and combining marks.
function validateTextNodePosition( position ) {
	const textNode = position.textNode;

	if ( textNode ) {
		const data = textNode.data;
		const offset = position.offset - textNode.startOffset;

		return !isInsideGrapheme( data, offset );
	}

	return true;
}
