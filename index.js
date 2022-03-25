const { exec } = require("child_process");
const core = require('@actions/core');

const SENSITIVITY_LEVELS = {
    info: 0,
    low: 1,
    moderate: 2,
    high: 3,
    critical: 4
}
const FOUND = 'found';
const REPORT = 'report';

function getInputs() {
    const inputs = {
        sensitivityLevel: core.getInput('sensitivity-level'),
        production: core.getInput('production')
    };

    console.log(`Running with inputs: ${JSON.stringify(inputs)}`);
    return inputs;
}

function getReport(production) {
    console.log(`Running 'npm audit' command with production flag ${production ? 'on' : 'off'}...`);
    return new Promise((resolve, reject) => {
        exec(`npm audit --registry=https://registry.npmjs.org --json ${production ? '--production' : ''}`, (error, stdout, stderr) => {
            if (error) {
                return reject(error);
            }

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
    return 'There is at least 1 vulnerability in the repo, please fix it.';
}

(async function run() {

    const { sensitivityLevel, production } = getInputs();
    let report;
    try {
        report = await getReport(production);
    } catch (err) {
        core.setFailed(`Failed to run npm audit command. Error: ${err.message}`);
        return;
    }

    if (!isVulnerabilityExists(report, sensitivityLevel)) {
        console.log('All good :)');
        core.setOutput(FOUND, false);
        return;
    }

    console.log("Found vulnerabilities :(")
    core.setOutput(FOUND, true);
    core.setOutput(REPORT, getOutputReport(report))
})();
