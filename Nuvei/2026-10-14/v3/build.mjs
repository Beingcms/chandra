import fs from 'node:fs';
const root=new URL('./',import.meta.url);
const html=fs.readFileSync(new URL('dist/index.html',root),'utf8');
const css=fs.readFileSync(new URL('dist/styles.css',root),'utf8');
const js=fs.readFileSync(new URL('dist/app.js',root),'utf8');
const result=html.replace('<link rel="stylesheet" href="styles.css">',`<style>${css}</style>`).replace('<script src="app.js"></script>',`<script>${js}</script>`);
fs.writeFileSync(new URL('Nuvei_Whitespace_Demo_2026-10-14_v3.html',root),result);
console.log('Built self-contained v3 HTML');
