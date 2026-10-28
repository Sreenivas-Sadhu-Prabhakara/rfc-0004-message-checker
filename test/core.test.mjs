import test from 'node:test';
import assert from 'node:assert/strict';
import {analyze, parseLog, examples, reportText} from '../core.mjs';
const event = (id, at, text = 'hi') => ({id, at, text});

test('clean example has three first arrivals and a 30 ms mean delay', () => {
  const r = analyze(examples.clean.sent, examples.clean.received);
  assert.equal(r.delivered, 3); assert.deepEqual(r.missing, []); assert.equal(r.meanDelay, 30);
  assert.deepEqual([r.changed,r.duplicates,r.unexpected,r.orderBreaks],[0,0,0,0]);
  assert.ok(r.rows.every(row => row.flags[0] === 'Matches'));
});
test('mixed example separates missing, changed, duplicate, unexpected and order faults', () => {
  const r = analyze(examples.mixed.sent, examples.mixed.received);
  assert.deepEqual(r.missing, ['B']); assert.equal(r.delivered, 2);
  assert.deepEqual([r.changed,r.duplicates,r.unexpected,r.orderBreaks],[1,1,1,1]);
  assert.equal(r.meanDelay, 45);
  assert.deepEqual(r.rows[1].flags, ['Order break','Changed text']);
  assert.equal(r.rows[3].delay, null);
});
test('a duplicate can be changed without corrupting first-arrival delay statistics', () => {
  const r = analyze([event('A',0)], [event('A',10),event('A',99,'changed')]);
  assert.deepEqual(r.rows[1].flags, ['Duplicate','Changed text']);
  assert.equal(r.meanDelay, 10); assert.equal(r.orderBreaks, 0);
});
test('gaps in expected sequence do not alone imply reordering', () => {
  const r = analyze(examples.gap.sent, examples.gap.received);
  assert.deepEqual(r.missing, ['B']); assert.equal(r.orderBreaks, 0); assert.equal(r.meanDelay, 255);
});
test('a late first arrival behind the highest seen send position is an order break', () => {
  const r = analyze([event('A',0),event('B',0),event('C',0)], [event('C',1),event('A',2),event('B',3)]);
  assert.equal(r.orderBreaks, 2);
});
test('empty traces and missing-only traces avoid invented delay values', () => {
  assert.equal(analyze([],[]).meanDelay, null);
  const r = analyze([event('A',0)], []);
  assert.deepEqual(r.missing,['A']); assert.equal(r.delivered,0); assert.equal(r.meanDelay,null);
  assert.match(reportText(r), /not available/);
});
test('unexpected receipts have no delay; repeated unknown IDs are still unexpected', () => {
  const r = analyze([], [event('X',2),event('X',3)]);
  assert.equal(r.unexpected,2); assert.equal(r.duplicates,0); assert.equal(r.meanDelay,null);
});
test('string equality distinguishes spaces and Unicode normalization forms', () => {
  const r = analyze([event('A',0,'é'), event('B',0,'hi')], [event('A',1,'e\u0301'),event('B',2,'hi ')]);
  assert.equal(r.changed,2);
  assert.equal(analyze([event('__proto__',0,'🌍')],[event('__proto__',0,'🌍')]).changed,0);
});
test('rejects reused send IDs, backwards receipt clocks and unsorted arrays', () => {
  assert.throws(() => analyze([event('A',0),event('A',1)],[]), /duplicate id/);
  assert.throws(() => analyze([event('A',20)],[event('A',19)]), /precedes/);
  assert.throws(() => analyze([event('A',2),event('B',1)],[]), /chronological/);
  assert.throws(() => analyze([], [event('A',2),event('B',1)]), /chronological/);
});
test('malformed JSON and invalid event data are explained without coercion', () => {
  assert.throws(() => parseLog('{oops}'), /valid JSON/);
  for (const value of [null, {}, [null], [event('',0)], [event('A','10')], [event('A',-1)], [event('A',Infinity)], [event('A',0,4)], [event('A',0,'x'.repeat(1001))], [event('A',1e9+1)]]) assert.throws(() => analyze(value, []));
  assert.throws(() => parseLog(JSON.stringify([event('A\nB',0)])), /visible/);
});
test('trace bounds allow exactly 200 events and fractional millisecond timestamps', () => {
  const sent = Array.from({length:200}, (_,i) => event(String(i),i+0.5));
  assert.equal(analyze(sent, sent).delivered,200);
  assert.throws(() => analyze([...sent,event('200',201)],[]), /200/);
  assert.throws(() => parseLog(' '.repeat(300001)), /200/);
});
test('download explains observations and the finite-trace limitation', () => {
  const text = reportText(analyze(examples.mixed.sent, examples.mixed.received));
  assert.match(text, /Missing IDs: B/); assert.match(text, /45.00 ms/);
  assert.match(text, /not proven lost/); assert.match(text, /No network traffic was sent/);
});
