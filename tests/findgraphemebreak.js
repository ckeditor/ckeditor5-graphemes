/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import findGraphemeBreak from '/ckeditor5/graphemes/findgraphemebreak.js';

describe( 'findGraphemeBreak', () => {
	it( 'should return first break after given offset', () => {
		expect( findGraphemeBreak( 'foobar', 2 ) ).to.equal( 2 );
		expect( findGraphemeBreak( 'f̥̂oobar', 0 ) ).to.equal( 0 ); // 0
		expect( findGraphemeBreak( 'f̥̂oobar', 1 ) ).to.equal( 3 ); // 3
		expect( findGraphemeBreak( 'f̥̂oobar', 2 ) ).to.equal( 3 ); // 3
		expect( findGraphemeBreak( 'f̥̂oobar', 3 ) ).to.equal( 3 ); // 3
		expect( findGraphemeBreak( 'நிலைக்கு', 0 ) ).to.equal( 0 ); // 0
		expect( findGraphemeBreak( 'நிலைக்கு', 1 ) ).to.equal( 2 ); // 2
		expect( findGraphemeBreak( 'நிலைக்கு', 2 ) ).to.equal( 2 ); // 2
		expect( findGraphemeBreak( 'நிலைக்கு', 3 ) ).to.equal( 4 ); // 4
	} );

	it( 'should return first break before given offset', () => {
		expect( findGraphemeBreak( 'f̥̂oobar', 2, false ) ).to.equal( 0 );
		expect( findGraphemeBreak( 'நிலைக்கு', 1, false ) ).to.equal( 0 );
		expect( findGraphemeBreak( 'நிலைக்கு', 2, false ) ).to.equal( 2 );
		expect( findGraphemeBreak( 'நிலைக்கு', 3, false ) ).to.equal( 2 );
		expect( findGraphemeBreak( 'நிலைக்கு', 4, false ) ).to.equal( 4 );
	} );
} );
