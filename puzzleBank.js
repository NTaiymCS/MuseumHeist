const PUZZLE_BANK = {
    hiddenMessages: [
        {
            id: "hidden-four",
            title: "The Hidden Message",
            digit: "4",
            word: "FOUR",
            lines: [
                "Footprints stopped beside the old display.",
                "Only the night guard had the archive key.",
                "Unusual marks appeared along the west wall.",
                "Records show a missing inventory entry."
            ]
        },
        {
            id: "hidden-six",
            title: "The Archivist's Note",
            digit: "6",
            word: "SIX",
            lines: [
                "Security lights flickered after closing.",
                "Inventory sheets were left on the desk.",
                "X marks were found beside the cabinet."
            ]
        },
        {
            id: "hidden-two",
            title: "The East Wing Memo",
            digit: "2",
            word: "TWO",
            lines: [
                "The east wing was locked at nine.",
                "Witnesses reported a shadow near the stairs.",
                "Only one display case was left open."
            ]
        },
        {
            id: "hidden-nine",
            title: "The Night Report",
            digit: "9",
            word: "NINE",
            lines: [
                "Night staff heard a noise in the gallery.",
                "Inventory records were changed twice.",
                "Nothing appeared missing at first.",
                "Evidence was found beside the frame."
            ]
        },
        {
            id: "hidden-seven",
            title: "The Curator's Letter",
            digit: "7",
            word: "SEVEN",
            lines: [
                "Security staff checked every gallery.",
                "Evidence tags were moved.",
                "Visitors left before closing.",
                "Exhibits were checked again.",
                "Night patrol returned at nine."
            ]
        }
    ],

    symbolCounts: [2, 3, 4, 5, 6, 7, 8, 9],

    logicPuzzles: [
        {
            id: "logic-archive-badges",
            title: "The Security Badge",
            candidates: [4, 6, 7, 9],
            rules: [
                "The number is odd.",
                "The number is greater than 6.",
                "The number is prime.",
                "The number is not 9."
            ],
            answer: 7,
            hint: "Start with the odd numbers: 7 and 9. Only one is prime, and the rules also exclude 9."
        },
        {
            id: "logic-storage-lockers",
            title: "The Storage Locker",
            candidates: [2, 3, 5, 8],
            rules: [
                "The number is prime.",
                "The number is greater than 3.",
                "The number is less than 8."
            ],
            answer: 5,
            hint: "Only consider numbers that have exactly two factors. Then apply the greater-than and less-than clues."
        },
        {
            id: "logic-gallery-key",
            title: "The Gallery Key Tag",
            candidates: [1, 4, 6, 8],
            rules: [
                "The number is even.",
                "The number is greater than 5.",
                "The number is less than 8."
            ],
            answer: 6,
            hint: "The number must be even and fall between 5 and 8."
        },
        {
            id: "logic-night-shift",
            title: "The Night Shift Roster",
            candidates: [3, 5, 7, 9],
            rules: [
                "The number is odd.",
                "The number is greater than 4.",
                "The number is prime.",
                "The number is not 7."
            ],
            answer: 5,
            hint: "The candidates greater than 4 are 5, 7, and 9. Remove the number that is not prime and the number specifically excluded."
        },
        {
            id: "logic-evidence-drawer",
            title: "The Evidence Drawer",
            candidates: [2, 4, 6, 9],
            rules: [
                "The number is even.",
                "The number is greater than 3.",
                "The number is less than 8.",
                "The number is not 6."
            ],
            answer: 4,
            hint: "The even candidates between 3 and 8 are 4 and 6. One of them is ruled out."
        }
    ],

    cipherMessages: [
        { id: "cipher-one", word: "ONE", digit: "1", shift: 3 },
        { id: "cipher-two", word: "TWO", digit: "2", shift: 3 },
        { id: "cipher-three", word: "THREE", digit: "3", shift: 3 },
        { id: "cipher-four", word: "FOUR", digit: "4", shift: 3 },
        { id: "cipher-five", word: "FIVE", digit: "5", shift: 3 },
        { id: "cipher-six", word: "SIX", digit: "6", shift: 3 },
        { id: "cipher-seven", word: "SEVEN", digit: "7", shift: 3 },
        { id: "cipher-eight", word: "EIGHT", digit: "8", shift: 3 },
        { id: "cipher-nine", word: "NINE", digit: "9", shift: 3 }
    ],

    numberPatterns: [
        { id: "sequence-double", type: "doubling" },
        { id: "sequence-addition", type: "addition" },
        { id: "sequence-squares", type: "squares" },
        { id: "sequence-fibonacci", type: "fibonacci" }
    ]
};

function bankRandomNumber(minimum, maximum) {
    return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
}

function chooseBankItem(items, previousId) {
    let choices = items;

    if (items.length > 1 && previousId) {
        choices = items.filter(function(item) {
            const itemId = typeof item === "number" ? "symbols-" + item : item.id;
            return itemId !== previousId;
        });
    }

    return choices[bankRandomNumber(0, choices.length - 1)];
}

