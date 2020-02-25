#!/usr/bin/env node

/* eslint-disable no-console */

const error = console.error;
const log = console.log;

/* eslint-disable no-console */

const jsonfile = require('jsonfile');

jsonfile.readFile('package.json', (err, data) => {
	if (err) {
		error(err);
	}

	log(data);
});
