#!/bin/bash
DOCROOT='docs'
WEBROOT='public/docs'
DOCINDEX="$DOCROOT/index.html"

rm -rf $DOCROOT
rm -rf $WEBROOT

docco js/*.js
docco js/modules/*.js
docco js/modules/shared/*.js
docco public/js/*.js

echo "<!DOCTYPE html><html>
<head><title>MVC Lesson 1/</title>
<link rel='stylesheet' media='all' href='docco.css' />
</head>
<body>
<table>
	<thead>
		<tr>
			<th class='docs'>
				<h1>Index</h1>
			</th>
		</tr>
	</thead>
	<tbody>
		<tr id='section-1'><td class='docs'>" > $DOCINDEX

# creating links to the files in directory tree

for i in `find $DOCROOT -name *.html`
do
if test -d $i
then
echo "<tr><td class='docs'><h2>$i</h2><ul>" >> $DOCINDEX
else
echo "<li><a href='/$i'>$i</a></li>" >> $DOCINDEX
fi
done
echo '</ul></td></tr></tbody></table>' >> $DOCINDEX

# creating end tags for HTML

echo "</body>
</html>" >> $DOCINDEX
unset i

mv $DOCROOT $WEBROOT