function makeHiddenMessagePuzzle(variant) {
    const clueLines = variant.lines.map(function(line) {
        return "<p>" + line + "</p>";
    }).join("");

    return {
        id: variant.id,
        category: "hidden message",
        title: variant.title,
        intro: "A handwritten note was recovered from the museum floor. The curator believes the writer left a short instruction in the document. Examine how each line begins.",
        content: `
            <div class="evidence-document">
                <p class="document-label">RECOVERED MUSEUM NOTE</p>
                <h3>Exhibit Investigation Report</h3>
                <p class="document-description">Found near the missing painting's display.</p>
                <div class="clue-lines">${clueLines}</div>
                <p class="document-footer">MUSEUM SECURITY DEPARTMENT // RECOVERED NOTE</p>
            </div>
        `,
        prompt: "What word is hidden in the note?",
        placeholder: "Enter the hidden word",
        answers: [variant.word],
        digit: variant.digit,
        hint: "Read down the first letter of every line. Put those letters together.",
        explanation: "The first letters spell " + variant.word + ". That word represents vault digit " + variant.digit + "."
    };
}

function makeSymbolPuzzle(starCount) {
    const numberWords = ["ZERO", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE"];
    const symbols = [];

    for (let i = 0; i < starCount; i++) {
        symbols.push("star");
    }
    while (symbols.length < 12) {
        symbols.push("diamond");
    }

    for (let i = symbols.length - 1; i > 0; i--) {
        const j = bankRandomNumber(0, i);
        const temporary = symbols[i];
        symbols[i] = symbols[j];
        symbols[j] = temporary;
    }

    const tiles = symbols.map(function(symbol) {
        if (symbol === "star") {
            return '<span class="symbol-tile star">★</span>';
        }
        return '<span class="symbol-tile">◆</span>';
    }).join("");

    return {
        id: "symbols-" + starCount,
        category: "symbol count",
        title: "The Gallery Display",
        intro: "A security photograph shows a display card covered with symbols. The diamonds are decorative. The stars are the important evidence. Count them carefully.",
        content: `
            <div class="evidence-card">
                <p class="document-label">GALLERY INVENTORY / SYMBOL RECORD</p>
                <h3>Display Case Symbol Record</h3>
                <p>The guard recorded these symbols before the gallery closed.</p>
                <div class="symbol-grid" aria-label="A grid of stars and diamonds">${tiles}</div>
                <p class="document-footer">SECURITY PHOTO TRANSCRIPTION // SYMBOL EVIDENCE</p>
            </div>
        `,
        prompt: "How many stars are shown? Enter the number or the word.",
        placeholder: "Enter the number of stars",
        answers: [String(starCount), numberWords[starCount]],
        digit: String(starCount),
        hint: "Ignore every diamond. Count only the star symbols.",
        explanation: "There are " + starCount + " stars. The number of stars gives you vault digit " + starCount + "."
    };
}

function makeLogicPuzzle(variant) {
    const badges = variant.candidates.map(function(number) {
        return '<span class="badge-number">' + number + "</span>";
    }).join("");

    const rules = variant.rules.map(function(rule) {
        return "<li>" + rule + "</li>";
    }).join("");

    return {
        id: variant.id,
        category: "logic",
        title: variant.title,
        intro: "A list of numbers was recovered from the security office. One number matches every clue in the investigator's rules. Use all the information before choosing.",
        content: `
            <div class="evidence-card">
                <p class="document-label">SECURITY DEPARTMENT / PERSONNEL LOG</p>
                <h3>Numbers Recorded Near the Archive</h3>
                <div class="badge-list">${badges}</div>
                <p><strong>Investigator's rules:</strong></p>
                <ul class="rule-list">${rules}</ul>
                <p class="document-footer">PERSONNEL RECORD // LOGGED EVIDENCE</p>
            </div>
        `,
        prompt: "Which number satisfies every rule?",
        placeholder: "Enter the badge number",
        answers: [String(variant.answer)],
        digit: String(variant.answer),
        hint: variant.hint,
        explanation: "The correct number is " + variant.answer + ". It is the only candidate that satisfies every rule, so the vault digit is " + variant.answer + "."
    };
}


function shiftCipherWord(word, shift) {
    return word.split("").map(function(letter) {
        const letterNumber = letter.charCodeAt(0) - 65;
        return String.fromCharCode(((letterNumber + shift) % 26) + 65);
    }).join("");
}

function makeCipherPuzzle(variant) {
    const encryptedWord = shiftCipherWord(variant.word, variant.shift);

    return {
        id: variant.id,
        category: "cipher",
        title: "The Encrypted Message",
        intro: "A message was written on the back of a museum visitor pass. The archivist believes it was encrypted with a Caesar cipher. Each original letter was shifted forward. Move the letters backward to uncover the message.",
        content: `
            <div class="evidence-card">
                <p class="document-label">RECOVERED VISITOR PASS / ENCRYPTED TEXT</p>
                <h3>Message Fragment</h3>
                <div class="cipher-text">${encryptedWord}</div>
                <p>Encryption note: each original letter was moved forward by ${variant.shift} places.</p>
                <p class="document-footer">ARCHIVE DESK // ENCRYPTED EVIDENCE</p>
            </div>
        `,
        prompt: "What word does the encrypted message spell?",
        placeholder: "Enter the decoded word",
        answers: [variant.word],
        digit: variant.digit,
        hint: "Move each letter backward " + variant.shift + " places in the alphabet. The alphabet wraps around from A to Z.",
        explanation: "Shifting " + encryptedWord + " backward by " + variant.shift + " letters gives " + variant.word + ". That word represents vault digit " + variant.digit + "."
    };
}

function makeSequencePuzzle(variant) {
    let sequence = [];
    let answer = 0;
    let hint = "";
    let rule = "";

    if (variant.type === "doubling") {
        const start = bankRandomNumber(1, 4);
        sequence = [start, start * 2, start * 4, start * 8];
        answer = start * 16;
        hint = "Compare each number with the one before it. Is each number multiplied by the same amount?";
        rule = "Each number is multiplied by 2 to get the next number.";
    } else if (variant.type === "addition") {
        const start = bankRandomNumber(2, 10);
        const step = bankRandomNumber(2, 6);
        sequence = [start, start + step, start + step * 2, start + step * 3];
        answer = start + step * 4;
        hint = "Find the difference between the first two numbers. Check whether the same amount is added each time.";
        rule = "The same amount, " + step + ", is added each time.";
    } else if (variant.type === "squares") {
        const start = bankRandomNumber(1, 4);
        sequence = [start, start + 1, start + 2, start + 3].map(function(number) {
            return number * number;
        });
        answer = (start + 4) * (start + 4);
        hint = "These numbers are each a whole number multiplied by itself. Look at the square numbers.";
        rule = "The numbers are consecutive square numbers.";
    } else {
        const first = bankRandomNumber(1, 4);
        const second = bankRandomNumber(2, 5);
        sequence = [first, second, first + second, first + second * 2];
        answer = first * 2 + second * 3;
        hint = "Starting with the third number, add the two numbers immediately before it to get the next one.";
        rule = "Each number is the sum of the two numbers immediately before it.";
    }

    const sequenceDisplay = sequence.map(function(number) {
        return "<span>" + number + "</span>";
    }).join("");
    const finalDigit = String(answer).slice(-1);

    return {
        id: variant.id,
        category: "number pattern",
        title: "The Security Number Sequence",
        intro: "A number pattern was found in the vault control system. The missing number is the final piece of the access record. Work out the rule and enter the complete answer.",
        content: `
            <div class="evidence-card">
                <p class="document-label">VAULT ACCESS NOTE / NUMBER RECORD</p>
                <h3>Security Number Sequence</h3>
                <div class="number-pattern" aria-label="Number pattern: ${sequence.join(", ")}, followed by a missing number">${sequenceDisplay}<span>?</span></div>
                <p>Find the rule that connects each number to the next.</p>
                <p class="document-footer">VAULT CONTROL PANEL // NUMBER EVIDENCE</p>
            </div>
        `,
        prompt: "What number comes next? Enter the full number.",
        placeholder: "Enter the missing number",
        answers: [String(answer)],
        digit: finalDigit,
        hint: hint,
        explanation: rule + " The full answer is " + answer + ". Its last digit is " + finalDigit + ", which becomes this file's vault digit."
    };
}

let previousPuzzleSelection = {};

function shufflePuzzles(items) {
    const shuffled = items.slice();

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = bankRandomNumber(0, i);
        const temporary = shuffled[i];
        shuffled[i] = shuffled[j];
        shuffled[j] = temporary;
    }

    return shuffled;
}


