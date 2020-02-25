#!/usr/bin/env node

/* eslint-disable no-console */

const error = console.error;
const log = console.log;

/* eslint-disable no-console */

const jsonfile = require('jsonfile');

const file = 'package.json';

// read package.json
jsonfile.readFile(file, (err, data) => {
	if (err) {
		error(err);
	}
	// read devDependencies, create if not exist
	let devDependencies = data.devDependencies ? data.devDependencies : {};

	if(!devDependencies['babel-eslint']) {
		devDependencies['babel-eslint'] = '^10.0.3';
	}

	if(!devDependencies['eslint']) {
		devDependencies['eslint'] = '^6.8.0';
	}

	// sort by keys
	const keys = Object.keys(devDependencies).sort();

	data.devDependencies = {};

	for(let key of keys) {
		data.devDependencies[key] = devDependencies[key];
	}

	// edit package.json
	jsonfile.writeFile(file, data, { EOL: '\n', spaces: 2 })
		.then((res) => {
			if(!res)
			log(`${file} is changed.`);
		})
		.catch((e) => error(e))
});