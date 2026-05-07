# Privacy

Cinematheca is local-first.

## What Stays Local

- Dropped master video files.
- Transcript text.
- Generated subtitles.
- Generated festival packages.
- Browser project preferences.

## What Leaves The Browser

The app fetches public repository commit metadata from:

https://api.github.com/repos/baditaflorin/cinematheca/commits/main

The app also displays outbound links to:

https://github.com/baditaflorin/cinematheca

https://www.paypal.com/paypalme/florinbadita

No source media is uploaded by Cinematheca.

## Analytics

No analytics, tracking cookies, remote logging, or beacons are included in v1.

## Local Storage

The app uses `localStorage` for lightweight preferences and IndexedDB for generated artifacts. Clear browser site data to remove all local Cinematheca data.
