distinctly.js: MongoDB distinct value counting

This script is a convenience for counting the distinct values in a MongoDB document field.
This is safe to run on any database as it does not modify data.
Note that results are collect in-memory so it may not be ideal for very large datasets or datasets with many, many distinct values.

Usage:

```
$ mongo database --eval="collection='mycollection'; field='foo.bar'; limit=1000" distinctly.js
```

Author: [Dan Adams](http://mrdanadams.com)
