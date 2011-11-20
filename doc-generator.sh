#!/bin/bash
DOCROOT='docs'

rm -rf $DOCROOT

docco js/*.js
docco js/modules/*.js
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
		<tr id='section-1'><td class='docs'>" > $DOCROOT/index.html

# creating links to the files in directory tree

for i in `find $DOCROOT -name *.html`
do
if test -d $i
then
echo "<tr><td class='docs'><h2>$i</h2><ul>" >> $DOCROOT/index.html
else
echo "<li><a href='/$i'>$i</a></li>" >> $DOCROOT/index.html
fi
done
echo '</ul></td></tr></tbody></table>' >> $DOCROOT/index.html

# creating end tags for HTML

echo "</body>
</html>" >> $DOCROOT/index.html
unset i

mv $DOCROOT/* public/docs/
rm -rf $DOCROOT
