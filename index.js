const { exec } = require("child_process");
const core = require('@actions/core');

const FOUND = 'found';
const REPORT = 'report';

function getReport() {
    console.log('Running `npm audit` command...');
    return new Promise((resolve, reject) => {
        exec("npm audit --registry=https://registry.npmjs.org --json", (error, stdout, stderr) => {
            console.log(`Command result:\n${stdout}`);
            resolve(JSON.parse(stdout));
        });

    })
}

function isVulnerabilityExists(report, sensitivityLevel = 'moderate') {
    const vulnerabilities = report.metadata.vulnerabilities;
    const levels = Object.keys(vulnerabilities);
    for (let i = 0; i < levels.length; i++) {
        const level = levels[i];
        if (vulnerabilities[level]) {
            return true;
        }
    }
    return false;
}

function getOutputReport(report) {
    return 'Please fix it.';
}

(async function run() {

    const sensitivityLevel = core.getInput('sensitivity-level');

    const report = await getReport();
    if (!isVulnerabilityExists(report, sensitivityLevel)) {
        console.log('all good');
        core.setOutput(FOUND, false);
        return;
    }

    core.setOutput(FOUND, true);
    core.setOutput(REPORT, getOutputReport(report))
})();
