/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* jshint browser: false, node: true, strict: true */

'use strict';

const path = require( 'path' );
const gulp = require( 'gulp' );

const config = {
	ROOT_DIR: '.',
	WORKSPACE_DIR: '..',

	// Files ignored by jshint and jscs tasks. Files from .gitignore will be added automatically during tasks execution.
	IGNORED_FILES: [
		'src/lib/**'
	],

	// Path where compiled files will be saved.
	BUILD_DIR: '.build'
};

const ckeditor5Lint = require( '@ckeditor/ckeditor5-dev-lint' )( config );

gulp.task( 'lint', ckeditor5Lint.lint );
gulp.task( 'lint-staged', ckeditor5Lint.lintStaged );
gulp.task( 'pre-commit', [ 'lint-staged' ] );

const ckeditor5DevTests = require( '@ckeditor/ckeditor5-dev-tests' );

gulp.task( 'test', () => {
	const options = ckeditor5DevTests.utils.parseArguments();
	options.rootPath = path.resolve( config.BUILD_DIR );

	if ( !options.paths ) {
		options.paths = [
			ckeditor5DevTests.utils.getPackageName()
		];
	}

	return ckeditor5DevTests.tests.test( options );
} );
