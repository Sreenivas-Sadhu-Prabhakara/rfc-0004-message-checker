# Message Checker

Compare sent and received messages to spot missing, changed, repeated or reordered messages in a small trace.

**[Open the utility](https://sreenivas-sadhu-prabhakara.github.io/rfc-0004-message-checker/)** · [Source repository](https://github.com/Sreenivas-Sadhu-Prabhakara/rfc-0004-message-checker) · [RFC 4](https://www.rfc-editor.org/rfc/rfc4.txt) · [Official metadata](https://www.rfc-editor.org/info/rfc4) · [Errata](https://www.rfc-editor.org/errata/rfc4)

## Who it helps

Networking learners, teachers and people investigating small message-delivery examples. Analyze two local JSON event lists and explore original clean-delivery, damage, duplication, reordering and recovery-gap examples. Show a readable receipt-by-receipt report and a downloadable summary.

## Run and test

Serve this directory with `python3 -m http.server 8000`, then open http://localhost:8000.
Run `node --test` or `npm test` with Node 22 or newer. No install or build step is needed.
Behavioral tests cover normal outcomes, invalid input, boundary cases and exports.

All processing uses local browser modules with relative URLs. No external fonts,
scripts, runtime dependencies, tracking, uploads or automatic persistence.
The loaded tab continues to calculate and download files offline. Offline reload
is not promised: use a local server to work without a network connection.
Reloading the page resets your inputs; download anything you want to keep.

## Evidence and interpretation

Basis: RFC 4, 5b1–5b3 (test messages and recovery checks); 6b1–6b5 (agree formats, sequences, checks and fault reporting); 6c–6e (integrity, delivery order and delays); 6g–6i and 14a–14d (abnormal conditions and debugging).

Modern schema {id, at, text}, with shared-clock elapsed milliseconds, chronologically ordered arrays and unique sent IDs. Exact JavaScript string equality checks payloads; no checksum or historical wire format is invented. First arrivals of known IDs define ordering and mean delay; later arrivals are duplicates and still receive payload checks. Unexpected IDs have unknown delay. Missing means absent in this finite trace, not proven permanent loss; delay is not RTT or a live measurement. Negative known-message delays, malformed input and oversized traces are rejected.

RFC 4 leaves message formats and checking procedures to agreement. Our JSON schema, shared-clock timing and exact text comparison are modern assumptions. This is not an IMP emulator, wire-protocol test, checksum or live network measurement. Missing means absent in this finite trace, not proven lost; a gap does not prove an outage. Delay is one-way in the chosen clock, not RTT. Counts may overlap when an event has several issues.

Official status: UNKNOWN · Legacy stream. UNKNOWN is not the formal HISTORIC classification. These educational adaptations are not current Internet standards. No formal successor or updating RFC is listed in the retrieved official metadata. The archived text header says Informational; we retain UNKNOWN from the official catalog.

The retrieved official errata search showed no matching records. That does not resolve gaps or typographical errors in the source. Item 2f refers to an absent item 16; it is not treated as a reference to RFC 16. Item 14b repeats the label 14b3. All six text pages, including three ASCII network configurations, were reviewed. No missing protocol detail is filled in.

Source format: plain text. Full assigned source read and SHA-256 checked before planning.
Source SHA-256: `fb9d695bf83d189a747027bc26e8ec9fc801ae47d7c4f9df4b565dde99fc8d22`.
Review timestamp: 2026-10-28T23:33:30.595053+00:00.

## Try an example

Load Mixed faults. Identify the missing ID, the changed payload and the duplicate receipt. Move A before C while keeping timestamps chronological. Which delivery-order warning disappears, and which problems remain?

Expected: The initial mixed trace has missing B, changed A, a duplicate A, unexpected X and one order break. Reordering first arrivals removes the order break, but does not repair the other evidence.

## Publication and contribution

The daily runner tests and publishes this standalone directory to its own public
repository and GitHub Pages site. Canonical and source links use the configured
account. Those links become live after runner publication; this build does not
claim that publication has occurred. Pages serves `main` at `/`; `.nojekyll`
disables Jekyll processing.

`ci/test.yml` is an inactive Actions template. The runner enforces local tests.
The current CLI credential cannot upload `.github/workflows` files; the template
remains under `ci/`.

See [PROMOTION.md](PROMOTION.md) for prepared sharing copy and a teaching exercise.
No outreach is performed. Please report issues with the input, expected behavior,
and supporting RFC section. Original code is MIT licensed. Referenced RFCs retain
their own notices. Independent community project, unaffiliated with the IETF or RFC Editor.
