srcdir = src
outdir = bin

export PATH := $(CURDIR)/node_modules/.bin:$(PATH)

.PHONY: all
all: build

.PHONY: clean
clean:
	rm -rf -- coverage $(outdir)

.PHONY: build
build:
	@mkdir -p $(outdir)
	babel --copy-files --out-dir $(outdir) $(srcdir)

.PHONY: test
test: build
	rm -rf coverage
	DEBUG=y BABEL_ENV=test istanbul cover _mocha -- $(patsubst %, --grep "^(%)", $(tests)) --require babel-polyfill --use_strict --slow 1000 --timeout 10000 $(outdir)/test
