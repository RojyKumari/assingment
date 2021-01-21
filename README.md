# Introduction
This is a click processor script which reads array of clicks as input from click.json and apply following conditions on the data and write result set to resultset.json.

1. For each IP within each one hour period, only the most expensive click is placed into the
result set.
2. If more than one click from the same IP ties for the most expensive click in a one hour
period, only place the earliest click into the result set.
3. If there are more than 10 clicks for an IP in the overall array of clicks, do not include any
of those clicks in the result set.

# Performance
Time complexity of this program is O(n)


# Dependency
All the dependencies can be installed with npm install command. External dependencies has been kept at minimal to keep the script light-weight and performant

* [Mocha](https://mochajs.org/) - Mocha is a feature-rich JavaScript test framework running on Node. js and in the browser. This has been added as a dev dependency to write and execute tests.

# Scripts

* **npm run solution** - To run solution
* **npm run test** - To run test
