This is an endorsement graphic generator created by Dan Wood (twitter: @danwood) originally started for people to show endorsement political candidates, but generalized for other realms as well.

This web tool is really just a single HTML page, with supporting files of JavaScript, CSS, and images. There is no server-side component - no data are collected. All the processing happens on the visitor's browser.

It is implemented as PHP, really just for convenience for testing. It's possible to pre-load the form by specifying inputs in the URL, such as:
https://iEndorseWhomever.com/?fullname=Bernie&where=Burlington,+VT&reason=4&test=1

You'd specify (with spaces escaped to "+") values for fullname, where, reason (a number, starting with 1, corresponding to the choice). You can also specify test=1 to allow the avatar upload to be bypassed and a placeholder used instead. This makes testing much easier

It would be easy to strip out the PHP and just serve a plain HTML file.

Contents of this directory:

classes/ - holds a PHP file with some convenience methods.
config.codekit3 - configuration for CodeKit app, which manages compiling files
css/ - CSS files for this tool. Source files (.scss) are in SASS format, and compiled to CSS by CodeKit on the Mac. The final file needed is main.css.
img/ - storage of images related to this tool
index.php - destination file compiled from index.php.pug
index.php.pug - the source of the web app, in .pug format, compiled to HTML - I used CodeKit on the Mac for doing that.
js/ - contains main.js and plugins.js which are used by this project. Also a local copy of jquery.
README.txt - this file
Website.sublime-project - I use Sublime Text Editor; this is just the project file.