function createPuzzleSet() {
    const hiddenVariant = chooseBankItem(PUZZLE_BANK.hiddenMessages, previousPuzzleSelection.hiddenMessages);
    const symbolCount = chooseBankItem(PUZZLE_BANK.symbolCounts, previousPuzzleSelection.symbolCounts);
    const logicVariant = chooseBankItem(PUZZLE_BANK.logicPuzzles, previousPuzzleSelection.logicPuzzles);
    const cipherVariant = chooseBankItem(PUZZLE_BANK.cipherMessages, previousPuzzleSelection.cipherMessages);
    const sequenceVariant = chooseBankItem(PUZZLE_BANK.numberPatterns, previousPuzzleSelection.numberPatterns);

    previousPuzzleSelection = {
        hiddenMessages: hiddenVariant.id,
        symbolCounts: "symbols-" + symbolCount,
        logicPuzzles: logicVariant.id,
        cipherMessages: cipherVariant.id,
        numberPatterns: sequenceVariant.id
    };

    const selectedPuzzles = [
        makeHiddenMessagePuzzle(hiddenVariant),
        makeSymbolPuzzle(symbolCount),
        makeLogicPuzzle(logicVariant),
        makeCipherPuzzle(cipherVariant),
        makeSequencePuzzle(sequenceVariant)
    ];

    return shufflePuzzles(selectedPuzzles);
}
