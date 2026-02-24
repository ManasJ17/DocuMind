const fs = require('fs');
const path = require('path');
const pdfParseLib = require('pdf-parse');

const pdfPath = path.join(__dirname, '..', '..', 'analysis.pdf');
const dataBuffer = fs.readFileSync(pdfPath);
const uint8Array = new Uint8Array(dataBuffer);

console.log('Testing PDFParse with Uint8Array...');

try {
    const instance = new pdfParseLib.PDFParse(uint8Array);

    if (typeof instance.getText === 'function') {
        const result = instance.getText();
        if (result && typeof result.then === 'function') {
            result.then(text => {
                console.log('SUCCESS: Text extracted!');
                console.log('Type of result:', typeof text);
                console.log('Result keys:', text ? Object.keys(text) : 'null');
                console.log('Result content:', JSON.stringify(text).substring(0, 200));
            }).catch(console.error);
        } else {
            console.log('SUCCESS: Text extracted synchronously!');
            console.log('Text length:', result ? result.length : 0);
            console.log('Text preview:', result ? result.substring(0, 100) : 'NO TEXT');
        }
    } else {
        console.error('getText() not found on instance');
    }

} catch (e) {
    console.error('Test failed:', e.message);
}
