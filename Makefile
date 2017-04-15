src = src
bin = bin
test = test

MAKEFLAGS += -srR

in = $(wildcard $(src)/*.js $(src)/*/*.js)
out = $(in:$(src)/%=$(bin)/%)

.PHONY: all
all: build test

.PHONY: clean
clean:
	rm -rf -- $(bin) $(test)

.PHONY: build
build: $(out)

.PHONY: test
test: build $(test)/index.js $(test)/test.js
	mocha

$(out): $(bin)/%: $(src)/%
	@mkdir -p $(@D)
	babel --source-maps inline --presets latest -o $@ $^

$(test)/index.js: $(test)/test.js
	@mkdir -p $(@D)
	printf "%s\n" '#!/usr/bin/env nodejs' 'require("source-map-support").install();' 'require("babel-polyfill");' 'require("./test");' > $@

$(test)/%.js: $(bin)/%.js
	@mkdir -p $(@D)
	cp $< $@
