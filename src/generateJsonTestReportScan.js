#!/usr/bin/env node

const fs = require('fs')
const moment = require('moment')
const path = require('path')
const xml2json = require('xml2json')
const glob = require('glob')

// console.log('Scanning Folder Structure', process)

var config = {
    robotOutputFile: 'output.xml',
    junitOutputFile: 'xunit.xml',
    maxCount: 25
}

function getTestSuiteRunDataJunit({searchPath}) {
    var time
    console.log("Loading file for index xunit.xml", searchPath)
    let data = fs.readFileSync(path.join(searchPath, config.junitOutputFile))
    var json = JSON.parse(xml2json.toJson(data.toString()));
    // console.log('XML DATA JSON IS ', json);
    // console.log('XML DATA JSON IS ', json.testsuite);
    // console.log('XML DATA JSON IS ', json.testsuite.testcase);

    if (json && json.testsuite && json.testsuite.testcase) {
        time = json.testsuite.testcase.reduce((acc, curr) => acc += Number.parseFloat(curr.time), 0)
        // console.log('Sum Time is ', time)
    }

    return {
        duration: time,
        failures: Number.parseFloat(json.testsuite.failures),
        tests: Number.parseFloat(json.testsuite.tests)

    }
}

function getTestSuiteRunDataRobot({searchPath}) {
    var time
    console.log("Loading file for index output.xml", searchPath)
    let data = fs.readFileSync(path.join(searchPath, config.robotOutputFile))
    var json = JSON.parse(xml2json.toJson(data.toString()));
    // console.log('XML ROBOT DATA JSON IS ', json);
    // console.log('XML ROBOT DATA JSON IS ', json.robot.suite);

    return {
        // name: json.robot.suite.name,
        date: moment(json.robot.generated, 'YYYYMMDD hh:mm:ss').toDate(),
        // date: json.robot.generated
    }
}

function getTestSuiteRunData({searchPath}) {
    var time
    console.log("Loading file for index ", searchPath)
    path.dirname(searchPath)
    return {
        directoryName: path.basename(searchPath),
        path: searchPath.replace(path.resolve(searchPath, '../../..'), '').replace(/\\/g, '/'),
        ...getTestSuiteRunDataRobot({searchPath}),
        ...getTestSuiteRunDataJunit({searchPath})

    }

}

function getDirectoriesLevel3Data({searchPath}) {
    var result = {
        path: searchPath.replace(path.resolve(searchPath, '../..'), '').replace(/\\/g, '/'),

        executions: []
    }
    console.log('Reading Level 3 ', searchPath)
    // at level 3 we expect the data
    var items = fs.readdirSync(searchPath)

    for (var i = 0; i < items.length; i++) {
        try {
            result.executions.push(getTestSuiteRunData({searchPath: path.join(searchPath, items[i])}))
        } catch (e) {
            console.warn(e)
        }
    }

    // sort by date
    if (result.executions.length > 0) {
        result.executions.sort(function (a, b) {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b.date) - new Date(a.date);
        });
    }

    // crop
    result.executions = result.executions.slice(0, config.maxCount)

    // calc average
    if (result.executions.length > 0) {
        result.averageDuration = result.executions.reduce((acc, curr) => {
            return acc + curr.duration
        }, 0) / result.executions.length
    }
    return result
}

function getDirectoriesLevel2Data({searchPath}) {
    var result = {

        path: searchPath.replace(path.resolve(searchPath, '../'), '').replace(/\\/g, '/'),
        suites: {}
    }
    console.log('Reading Level 2 ', searchPath)

    var items = fs.readdirSync(searchPath)
    for (var i = 0; i < items.length; i++) {
        console.log(items[i]);
        result.suites[items[i]] = getDirectoriesLevel3Data({searchPath: path.join(searchPath, items[i])})
    }
    return result
}

function getDirectoriesLevel1Data({searchPath}) {

    console.log('Reading Level 1 ', searchPath)
    var result = {}
    var items = fs.readdirSync(searchPath)

    for (var i = 0; i < items.length; i++) {
        console.log(items[i]);
        result[items[i]] = getDirectoriesLevel2Data({searchPath: path.join(searchPath, items[i])})

    }
    return result

}

module.exports = {
    getDirectoriesLevel1Data

}
