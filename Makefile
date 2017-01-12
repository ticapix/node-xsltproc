NODE_DIR=$(shell npm root)
TEST_DIR=$(shell pwd)/test
SRC_DIR=$(shell pwd)/src
DIST_DIR=$(shell pwd)/dist

GULP=$(shell npm bin)/gulp
RM=rm -rf

.PHONY: help

help: ## show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

test: install-dev ## run test
	$(GULP) test

install-dev: $(NODE_DIR) ## install development dependencies

$(NODE_DIR):
	npm install

dist: clean install-dev ## create a clean distribution folder
	$(GULP) dist

clean: ## remove locally created artefact
	$(RM) $(NODE_DIR)
	$(RM) $(DIST_DIR)
