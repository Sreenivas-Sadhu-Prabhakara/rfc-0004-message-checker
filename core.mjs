// Original event schema. RFC 4 describes test objectives, not this log format.
export function parseLog(text, label = 'Log') {
  if (typeof text !== 'string' || text.length > 300000) throw new Error(`${label}: use a JSON array with at most 200 events.`);
  let log;
  try { log = JSON.parse(text); } catch { throw new Error(`${label}: enter valid JSON, including quoted property names.`); }
  validateLog(log, label);
  return log;
}

function validateLog(log, label) {
  if (!Array.isArray(log) || log.length > 200) throw new Error(`${label}: use an array of at most 200 events.`);
  let previous = -1;
  for (const [index, event] of log.entries()) {
    const prefix = `${label}, event ${index + 1}`;
    if (!event || typeof event !== 'object' || Array.isArray(event)) throw new Error(`${prefix}: expected {id, at, text}.`);
    if (typeof event.id !== 'string' || !event.id.trim() || event.id.length > 80 || /[\u0000-\u001f\u007f]/.test(event.id)) throw new Error(`${prefix}: id must be 1–80 visible characters.`);
    if (!Number.isFinite(event.at) || event.at < 0 || event.at > 1e9) throw new Error(`${prefix}: at must be elapsed milliseconds from 0 to 1,000,000,000.`);
    if (event.at < previous) throw new Error(`${prefix}: events must be in chronological order (nondecreasing at).`);
    if (typeof event.text !== 'string' || event.text.length > 1000) throw new Error(`${prefix}: text must be a string of up to 1,000 characters.`);
    previous = event.at;
  }
}

export function analyze(sent, received) {
  validateLog(sent, 'Sent'); validateLog(received, 'Received');
  const expected = new Map();
  sent.forEach((event, index) => {
    if (expected.has(event.id)) throw new Error(`Sent: duplicate id ${event.id}. Use a unique id for each send.`);
    expected.set(event.id, { ...event, index });
  });
  const seen = new Set(), delays = [];
  let highWater = -1, duplicates = 0, changed = 0, unexpected = 0, orderBreaks = 0;
  const rows = received.map(event => {
    const source = expected.get(event.id);
    const flags = [];
    let delay = null;
    if (!source) { flags.push('Unexpected ID'); unexpected++; }
    else {
      delay = event.at - source.at;
      if (delay < 0) throw new Error(`Received ${event.id} precedes its send. Use the same elapsed-time clock in both logs.`);
      const duplicate = seen.has(event.id);
      if (duplicate) { flags.push('Duplicate'); duplicates++; }
      else {
        seen.add(event.id); delays.push(delay);
        if (source.index < highWater) { flags.push('Order break'); orderBreaks++; }
        highWater = Math.max(highWater, source.index);
      }
      if (source.text !== event.text) { flags.push('Changed text'); changed++; }
      if (!flags.length) flags.push('Matches');
    }
    return { ...event, delay, flags };
  });
  const missing = sent.filter(event => !seen.has(event.id)).map(event => event.id);
  return { sentCount: sent.length, receivedCount: received.length, delivered: seen.size, missing, duplicates, changed, unexpected, orderBreaks, meanDelay: delays.length ? delays.reduce((a, b) => a + b, 0) / delays.length : null, rows };
}

export function reportText(result) {
  return [
    'MESSAGE TRACE REPORT — modern educational format inspired by RFC 4',
    `Unique expected IDs seen: ${result.delivered}/${result.sentCount}. Receipt events: ${result.receivedCount}.`,
    `Missing IDs: ${result.missing.length ? result.missing.join(', ') : 'none'}.`,
    `Changed payload events: ${result.changed}. Duplicate expected-ID events: ${result.duplicates}.`,
    `Unexpected-ID events: ${result.unexpected}. First-arrival order breaks: ${result.orderBreaks}.`,
    `Mean first-arrival delay: ${result.meanDelay === null ? 'not available' : result.meanDelay.toFixed(2) + ' ms'}.`,
    '',
    ...result.rows.map(row => `${row.id} at ${row.at} ms: ${row.flags.join('; ')}; delay ${row.delay === null ? 'unknown' : row.delay + ' ms'}.`),
    '',
    'Assumptions: shared elapsed-time clock; unique sent IDs; exact text equality; input order breaks ties.',
    'Mean delay includes changed first arrivals. Unexpected IDs and duplicates do not enter that mean.',
    'Missing means absent from this finite trace, not proven lost. No network traffic was sent.',
    ''
  ].join('\n');
}

const sent = [{id: 'A', at: 0, text: 'Hello'}, {id: 'B', at: 10, text: 'From the library'}, {id: 'C', at: 20, text: 'Goodbye'}];
export const examples = {
  clean: {sent, received: [{id: 'A', at: 30, text: 'Hello'}, {id: 'B', at: 40, text: 'From the library'}, {id: 'C', at: 50, text: 'Goodbye'}]},
  mixed: {sent, received: [{id: 'C', at: 50, text: 'Goodbye'}, {id: 'A', at: 60, text: 'Hallo'}, {id: 'A', at: 70, text: 'Hello'}, {id: 'X', at: 80, text: 'Unrecognized'}]},
  gap: {sent, received: [{id: 'A', at: 30, text: 'Hello'}, {id: 'C', at: 500, text: 'Goodbye'}]}
};
