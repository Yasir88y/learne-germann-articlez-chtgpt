# Artikel Studio — German Article Trainer

A free, mobile-friendly German A1 noun article trainer, hosted using a single static HTML file. No microphones, accounts, frameworks, build tools, API keys, or paid services.

## How learning works
- **One adaptive session with 30 questions.** Multiple-choice (tap der / die / das) and typing questions are interleaved.
- **Mastery per noun:** 5 correct answers in total, including exactly **3 multiple-choice** and **2 typed** correct answers.
- **First stage:** 2 successful multiple-choice answers and 1 successful typed answer, in a mixed order. Successful recalls for the same noun are spaced by at least 20 minutes.
- **Delay:** after the third correct answer, that noun cannot reappear for **48 hours**. The maximum is 3 successful recalls per rolling 48-hour window.
- **Final stage:** 1 additional multiple-choice answer and 1 additional typed answer. The final two successes are at least 6 hours apart. After these five total correct answers, the noun is **mastered and removed** from future practice.
- **Mistake Hunter is built in:** incorrect answers and reveals do not earn mastery credit. Missed nouns get priority and can reappear later in the same session after several other questions.
- **Adaptive selection:** chooses between new and weak nouns, without reviewing mastered nouns.
- **Correct answers:** advance automatically after **0.6 seconds**. Incorrect answers or revealed answers remain visible for **3 seconds**, then advance.
- **30 questions per session when enough words are due.** If all remaining nouns are waiting for their next spaced review, the session ends early instead of bypassing the timing rules.

Contains the learner's original **100 German nouns and definite articles** from the "100 deutsche Wörter" PDF, with English meanings embedded in the quiz.

## Run or publish
Open index.html in a browser or use GitHub Pages:
1. Repository **Settings → Pages**.
2. **Build and deployment → Deploy from a branch**.
3. Choose **main / (root)** and **Save**.
4. Site URL: https://yasir88y.github.io/learne-germann-articlez-chtgpt/

## Progress and device notes
Progress is saved on each device in the browser's localStorage (artikel-studio-v2). It does not synchronize across different devices or browsers.
Prior artikel-studio-v1 attempts and errors are imported when the new storage does not yet exist. Old correct answers do **not** count toward mastery because they were not categorized as multiple-choice vs typed.

To reset all learning progress, use the reset option in the footer.

## Maintenance
The app is intentionally a single index.html file, so future GitHub edits and GitHub Pages deployments are simple.