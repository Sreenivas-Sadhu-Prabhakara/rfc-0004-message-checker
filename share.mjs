export const $ = id => document.getElementById(id);
export function renderRows(target, rows) {
  target.replaceChildren(...rows.map(values => {
    const row = document.createElement('tr');
    for (const value of values) { const cell = document.createElement('td'); cell.textContent = String(value); row.append(cell); }
    return row;
  }));
}
export function download(filename, content, type = 'text/plain;charset=utf-8') {
  const url = URL.createObjectURL(new Blob([content], {type}));
  const link = document.createElement('a'); link.href = url; link.download = filename;
  document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function wireShare() {
  $('share').addEventListener('click', async () => {
    const message = `${document.title} — ${document.querySelector('meta[name="description"]').content} ${document.querySelector('link[rel="canonical"]').href}`;
    try {
      await navigator.clipboard.writeText(message);
      $('share-status').textContent = 'Explanation copied. You choose where to share it.';
    } catch {
      $('share-fallback').hidden = false; $('share-fallback').value = message;
      $('share-fallback').focus(); $('share-fallback').select();
      $('share-status').textContent = 'Select and copy the explanation below.';
    }
  });
}
