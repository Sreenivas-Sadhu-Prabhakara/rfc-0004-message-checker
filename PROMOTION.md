# Sharing kit — Message Checker

Prepared copy only. Share the links after the daily runner verifies publication.

## One-sentence benefit

Compare sent and received messages to spot missing, changed, repeated or reordered messages in a small trace.

## Short share post

Try Message Checker, a free browser tool inspired by RFC 4. Compare sent and received messages to spot missing, changed, repeated or reordered messages in a small trace. Original educational adaptation, open source, no tracking. https://sreenivas-sadhu-prabhakara.github.io/rfc-0004-message-checker/

## Longer community post

How can an early network document help people today? Message Checker turns an idea from
RFC 4, “Network timetable,” into a small tool for networking learners, teachers and people investigating small message-delivery examples.
Analyze two local JSON event lists and explore original clean-delivery, damage, duplication, reordering and recovery-gap examples. Show a readable receipt-by-receipt report and a downloadable summary. Inputs stay in the browser; you can download the result
and continue using the loaded page offline.

RFC 4 leaves message formats and checking procedures to agreement. Our JSON schema, shared-clock timing and exact text comparison are modern assumptions. This is not an IMP emulator, wire-protocol test, checksum or live network measurement. Missing means absent in this finite trace, not proven lost; a gap does not prove an outage. Delay is one-way in the chosen clock, not RTT. Counts may overlap when an event has several issues. The official RFC status is UNKNOWN / Legacy, not HISTORIC;
this is not a current Internet standard. No formal successor or updating RFC is listed in the retrieved official metadata. The archived text header says Informational; we retain UNKNOWN from the official catalog.

Try it: https://sreenivas-sadhu-prabhakara.github.io/rfc-0004-message-checker/
Source and contributions: https://github.com/Sreenivas-Sadhu-Prabhakara/rfc-0004-message-checker
Original document: https://www.rfc-editor.org/rfc/rfc4.txt
Errata: https://www.rfc-editor.org/errata/rfc4

## Small teaching exercise

Load Mixed faults. Identify the missing ID, the changed payload and the duplicate receipt. Move A before C while keeping timestamps chronological. Which delivery-order warning disappears, and which problems remain?

Expected observation: The initial mixed trace has missing B, changed A, a duplicate A, unexpected X and one order break. Reordering first arrivals removes the order break, but does not repair the other evidence.

## Community use

Suitable for a short workshop, a school club or a relevant project discussion.
Invite feedback with a reproducible input and the source section. Adapt this copy
to the community's interests. No messages, posts, analytics or visitor tracking
are sent by the utility or this preparation step.
