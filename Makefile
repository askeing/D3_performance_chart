SHELL := /bin/bash
NODE_BIN := ./node_modules/.bin

$(NODE_BIN)/grunt:
	npm install

.PHONY : clean
clean : $(NODE_BIN)/grunt
	$(NODE_BIN)/grunt clean
	rm -rf ./node_modules/

.PHONY : build
build: $(NODE_BIN)/grunt
	$(NODE_BIN)/grunt

.PHONY : run
run:
	@pushd dest; echo "Starting server on port 8000, you can press Crtl+C to stop it..."; python -m SimpleHTTPServer 8000 2>/dev/null 1>&2; popd
