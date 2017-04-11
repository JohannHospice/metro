'use strict'

const fs = require('fs')

module.exports = {
	readAsset: path => fs.readFileSync(`assets/${path}`, 'utf8'),
	doTimer: operation => new Promise((resolve, err) => {
		let start, end, result
		start = new Date().getTime()
		result = operation()
		end = new Date().getTime()
		resolve({
			time: end - start,
			result
		})
	}),
	//levenstheign
	distance: function(a, b) {
		var str1 = a.trim().toLowerCase();
		var str2 = b.trim().toLowerCase();

		if (str1.length == 0) return str2.length;
		if (str2.length == 0) return str1.length;

		var matrix = [], i, j;

		for (i = 0; i <= str2.length; i++) matrix[i] = [i];
		for (j = 0; j <= str1.length; j++) matrix[0][j] = j;

		for (i = 1; i <= str2.length; i++) for (j = 1; j <= str1.length; j++) {
			if (str2.charAt(i - 1) == str1.charAt(j - 1)) matrix[i][j] = matrix[i - 1][j - 1];else {
				var insertion = matrix[i][j - 1] + 1;
				var deletion = matrix[i - 1][j] + 1;
				var substitution = matrix[i - 1][j - 1] + 1;

				matrix[i][j] = Math.min(substitution, Math.min(insertion, deletion));
			}
		}

		return matrix[str2.length][str1.length];
	}
}
