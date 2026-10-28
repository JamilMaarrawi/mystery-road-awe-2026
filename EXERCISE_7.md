# Exercise 7 — WebSockets & Multiuser Applications

This is the seventh exercise in Advanced Web Engineering Course (CSDC). It builds on Exercises 3–6. The app should be fully React, backed by Exercise 6's Node REST server. This exercise adds a **real-time, multiuser Workspace**: several people, in different browser tabs/machines, working on
the same investigation at the same time, seeing each other's bookmarks, notes, and hypothesis-draft changes live.

**Scope, deliberately kept small:**
- No sign-in. Each connection is assigned a random display name on join. That's the whole identity model.
- No server-side persistence. The server holds the shared Workspace state **in memory only**, for as long as it's running. If it restarts, everyone starts over. Sessions are spawned dynamically: the server doesn't need a database, a session store, or anything durable.
- **A single shared Workspace.** Everyone who connects joins the same live session. There's no
multi-room selection UI to build. You will still implement the *mechanism* for scoping messages to a session (not just broadcast-to-everyone-blindly), because that mechanism is what "rooms" is actually teaching.It just always resolves to one session for this app.
- What's collaborative: **bookmarks, notes, and the hypothesis draft.** All three now sync live.
Real collaborative text editing is hard in general, this exercise deliberately uses a much simpler strategy instead: a soft "someone's editing this" indicator, plus last-write-wins with a visible conflict warning if two people saved without seeing each other's change. That is what "basic conflict-handling strategies" means here. You are not building a merge algorithm.

## Corresponding manuscript reading

This exercise corresponds to the following chapters in the course manuscript:

- **Chapter 23, WebSocket Foundations** — PDF pp. 168–175
- **Chapter 24, Designing a Multiuser Message Architecture** — PDF pp. 176–184
- **Chapter 25, Reliability and Security in Real-Time Applications** — PDF pp. 185–191

## Self-Check

The exercise is organized into 10 individual tasks with corresponding questions, that are
presented in class. 

These checkboxes are for self-checking. Don't forget to do the actual checking of tasks you are able to present in the Moodle course. **Before class, tick only what you can genuinely demonstrate or answer on the spot, live.**

| # | Demo | Ready? |
|---|---|---|
| 1 | HTTP request-response vs. persistent connections | ☐ |
| 2 | WebSocket lifecycle | ☐ |
| 3 | Presence | ☐ |
| 4 | Typed message protocol | ☐ |
| 5 | Rooms/documents & session scoping | ☐ |
| 6 | Live bookmarks (client-server event flow) | ☐ |
| 7 | Live notes: editing indicators & conflict handling | ☐ |
| 8 | Live hypothesis draft: optimistic UI | ☐ |
| 9 | Reconnection, heartbeats & message ordering | ☐ |
| 10 | Authentication & validation boundaries + wrap-up | ☐ |

A demo only counts as "Ready" once **every** task and question checkbox inside it (below) is
ticked — the table above is just a fast overview, tick the boxes inside each demo first.

---

## Demo 1 — HTTP request-response vs. persistent connections

**Tasks**

- [ ] Illustrate a short comparison: for a normal `fetch()` request (like the ones Exercise 6 already does) versus a WebSocket connection, note who can initiate sending data, how long the connection lives, and what has to happen for either side to learn about a change.
- [ ] Identify, specifically, why the Workspace's collaboration feature can't be built well with
      plain HTTP requests alone (e.g. polling).

**Questions** (depend on the tasks above)

- [ ] If you *did* implement live collaboration by polling (e.g. `fetch` every 2 seconds), what would the user experience actually look like compared to WebSockets? Be concrete about latency and wasted requests.
- [ ] Exercise 6's REST endpoints still exist for the read-only case data. Why doesn't the Workspace collaboration feature replace them — why do you need *both* HTTP and WebSockets in the same app?

---

## Demo 2 — WebSocket lifecycle

**Tasks**

