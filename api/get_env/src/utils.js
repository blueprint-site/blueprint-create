const path = require('path');
const fs = require('fs');

/**
 * Throws an error if any of the keys are missing from the object
 * @param {*} obj
 * @param {string[]} keys
 * @throws {Error}
 */
function throwIfMissing(obj, keys) {
  const missing = [];
  for (let key of keys) {
    if (!(key in obj) || obj[key] === undefined || obj[key] === null) {
      missing.push(key);
    }
  }
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
}

const staticFolder = path.join(__dirname, '../static');

/**
 * Returns the contents of a file in the static folder
 * @param {string} fileName
 * @returns {string} Contents of static/{fileName}
 */
function getStaticFile(fileName) {
  return fs.readFileSync(path.join(staticFolder, fileName)).toString();
}

/**
 * @param {string} template
 * @param {Record<string, string | undefined>} values
 * @returns {string}
 */
function interpolate(template, values) {
  return template.replace(/{{([^}]+)}}/g, (_, key) => values[key] || '');
}

module.exports = {
  throwIfMissing,
  getStaticFile,
  interpolate,
};
