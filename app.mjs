import {parseLog, analyze, reportText, examples} from './core.mjs';
import {$, download, renderRows, wireShare} from './share.mjs';
let current;
function update() {
  try {
    current = analyze(parseLog($('sent').value, 'Sent'), parseLog($('received').value, 'Received'));
    $('error').textContent = '';
    $('delivered').textContent = `${current.delivered}/${current.sentCount}`;
    $('delay').textContent = current.meanDelay === null ? '—' : `${current.meanDelay.toFixed(1)} ms`;
    $('status').textContent = current.sentCount === 0 && current.receivedCount === 0 ? 'Empty trace: there is no evidence to check.' : `${current.missing.length} missing IDs · ${current.changed} changed events · ${current.duplicates} duplicates · ${current.unexpected} unexpected events · ${current.orderBreaks} order breaks`;
    $('missing').textContent = current.missing.length ? `Not seen in this trace: ${current.missing.join(', ')}.` : 'No expected IDs are missing from this trace.';
    renderRows($('rows'), current.rows.map(row => [row.id, row.at, row.text, row.flags.join(' · '), row.delay === null ? 'Unknown' : `${row.delay} ms`]));
    $('empty').textContent = current.rows.length ? '' : 'No receipt events to display.';
    $('download').disabled = false;
  } catch (error) {
    current = null; $('error').textContent = error.message;
    $('delivered').textContent = '—'; $('delay').textContent = '—'; $('missing').textContent = '';
    $('rows').replaceChildren(); $('empty').textContent = '';
    $('status').textContent = 'Correct the logs to analyze this trace.'; $('download').disabled = true;
  }
}
function load(name) { $('sent').value = JSON.stringify(examples[name].sent, null, 2); $('received').value = JSON.stringify(examples[name].received, null, 2); update(); }
for (const id of ['sent', 'received']) $(id).addEventListener('input', update);
for (const name of Object.keys(examples)) $(`example-${name}`).addEventListener('click', () => load(name));
$('download').addEventListener('click', () => { if (current) download('message-trace-report.txt', reportText(current)); });
wireShare(); load('clean');
