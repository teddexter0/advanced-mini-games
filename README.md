# Advanced Mini Games

[Play the arcade](https://advanced-mini-games.vercel.app)

17 browser games, each with its own public repository and production site. Standalone sites share original image assets through the hub. Owner lessons and editors are excluded from public packages. Saves stay in the browser.

| Game repository | Play |
| --- | --- |
| [dex-snake](https://github.com/teddexter0/dex-snake) | [Open game](https://dex-snake.vercel.app) |
| [dex-sudoku](https://github.com/teddexter0/dex-sudoku) | [Open game](https://dex-sudoku.vercel.app) |
| [dex-tetris](https://github.com/teddexter0/dex-tetris) | [Open game](https://dex-tetris.vercel.app) |
| [dex-flappy-flight](https://github.com/teddexter0/dex-flappy-flight) | [Open game](https://dex-flappy-flight.vercel.app) |
| [dex-sky-whale](https://github.com/teddexter0/dex-sky-whale) | [Open game](https://dex-sky-whale.vercel.app) |
| [dex-tile-merge](https://github.com/teddexter0/dex-tile-merge) | [Open game](https://dex-tile-merge.vercel.app) |
| [dex-pac-snake](https://github.com/teddexter0/dex-pac-snake) | [Open game](https://dex-pac-snake.vercel.app) |
| [dex-hollywood-monopoly](https://github.com/teddexter0/dex-hollywood-monopoly) | [Open game](https://dex-hollywood-monopoly.vercel.app) |
| [dex-multiverse-jigsaw](https://github.com/teddexter0/dex-multiverse-jigsaw) | [Open game](https://dex-multiverse-jigsaw.vercel.app) |
| [dex-puzzle-pop](https://github.com/teddexter0/dex-puzzle-pop) | [Open game](https://dex-puzzle-pop.vercel.app) |
| [dex-multiverse-monopoly](https://github.com/teddexter0/dex-multiverse-monopoly) | [Open game](https://dex-multiverse-monopoly.vercel.app) |
| [dex-whack-a-mole](https://github.com/teddexter0/dex-whack-a-mole) | [Open game](https://dex-whack-a-mole.vercel.app) |
| [dex-unblock-me](https://github.com/teddexter0/dex-unblock-me) | [Open game](https://dex-unblock-me.vercel.app) |
| [dex-stickman-skyline](https://github.com/teddexter0/dex-stickman-skyline) | [Open game](https://dex-stickman-skyline.vercel.app) |
| [dex-hop-step-jump](https://github.com/teddexter0/dex-hop-step-jump) | [Open game](https://dex-hop-step-jump.vercel.app) |
| [dex-civil-war-pinball](https://github.com/teddexter0/dex-civil-war-pinball) | [Open game](https://dex-civil-war-pinball.vercel.app) |
| [dex-rock-paper-shoot](https://github.com/teddexter0/dex-rock-paper-shoot) | [Open game](https://dex-rock-paper-shoot.vercel.app) |

## Release verification

All 17 production sites were verified READY against the latest commits. All 43 automated checks pass. TMDB portrait lookup was tested successfully on the hub and Hollywood site; the credential stays in server environment variables. Nine supplied static image assets are restored, and shared image routing was checked on the jigsaw site.

## Known remaining issue

The supplied trading GIF (`whenTwoPlayersMakeTheirOwnKindaDeal.gif`) is not yet uploaded and currently returns 404. Its large upload stalled; the local Windows runner then rejected commands because of an invalid `/workspace` sandbox path. Browser visual QA was also blocked by the local runtime. These checks remain outstanding.

Sky Whale is a fan rebuild. Monopoly uses the documented ruleset and variants shown in the in-app credits. Original photographs and brands retain their respective owners' rights.
