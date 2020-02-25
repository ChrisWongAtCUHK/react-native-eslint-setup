#!/usr/bin/env node

/* eslint-disable no-console */

const fs = require('fs');
const merge = require('lodash.merge');
const eslintJson = require('./.eslintrc.json');
const error = console.error;
const log = console.log;

/* eslint-disable no-console */

const file = 'package.json';
let jsonfile = require('jsonfile');

// Generate .eslintrc.json if necessary

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
			log(`${file} is modified.`);
		})
		.catch((e) => error(e));
});

// check if .eslintrc.json exists
// if yes, merge
// if no, generate
const eslintJsonName = './.eslintrc.json';

if(fs.existsSync(eslintJsonName)){
	jsonfile.readFile(eslintJsonName, (err, data) => {
		if(err) {
			error(err);
		}

		// merge
		data = merge(data, eslintJson);
		jsonfile.writeFile(eslintJsonName, data, { EOL: '\n', spaces: 2 })
			.then((res) => {
				if(!res) {
					log(`${eslintJsonName} is modified.`);
				}
			})
			.catch((e) => error(e));
	});
} else {
	jsonfile.writeFile(eslintJsonName, eslintJson, { EOL: '\n', spaces: 2 })
		.then((res) => {
			if(!res){
				log(`${eslintJsonName} is added.`);
			}
		})
		.catch((e) => error(e));
}