- [ ] Build a minimal WebSocket server (can live in the same Node process as Exercise 6's REST server) and a minimal client that connects, sends one message, receives one message, and closes, before building any real Workspace features on top of it.
- [ ] Observe and log all four lifecycle events on the client (`open`, `message`, `close`, `error`) at least once each (you can force `error`/`close` by killing the server while connected).

**Questions** (depend on the tasks above)

- [ ] Walk through what actually happens on the wire (conceptually) when a WebSocket connection is established. What does the initial handshake use, and why does a WebSocket connection start out looking like an HTTP request?
- [ ] What's the difference between the connection closing because the *server* ended it versus because the *client* did (e.g. tab closed, network dropped)? Does your code currently
distinguish these, and should it?

---

## Demo 3 — Presence

**Tasks**

- [ ] On connect, have the server assign each client a random display name (no input from the user) and tell the client what it is.
- [ ] Broadcast presence to everyone in the session. When someone joins, show their name as a live tag in the navbar and when someone disconnects, remove it. Test with at least 2 simultaneous clients (two browser tabs is enough).

**Questions** (depend on the tasks above)

- [ ] Where does the list of "who's currently online" actually live — server memory, client state, or both? What happens to it if the server restarts?
- [ ] What's the difference between "the WebSocket connection closed" and "the user is no longer present"? Are they always the same moment in your implementation?

---

## Demo 4 — Typed message protocol

**Tasks**

- [ ] Design a typed message protocol (e.g. a TypeScript discriminated union) covering every message kind you'll need in this exercise. At minimum: presence join/leave, bookmark changes, note editing/updates, hypothesis editing/updates — shared between client and server code (not duplicated by hand in two places).
- [ ] Make at least one message type carry a version/timestamp field you intend to use for conflict detection later (Demos 7–8).

**Questions** (depend on the tasks above)

- [ ] Why is a discriminated union (each message has a `type` field that determines the shape of the rest) a good fit for this, compared to one big object with lots of optional fields?
- [ ] How do you actually share this type between your client and server code, given they're different entry points into the same project? What would go wrong if you defined it twice
instead, once in each?
- [ ] What happens right now if the server receives a message that doesn't match any known type, or is missing a required field? Is that already handled, or does it belong in Demo 10?

---

## Demo 5 — Rooms/documents & session scoping

**Tasks**

- [ ] Implement message scoping properly even though this app only ever uses one session. Every broadcast should go through a "who's in this session" mechanism, not a hardcoded "send to every open connection" loop, so the mechanism would work if a second session existed, even though one never will in this app.
- [ ] Within the single session, treat each independently-syncable piece of state as its own "document" with its own version. The bookmark set is one document, the hypothesis draft is another, and **each evidence item's notes are their own separate document.** Confirm that editing one evidence's notes doesn't touch another's version/state.

**Questions** (depend on the tasks above)

- [ ] What's the actual difference, in your implementation, between "broadcast to everyone connected" and "broadcast to everyone in this session"? If it's currently the same thing (one global session), what would you need to change to support a second, isolated session?
- [ ] Why does it make sense to think of the bookmark set, the hypothesis draft, and each evidence's notes as separate "documents" rather than one big shared blob of Workspace state? What do you gain by giving each its own version number?

---

## Demo 6 — Live bookmarks (client-server event flow)

**Tasks**

- [ ] Wire up bookmarking: toggling a bookmark sends a message to the server, the server updates the shared bookmark set and broadcasts the change to everyone in the session (including the
sender, or not — your choice, but be consistent and be ready to justify it).
- [ ] Demonstrate with 2+ clients: bookmarking in one tab appears in the other, live, with no page reload.

**Questions** (depend on the tasks above)

- [ ] Walk through the full event flow for one bookmark toggle, end to end: what message does the client send, what does the server do with it, what does it send back, and to whom?
- [ ] Bookmarks are a *set* (an item is either bookmarked or not). Why is this the easiest kind of shared state to make collaborative — what class of conflict is structurally impossible here that will matter again in Demos 7–8?

---

## Demo 7 — Live notes: editing indicators & conflict handling

**Tasks**

- [ ] When a user starts typing in an evidence's notes, broadcast a lightweight "X is editing this" presence signal to others viewing the same evidence (a soft hint, not an enforced lock, others can still type).
- [ ] Implement save-time conflict detection using the note document's version number (Demo 5): when saving, include the version you started from. If the server's current version has moved on since, don't silently overwrite. Show the user the current server version and a clear warning that someone else changed it, and let them decide how to proceed.
- [ ] Demonstrate a real conflict live: two clients editing the same evidence's notes, one saves first, the second sees the conflict warning.

**Questions** (depend on the tasks above)

- [ ] Why is "someone is editing" only a *hint* and not an enforced lock in your implementation? What would enforcing it actually require (think about what happens if that user's tab crashes while "holding" the lock)?
- [ ] Explain your conflict-detection mechanism precisely: what does the client send, what does the server compare it against, and what determines whether it's accepted or flagged as a conflict?
- [ ] Is this "last-write-wins with a warning" strategy a good fit for a two-sentence investigator note? Would your answer change for a much longer document? Why?

---

## Demo 8 — Live hypothesis draft: optimistic UI

**Tasks**

- [ ] Wire up the hypothesis draft form (suspect, nature, evidence selection, confidence, both text fields) to update the shared session state live, reusing the same version-based conflict pattern from Demo 7.
- [ ] Make the UI **optimistic**: when a user changes a field, update their own screen immediately (don't wait for the server round-trip), then reconcile once the server's broadcast arrives, including handling the case where the server rejects/flags the change as conflicting.

**Questions** (depend on the tasks above)

- [ ] What does "optimistic UI" mean, and what's the risk you're taking on by updating the screen before the server has confirmed anything? Show a case where your optimistic update and the server's eventual response disagree, and what the user sees when that happens.
- [ ] The hypothesis draft has several fields (suspect, confidence, explanation, ...). Does your conflict handling operate per-field, or on the whole form at once? What's the user-experience trade-off between those two choices?

---

## Demo 9 — Reconnection, heartbeats & message ordering

**Tasks**

- [ ] Implement a heartbeat (ping/pong) between client and server, and a visible connection-status indicator in the UI (e.g. "Live" / "Reconnecting…" / "Offline").
- [ ] Implement automatic reconnection with backoff when the connection drops, and re-sync full current state (bookmarks, notes, hypothesis, presence) on reconnect rather than assuming nothing changed while disconnected.
- [ ] Add sequencing (a counter or timestamp) to your messages and demonstrate handling an out-of-order or duplicate message correctly (you can simulate this artificially, similar to how Exercise 6's backend simulated latency).

**Questions** (depend on the tasks above)

- [ ] What does your heartbeat actually detect that the browser's own `close`/`error` events don't already catch? Give a concrete failure scenario where only the heartbeat notices.
- [ ] Kill your server, watch the client detect it and go into "Reconnecting…", then restart the server and demonstrate the client recovering — live.
- [ ] Why can messages arrive out of order or duplicated over a WebSocket at all, given TCP guarantees ordered delivery? (Hint: think about what happens across a reconnect, not within a single connection.)

---

## Demo 10 — Authentication & validation boundaries + wrap-up

**Tasks**

- [ ] Audit every message type from your protocol (Demo 4): for each one, confirm the server validates its shape and content rather than trusting the client (e.g. a bookmark message referencing a real evidence id, a display name that can't be spoofed as someone else's, reasonable field lengths).
- [ ] Deliberately send a malformed or spoofed message (e.g. via the browser console, not through your UI) and demonstrate the server rejecting it safely rather than crashing or corrupting shared state.

**Questions** (depend on the tasks above)

- [ ] This exercise has no sign-in. What's the actual security boundary here? What *can't* a malicious connection do, even without authentication, because of your server-side validation?
- [ ] If you added real accounts/sign-in later, what would change about how you validate messages, versus what would stay exactly the same?
- [ ] Across this whole exercise, name one moment where the "no persistence" constraint made something *simpler* than it would be with a database, and one moment where it made something *harder* or riskier.

---
