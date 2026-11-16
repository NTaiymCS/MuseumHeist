MUSEUM HEIST — CASE FILE 0214

PROJECT FILES
- index.html: page structure and screens; includes the single featured Art Institute artwork on the homepage.
- styles.css: vintage museum design and responsive layout.
- puzzleBank.js: the puzzle library, puzzle variations, random selection, and puzzle generation.
- script.js: game flow, answer checking, countdown timer, vault, and endings.

THE STORY
This fictional escape-room case centers on the disappearance of Georges Seurat's A Sunday on La Grande Jatte — 1884. The same painting shown on the homepage is the missing masterpiece throughout the case, puzzles, vault, and ending.

ARTWORK
Only one artwork image is used: A Sunday on La Grande Jatte — 1884 by Georges Seurat, from the Art Institute of Chicago collection (object 27992).
- Collection record: https://www.artic.edu/artworks/27992/a-sunday-on-la-grande-jatte-1884
- Image service: Art Institute of Chicago IIIF image service.

The image is hotlinked rather than copied into the project. An internet connection is needed to display it. The theft story is fictional; it does not imply the actual artwork has been stolen.

HOW THE RANDOM PUZZLE SYSTEM WORKS
At the beginning of each new investigation, puzzleBank.js:
1. Selects one random hidden-message puzzle.
2. Selects one random symbol-count puzzle.
3. Selects one random logic puzzle.
4. Selects one random Caesar-cipher puzzle.
5. Generates one random number-pattern puzzle.
6. Shuffles the five selected puzzles so their order changes.

Each puzzle stores its own accepted answer, hint, explanation, and vault digit. The final vault code is built from the five digits in the order the player solves the evidence files. The final number-sequence answer uses its last digit as its vault digit.

HOW TO RUN
1. Keep all four code files in the same folder.
2. Open index.html in Chrome, Edge, or Firefox.
3. Enter an investigator codename and select OPEN THE CASE FILE.
4. Solve the five randomly selected evidence files, then enter the five-digit vault code.

GAME RULES
- The countdown is 20 minutes.
- Correct answers reveal a digit and explanation.
- Hints can be requested for each puzzle.
- The game has a successful recovery ending and a time-expired ending.
- The RESTART button returns to the opening page and generates a fresh puzzle set.

The game itself does not depend on the Art Institute image loading. If the image is unavailable, the player can still complete the case.
