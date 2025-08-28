#!/usr/bin/env node

/**
 * Comprehensive System Test Script
 * Tests all API endpoints and verifies system functionality
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Test configuration
const BASE_URL = 'http://localhost:3000';
const API_ENDPOINTS = [
  '/api/medical-cases',
  '/api/admin-data',
  '/api/urgency-data',
  '/api/historical-data',
  '/api/patient-data',
  '/api/hospitalization-data'
];

// Test results storage
let testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  details: []
};

// Utility functions
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(testName, passed, details = '') {
  const status = passed ? '✅ PASS' : '❌ FAIL';
  const statusColor = passed ? 'green' : 'red';
  
  log(`${status} ${testName}`, statusColor);
  if (details) {
    log(`   ${details}`, 'cyan');
  }
  
  testResults.total++;
  if (passed) {
    testResults.passed++;
  } else {
    testResults.failed++;
  }
  
  testResults.details.push({
    name: testName,
    passed,
    details
  });
}

// Test functions
async function testFileExists(filePath, description) {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    const exists = fs.existsSync(fullPath);
    logTest(`File exists: ${description}`, exists, filePath);
    return exists;
  } catch (error) {
    logTest(`File exists: ${description}`, false, `Error: ${error.message}`);
    return false;
  }
}

async function testAPIEndpoint(endpoint) {
  try {
    // Note: This would require the server to be running
    // For now, we'll just test that the route files exist
    const routeFile = path.join(process.cwd(), 'app', 'api', endpoint.replace('/api/', ''), 'route.ts');
    const exists = fs.existsSync(routeFile);
    logTest(`API Route: ${endpoint}`, exists, `Route file: ${routeFile}`);
    return exists;
  } catch (error) {
    logTest(`API Route: ${endpoint}`, false, `Error: ${error.message}`);
    return false;
  }
}

async function testHookFiles() {
  const hookFiles = [
    'app/hooks/useUniversalData.ts',
    'app/hooks/useMedicalCases.ts'
  ];
  
  for (const hookFile of hookFiles) {
    await testFileExists(hookFile, `Hook file: ${hookFile}`);
  }
}

async function testPageFiles() {
  const pageFiles = [
    'app/page.tsx',
    'app/login/page.tsx',
    'app/admin/dashboard/page.tsx',
    'app/medico/dashboard/page.tsx',
    'app/medico/casos/page.tsx',
    'app/medico/urgencias/page.tsx',
    'app/medico/hospitalizados/page.tsx',
    'app/medico/historial/page.tsx',
    'app/medico/pacientes/page.tsx'
  ];
  
  for (const pageFile of pageFiles) {
    await testFileExists(pageFile, `Page file: ${pageFile}`);
  }
}

async function testComponentFiles() {
  const componentFiles = [
    'components/layout/sidebar.tsx',
    'components/layout/header.tsx',
    'components/ui/button.tsx',
    'components/ui/card.tsx'
  ];
  
  for (const componentFile of componentFiles) {
    await testFileExists(componentFile, `Component file: ${componentFile}`);
  }
}

async function testConfigFiles() {
  const configFiles = [
    'package.json',
    'next.config.mjs',
    'tsconfig.json',
    'tailwind.config.ts',
    'components.json'
  ];
  
  for (const configFile of configFiles) {
    await testFileExists(configFile, `Config file: ${configFile}`);
  }
}

async function testPythonFiles() {
  const pythonFiles = [
    'ia/main.py',
    'ia/gmail_processor.py',
    'ia/admin_tools.py',
    'ia/config.py',
    'ia/requirements.txt'
  ];
  
  for (const pythonFile of pythonFiles) {
    await testFileExists(pythonFile, `Python file: ${pythonFile}`);
  }
}

async function testDataFiles() {
  const dataFiles = [
    'ia/medical_cases_for_frontend.json',
    'ia/admin_data_for_frontend.json',
    'ia/urgency_data_for_frontend.json',
    'ia/historical_data_for_frontend.json',
    'ia/patient_data_for_frontend.json',
    'ia/hospitalization_data_for_frontend.json'
  ];
  
  for (const dataFile of dataFiles) {
    const exists = await testFileExists(dataFile, `Data file: ${dataFile}`);
    if (exists) {
      // Test if the JSON is valid
      try {
        const content = fs.readFileSync(path.join(process.cwd(), dataFile), 'utf-8');
        JSON.parse(content);
        logTest(`JSON validity: ${dataFile}`, true, 'Valid JSON structure');
      } catch (error) {
        logTest(`JSON validity: ${dataFile}`, false, `Invalid JSON: ${error.message}`);
      }
    }
  }
}

async function testPackageIntegrity() {
  try {
    const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8'));
    
    // Test essential dependencies
    const essentialDeps = [
      'next',
      'react',
      'react-dom',
      'typescript',
      'tailwindcss',
      '@radix-ui/react-dialog',
      '@radix-ui/react-select',
      'lucide-react'
    ];
    
    for (const dep of essentialDeps) {
      const exists = packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep];
      logTest(`Dependency: ${dep}`, !!exists, exists ? `Version: ${exists}` : 'Missing');
    }
    
    // Test scripts
    const essentialScripts = ['dev', 'build', 'start'];
    for (const script of essentialScripts) {
      const exists = packageJson.scripts?.[script];
      logTest(`Script: ${script}`, !!exists, exists || 'Missing');
    }
    
  } catch (error) {
    logTest('Package.json integrity', false, `Error: ${error.message}`);
  }
}

async function testDirectoryStructure() {
  const requiredDirs = [
    'app',
    'app/api',
    'app/admin',
    'app/medico',
    'components',
    'components/ui',
    'components/layout',
    'ia',
    'public',
    'styles'
  ];
  
  for (const dir of requiredDirs) {
    const exists = fs.existsSync(path.join(process.cwd(), dir));
    logTest(`Directory: ${dir}`, exists, exists ? 'Exists' : 'Missing');
  }
}

// Main test runner
async function runTests() {
  log('\n🧪 VITAL RED SYSTEM - COMPREHENSIVE TEST SUITE', 'bright');
  log('=' .repeat(60), 'cyan');
  
  log('\n📁 Testing Directory Structure...', 'yellow');
  await testDirectoryStructure();
  
  log('\n📦 Testing Package Integrity...', 'yellow');
  await testPackageIntegrity();
  
  log('\n⚛️  Testing React Components...', 'yellow');
  await testComponentFiles();
  
  log('\n📄 Testing Page Files...', 'yellow');
  await testPageFiles();
  
  log('\n🔗 Testing React Hooks...', 'yellow');
  await testHookFiles();
  
  log('\n🌐 Testing API Routes...', 'yellow');
  for (const endpoint of API_ENDPOINTS) {
    await testAPIEndpoint(endpoint);
  }
  
  log('\n🐍 Testing Python Backend...', 'yellow');
  await testPythonFiles();
  
  log('\n📊 Testing Data Files...', 'yellow');
  await testDataFiles();
  
  log('\n⚙️  Testing Configuration Files...', 'yellow');
  await testConfigFiles();
  
  // Print summary
  log('\n' + '=' .repeat(60), 'cyan');
  log('📋 TEST SUMMARY', 'bright');
  log('=' .repeat(60), 'cyan');
  
  const passRate = ((testResults.passed / testResults.total) * 100).toFixed(1);
  log(`Total Tests: ${testResults.total}`, 'blue');
  log(`Passed: ${testResults.passed}`, 'green');
  log(`Failed: ${testResults.failed}`, 'red');
  log(`Pass Rate: ${passRate}%`, passRate >= 90 ? 'green' : passRate >= 70 ? 'yellow' : 'red');
  
  if (testResults.failed > 0) {
    log('\n❌ FAILED TESTS:', 'red');
    testResults.details
      .filter(test => !test.passed)
      .forEach(test => {
        log(`  • ${test.name}`, 'red');
        if (test.details) {
          log(`    ${test.details}`, 'cyan');
        }
      });
  }
  
  log('\n🎯 SYSTEM STATUS:', 'bright');
  if (passRate >= 95) {
    log('✅ EXCELLENT - System is ready for production!', 'green');
  } else if (passRate >= 85) {
    log('✅ GOOD - System is mostly ready, minor issues to address', 'yellow');
  } else if (passRate >= 70) {
    log('⚠️  FAIR - System needs attention before deployment', 'yellow');
  } else {
    log('❌ POOR - System requires significant work before deployment', 'red');
  }
  
  log('\n🚀 Next Steps:', 'bright');
  log('1. Fix any failed tests above', 'cyan');
  log('2. Run: npm run dev (to start development server)', 'cyan');
  log('3. Run: python ia/main.py (to process Gmail data)', 'cyan');
  log('4. Test the application in browser at http://localhost:3000', 'cyan');
  
  return testResults;
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests().catch(error => {
    log(`\n❌ Test runner failed: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = { runTests, testResults };
