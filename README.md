# Artikel Studio — German Article Trainer

A free, mobile-friendly, silent German noun-article trainer, hosted with GitHub Pages. It includes the original 100 nouns from the learner's vocabulary PDF.

## Daily study

- **Study for up to 60 minutes per calendar day.** The on-screen timer tracks active time while the quiz is visible; it pauses when the page is hidden, when you press Pause, after two minutes of inactivity, or between rounds. Unused minutes remain available later that day.
- **30 questions per round**, mixing multiple-choice and typed article recall. Start another round while daily minutes remain.
- **Pause / Resume** at any point. Individual answers, the current round, errors, and accumulated minutes are saved in browser localStorage. Closing and reopening the browser on the same day resumes the round.
- At the daily one-hour cap, the app stops until the next calendar day. Progress remains intact. A new daily budget starts at local midnight.
- **Mistake Hunter is automatic.** Missed nouns are prioritized and may recur later in the round.
- **Never locked out of practice due to spaced recall.** If every word is waiting for another mastery credit, unmastered words still appear for extra practice. Extra answers affect accuracy and mistake statistics but do not earn premature mastery credit.

## Mastery and spacing

- Each noun needs **3 correct multiple-choice answers and 2 correct typed answers** to become mastered.
- Successful mastery recalls for the same word are separated by at least **five minutes**.
- No more than **three mastery credits per noun per calendar day**.
- After the third correct mastery recall, the final two can start **the following day**, not after a compulsory two-day wait.
- Once a noun is mastered, it is removed from future questions.
- Correct answers advance after **0.6 seconds**; incorrect and revealed answers display the article for **3 seconds**. Incorrect and revealed answers never earn mastery credit.

## Publishing

1. Open repository **Settings → Pages**.
2. Configure **Deploy from a branch → main / (root)**.
3. Live site: https://yasir88y.github.io/learne-germann-articlez-chtgpt/

## Data and privacy

Local progress is kept in the same browser/device. The app does **not** sync between devices. Clearing the browser's site data or using the Reset button can remove stored learning progress.

Older learning progress from the previous application version is preserved. The daily timer and resumable round use separate localStorage keys and do not erase prior word statistics.

The app is a single HTML/CSS/vanilla JavaScript file; it has no server, microphone requirement, paid dependency, or build step.
