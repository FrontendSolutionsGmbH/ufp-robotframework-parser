# ufp-robotframework-parser
Static Overview Generator using Handlebars Template to provide overview of Robotframework Test Runs

# Prerequisites 

For Development Robotframework and generating test data is required.

The script itself is a node.js application


# Usage

It is assumed that test data is organised in a 3 level folder structure, where the semantics should be

Stage->Test->Execution

## Create DCevelopment Test-Data

use the utility script probvided in ./robot `createTestData/sh` to execute some robotframework test runs

## Start Parse

	npm run parse

