const fs = require('fs');

const SERVER = 'http://localhost:8081';

async function testDashboards() {
    let results = {};
    const suffix = Date.now();

    const r1 = await fetch(`${SERVER}/api/auth/register`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: `houseowner_${suffix}@test.com`, password: "pwd", fullName: "House Owner", role: "HOMEOWNER" })
    });

    const l1 = await fetch(`${SERVER}/api/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: `houseowner_${suffix}@test.com`, password: "pwd" })
    });
    const houseownerToken = (await l1.json()).token;

    const d1 = await fetch(`${SERVER}/api/energy/summary`, {
        headers: { 'Authorization': `Bearer ${houseownerToken}` }
    });
    results.homeowner = { status: d1.status, data: await d1.json() };

    const r2 = await fetch(`${SERVER}/api/auth/register`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: `tech_${suffix}@test.com`, password: "pwd", fullName: "Technician API", role: "TECHNICIAN" })
    });

    const l2 = await fetch(`${SERVER}/api/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: `tech_${suffix}@test.com`, password: "pwd" })
    });
    const techToken = (await l2.json()).token;

    const d2 = await fetch(`${SERVER}/api/technician/tasks`, {
        headers: { 'Authorization': `Bearer ${techToken}` }
    });
    results.technicianTasks = { status: d2.status, data: await d2.json() };

    const d3 = await fetch(`${SERVER}/api/technician/metrics`, {
        headers: { 'Authorization': `Bearer ${techToken}` }
    });
    results.technicianMetrics = { status: d3.status, data: await d3.json() };

    fs.writeFileSync('test_results.json', JSON.stringify(results, null, 2));
    console.log('Saved to test_results.json');
}

testDashboards().catch(console.error);
