#!/usr/bin/env node
// eslint-disable-next-line no-console
const log = console.log;
const fs = require('fs');

fs.readFile('package.json', (err, data) => {
	if (err) {
		log(err);
	}
  let pkg = JSON.parse(data);

	log(pkg);
});
