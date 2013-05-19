BASE_SRC_FILE=markleft
SRC_FILE=${BASE_SRC_FILE}.js

VERSION_1=$(shell cat markleft.js | grep VERSION | cut -d\' -f2)
VERSION_2=$(shell cat package.json | grep version | cut -d\" -f4)

build: check-version lint minify doc
	@echo 'Build done'

doc: configure
	@node_modules/.bin/docco ${SRC_FILE}
	# @cat docs/header.html > docs/index.html
	# @./tools/Markdown_1.0.1/Markdown.pl --html4tags README.md >> docs/index.html
	# #cat docs/footer.html >> docs/index.html

minify: configure
	@node_modules/.bin/uglifyjs ${SRC_FILE} --lint --compress warnings=true --mangle --output ${BASE_SRC_FILE}.min.js

lint: configure
	@node_modules/.bin/jshint ${SRC_FILE}

test: check-mocha
	@mocha

configure: check-npm
	@npm install

check-mocha:
	@which mocha > /dev/null || ( echo 'Please Install Mocha, http://visionmedia.github.io/mocha/'; exit 1 )

check-npm:
	@which npm > /dev/null || ( echo 'Please Install Node Package Manager, http://nodejs.org/'; exit 1 )

check-version:
	@test "${VERSION_1}" != "${VERSION_2}" && echo ERROR: Version in ${SRC_FILE} and package.json do not correspond. || echo "${BASE_SRC_FILE} version: ${VERSION_1}"
	@test "${VERSION_1}" != "${VERSION_2}" && exit 1 || exit 0

all: build test
	@echo 'OK'

clean:
	@find . -name '*~' -exec rm '{}' ';'
	@rm -fr docs/docco.css docs/index.html docs/${BASE_SRC_FILE}.html docs/public/

publish: check-npm clean build test
	@npm publish
