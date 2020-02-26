#!/usr/bin/env node

const fs = require('fs');
const merge = require('lodash.merge');
const co = require('co');
const npminstall = require('npminstall');
const jsonfile = require('jsonfile');
const eslintJson = require('./.eslintrc.json');
const settingsJson = require('./.vscode/settings.json');

/* eslint-disable no-console */

const error = console.error;
const log = console.log;

/* eslint-disable no-console */

// check if json exists
// if yes, merge
// if no, generate
const mergeJson = (jsonFileName, jsonObj) => {
	if(fs.existsSync(jsonFileName)){
		jsonfile.readFile(jsonFileName, (err, data) => {
			if(err) {
				error(err);
			}

			// merge
			data = merge(data, jsonObj);
			jsonfile.writeFile(jsonFileName, data, { EOL: '\n', spaces: 2 })
				.then((res) => {
					if(!res) {
						log(`${jsonFileName} is modified.`);
					}
				})
				.catch((e) => error(e));
		});
	} else {
		// generate
		jsonfile.writeFile(jsonFileName, jsonObj, { EOL: '\n', spaces: 2 })
			.then((res) => {
				if(!res){
					log(`${jsonFileName} is added.`);
				}
			})
			.catch((e) => error(e.stack));
	}
};

const file = 'package.json';

// read package.json
jsonfile.readFile(file, (err, data) => {
	if (err) {
		error(err.stack);
	}
	// read devDependencies, create if not exist
	let devDependencies = data.devDependencies ? data.devDependencies : {};

	if(!devDependencies['babel-eslint']) {
		devDependencies['babel-eslint'] = '^10.0.3';
	}

	if(!devDependencies['eslint']) {
		devDependencies['eslint'] = '^6.8.0';
	}

	if(!devDependencies['eslint-plugin-react']) {
		devDependencies['eslint-plugin-react'] = '^7.18.3';
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
			
			// install
			co(function* () {
				yield npminstall({
					root: process.cwd()
				});
			}).catch((e) => {
					error(e.stack);
			});
		})
		.catch((e) => error(e.stack));
});

// Merge or generate .eslintrc.json 
mergeJson('./.eslintrc.json', eslintJson);

// Merge or generate .vscode/settings.json 
const vscodeDir = './.vscode';
if(!fs.existsSync(vscodeDir)) {
	fs.mkdirSync(vscodeDir);
}
mergeJson(`${vscodeDir}/settings.json`, settingsJson);
