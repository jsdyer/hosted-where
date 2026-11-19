import test from 'node:test';import assert from 'node:assert/strict';import {parseMX,subset} from '../web/model.mjs';
test('parse dig and JSON while keeping relay and residency separate',()=>{
 assert.equal(parseMX('dal.ca. 300 IN MX 0 dal-ca.mail.protection.outlook.com.')[0].provider,'Microsoft Exchange Online Protection');
 assert.equal(parseMX('{"Answer":[{"type":1,"data":"a"},{"type":15,"data":"0 ."}]}')[0].host,'.');assert.deepEqual(parseMX('no record'),[]);
 assert.equal(parseMX('4 fakeoutlook.com')[0].provider,'Provider unclassified');
});
test('location filter includes only supported statements',()=>{
 const rows=[{region:'NS',location:'Unspecified'},{region:'BC',location:'Canada at rest'}];
 assert.equal(subset(rows,'','known').length,1);assert.equal(subset(rows,'BC','unknown').length,0);
});
