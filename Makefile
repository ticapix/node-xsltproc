NODE_DIR=$(shell npm root)
TEST_DIR=$(shell pwd)/test
SRC_DIR=$(shell pwd)/src
DIST_DIR=$(shell pwd)/dist

GULP=$(shell npm bin)/gulp
RM=rm -rf

.PHONY: help

help: ## show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

clean: ## remove all created artefacts
	$(RM) $(NODE_DIR)
	$(RM) $(DIST_DIR)

$(NODE_DIR):
	npm install

install-dev: $(NODE_DIR) ## install development dependencies

test: install-dev ## run test
	$(GULP) test --sourcedir $(SRC_DIR) --testdir $(TEST_DIR) --distdir $(DIST_DIR)

$(DIST_DIR): install-dev
	$(GULP) dist --sourcedir $(SRC_DIR) --testdir $(TEST_DIR) --distdir $(DIST_DIR)

dist: $(DIST_DIR) ## test and create a clean distribution folder

publish: clean dist ## clean, test and publish artefact to npm registry
	cd $(DIST_DIR) && npm publish

