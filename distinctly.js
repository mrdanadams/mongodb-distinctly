/* distincly.js: MongoDB distinct value counting

This script is a convenience for counting the distinct values in a MongoDB document field.
This is safe to run on any database as it does not modify data.
Note that results are collect in-memory so it may not be ideal for very large datasets or datasets with many, many distinct values.

Usage: $ mongo database --eval="collection='mycollection'; field='foo.bar'; limit=1000" distinctly.js
*/

;

if (typeof collection === "undefined") throw "You must include a collection name";
if (typeof field === "undefined") throw "You must specify a field name to count distinctly";
if (typeof limit === "undefined") var limit = -1;

var total = db[collection].count();
print("Counting distinct values on "+db+"."+collection+"/"+field+" using in-memory counts across "+total+" documents");
var counts = {};
// TODO consider filtering to those documents that have a value for the field
var only = {_id: 0}
only[field] = 1;
var cursor = db[collection].find({}, only);

if (limit > 0) {
  print("Limiting results to the first "+limit+" documents");
  cursor.limit(limit);
}

cursor.forEach(function(doc) {
  var v;

  try {
    v = eval("doc."+field);
    if (typeof v !== "undefined") {
      counts[v] = counts[v] ? counts[v]+1 : 1;
    }
  } catch(e) {}
});

// sort values
var values = [], maxLength = 0;
for(k in counts) {
  values.push(k);
  maxLength = Math.max(maxLength, k.toString().length);
}

values.sort(function(a,b) {
  a = counts[a]; b = counts[b];
  if (a < b) return 1;
  else if (a > b) return -1;
  return 0;
});

function pad(s, n) {
  var a = [];
  n = Math.max(0, n - s.length);
  for(var i=0; i<n; i++) a.push(' ');
  return s+a.join('');
}

print("\nDistinct values and counts on "+db+"."+collection+"/"+field);
for(var i=0; i<values.length; i++)
  print(""+pad(values[i], maxLength)+"\t"+counts[values[i]]);
