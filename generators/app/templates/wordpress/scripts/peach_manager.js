var myArgs = process.argv.slice(2);
console.log('myArgs: ', myArgs);
var http = myArgs[0];
var client = myArgs[1];
var pipeline = myArgs[2];
var stage = myArgs[3];
var domain = myArgs[4];
var dump = myArgs[5];
var newDomain = `${client}.${pipeline}.${stage}.${domain}`;
console.log('dump: ', dump);
const fs = require("fs");
var dbdump = fs.readFileSync(dump).toString();
var Peach = require("./peach.js");

// Changing oldDomain -> newDomain
// We do not specify the http protocol to make sure to catch all occurrences.
var oldDomain = Peach.wp_domain(dbdump); // Helper to get current domain name.
oldDomain = oldDomain.split('//')[1];
if (oldDomain[oldDomain.length-1] === '/') {
    newDomain += '/';
}
var migration = Peach.migrate(dbdump, oldDomain, newDomain);
console.log('oldDomain: ', migration.old_domain);
console.log('newDomain: ', migration.new_domain);
console.log('Number of serializations: ', migration.serialized_count); // Number of serializations.
console.log('Number of replacements: ', migration.replaced_count); // Number of replacements.
console.log('Difference in characters: ', migration.char_diff); // Difference in characters. e.g. -4$

// Changing http -> https
// Doing http:// does not work as some links are escaped, we would have to do it twice. 
// Once with http:// and another time with http:\\\\/\\\\/ ... Instead, we ommit the slashes.
oldDomain = 'http:';
newDomain = 'https:';
migration = Peach.migrate(migration.processed_file(), oldDomain, newDomain);
console.log('oldDomain: ', migration.old_domain);
console.log('newDomain: ', migration.new_domain);
console.log('Number of serializations: ', migration.serialized_count); // Number of serializations.
console.log('Number of replacements: ', migration.replaced_count); // Number of replacements.
console.log('Difference in characters: ', migration.char_diff); // Difference in characters. e.g. -4$

fs.writeFile(dump, migration.processed_file(), function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
});
