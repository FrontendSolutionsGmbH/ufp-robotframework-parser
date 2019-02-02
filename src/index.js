#!/usr/bin/env node
const Handlebars = require('handlebars')
const HandlebarsIntl = require('handlebars-intl');
HandlebarsIntl.registerWith(Handlebars);
const fs = require('fs')
const moment = require('moment')
const path = require('path')
const xml2json = require('xml2json')
const glob = require('glob')
const generateJsonTestReportScan = require('./generateJsonTestReportScan.js')
const argv = require('yargs').string('rootDir').default('rootDir', path.join(process.cwd() + '/robot/testData/')).argv
// console.log('Scanning Folder Structure', process)
console.log('Scanning Folder Structure', argv)

function handleFile(src, dest, data) {
    console.log(`Parsing ${src}`)
    const source = fs.readFileSync(src, 'utf8')
    var template
    var result
    try {
        template = Handlebars.compile(source)
        result = template({data})
    } catch (e) {
        result = source + '\n-------------------UFP ENV HANDLEBARS PARSE ERROR ---------------\n' + e
        console.log(`Error parsing ${src}`)
        console.log(e)
    }

    if (!fs.existsSync(path.dirname(dest))) {
        console.log('Creating dir:', path.dirname(dest))
        mkdirp.sync(path.dirname(dest))
    }
    fs.writeFileSync(dest, result)
    console.log(`Written ${dest}`)
}

var data = generateJsonTestReportScan.getDirectoriesLevel1Data({searchPath: argv.rootDir})
fs.writeFile("data.json", JSON.stringify(data), function (err) {
    if (err) {
        return console.log(err);
    }

    console.log("The file was saved!", "data.json");
});

let parsed = handleFile(process.cwd() + '/handlebars/level1.hbs', 'index.parsed.html', data)
console.log('parsed html is')
