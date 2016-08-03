/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import Graphemes from '/ckeditor5/graphemes/graphemes.js';
import { isInsideGrapheme } from '/ckeditor5/graphemes/graphemes.js';
import Range from '/ckeditor5/engine/model/range.js';
import Selection from '/ckeditor5/engine/model/selection.js';
import CKEditorError from '/ckeditor5/utils/ckeditorerror.js';

import ModelTestEditor from '/tests/core/_utils/modeltesteditor.js';

describe( 'Graphemes', () => {
	let editor, doc, root, graphemes;

	beforeEach( () => {
		editor = new ModelTestEditor();

		doc = editor.document;
		root = doc.getRoot();
		root.appendChildren( 'aநிகுb' );

		graphemes = new Graphemes( editor );
		graphemes.init();
	} );

	afterEach( () => {
		graphemes.destroy();
		editor.destroy();
	} );

	it( 'should make document selection throw if placed inside grapheme', () => {
		doc.selection.collapse( root, 0 );
		expect( doc.selection.getFirstPosition().path ).to.deep.equal( [ 0 ] );

		doc.selection.collapse( root, 1 );
		expect( doc.selection.getFirstPosition().path ).to.deep.equal( [ 1 ] );

		expect( () => {
			doc.selection.setRanges( [ Range.createFromParentsAndOffsets( root, 0, root, 2 ) ] );
		} ).to.throw( CKEditorError, /document-selection-wrong-position/ );

		expect( () => {
			doc.selection.setRanges( [ Range.createFromParentsAndOffsets( root, 2, root, 3 ) ] );
		} ).to.throw( CKEditorError, /document-selection-wrong-position/ );

		doc.selection.collapse( root, 3 );
		expect( doc.selection.getFirstPosition().path ).to.deep.equal( [ 3 ] );

		doc.selection.collapse( root, 5 );
		expect( doc.selection.getFirstPosition().path ).to.deep.equal( [ 5 ] );
	} );

	it( 'should make modifySelection not place range boundary inside grapheme for character unit', () => {
		const sel = new Selection();
		sel.collapse( root, 1 );

		doc.composer.modifySelection( sel, { unit: 'character' } );

		const range = sel.getFirstRange();
		expect( range.start.path ).to.deep.equal( [ 1 ] );
		expect( range.end.path ).to.deep.equal( [ 3 ] );

		sel.collapse( root, 3 );

		doc.composer.modifySelection( sel, { unit: 'character', direction: 'backward' } );
		expect( range.start.path ).to.deep.equal( [ 1 ] );
		expect( range.end.path ).to.deep.equal( [ 3 ] );
		expect( sel.isBackward ).to.be.true;
	} );

	it( 'should let modifySelection place range boundary inside grapheme for codePoint unit', () => {
		const sel = new Selection();
		sel.collapse( root, 1 );

		doc.composer.modifySelection( sel, { unit: 'codePoint' } );

		const range = sel.getFirstRange();
		expect( range.start.path ).to.deep.equal( [ 1 ] );
		expect( range.end.path ).to.deep.equal( [ 2 ] );
	} );
} );

describe( 'isInsideGrapheme', () => {
	const testString = 'aநிகுb';

	it( 'should return true if given offset in a string is inside a surrogate pair', () => {
		expect( isInsideGrapheme( testString, 2 ) ).to.be.true;
		expect( isInsideGrapheme( testString, 4 ) ).to.be.true;
	} );

	it( 'should return false if given offset in a string is not inside a surrogate pair', () => {
		expect( isInsideGrapheme( testString, 1 ) ).to.be.false;
		expect( isInsideGrapheme( testString, 3 ) ).to.be.false;
		expect( isInsideGrapheme( testString, 5 ) ).to.be.false;
	} );

	it( 'should return false if given offset in a string is at the string beginning or end', () => {
		expect( isInsideGrapheme( testString, 0 ) ).to.be.false;
		expect( isInsideGrapheme( testString, 6 ) ).to.be.false;
	} );
} );
