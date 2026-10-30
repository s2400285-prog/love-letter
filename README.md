# A Little Love Letter for My Baby Julie 💜

Made with love by James Neil Traigo.

## Open in Visual Studio Code

1. Extract `love-letter.zip`.
2. Open the `love-letter` folder in Visual Studio Code.
3. Replace the two empty media placeholders:
   - `images/us.jpg` — your ONE special picture of James and Julie.
   - `music/music.mp3` — your chosen song in MP3 format.
4. Open `index.html` in a modern browser, or use VS Code's Live Server extension.

No npm installation, build step, framework, account, or server is needed.
All styling, animation, and interactions use HTML, CSS, and vanilla JavaScript.
The decorative flowers and handwriting font are included and work offline.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Envelope, letter, questionnaire, photo frame, music controls, dialogs |
| `style.css` | Lavender stationery, responsive layouts, CSS animations |
| `script.js` | Letter text, typewriter, navigation, form validation, browser storage, music |
| `images/us.jpg` | Empty placeholder: replace with your real JPEG photo |
| `music/music.mp3` | Empty placeholder: replace with your real MP3 music |
| `images/flowers.png` | Included decorative floral artwork with transparency |
| `assets/letter-script.otf` | Included handwriting font |
| `assets/FONT-LICENSE.txt` | Font copyright and license |
| `ASSET-NOTES.md` | Artwork creation notes |

The two media placeholder files are intentionally empty. The website displays a
styled photo placeholder until your photo is added. If music is absent or cannot
play, the music control gives a clear message instead of pretending it is playing.
Use the exact lowercase names shown above. Keep all other folders together.

## The experience

- Click the envelope or its button to open it; the full message starts typing only afterward.
- Use **Skip typing** to reveal the whole letter immediately.
- **Next page**, **Back to my letter**, and the page tabs allow revisiting both pages.
- Tap the small heart at the bottom of the letter for a hidden message.
- Complete all five questions and submit to see the thank-you screen.
- **One more thing, my love…** reveals a second personal message.
- Submitted answers can be revisited, downloaded as a text note, or cleared.
- The music button toggles play and pause. The speaker button opens the volume slider.
- The header's sparkle button pauses decorative motion. The site also respects the device's reduced-motion preference, revealing the letter immediately for comfortable reading.
- All controls work with a keyboard. Dialogs support Escape and return focus to the opening button.

## Answers and privacy

This is a static website. No answers are sent to James and nothing is saved online.
Only completed questionnaire submissions are stored in `localStorage` under
`james-julie-love-letter-answers-v1`, on the same browser and site address.
Draft answers stay on the open page until submitted. Clearing browser data removes
saved answers. A different browser, device, or site address has separate storage.

Some browsers restrict storage for directly opened `file://` pages or private
windows. The website handles that case and explains that answers remain only on
the open page. Use Live Server for more consistent local storage. The downloadable
text note provides an optional copy that Julie can choose to share herself.

## Personalize

- Edit `LETTER` near the top of `script.js` to change the main message.
- Edit `showMessage()` in `script.js` to change the secret and surprise messages.
- Edit the color variables at the top of `style.css` to change the palette.
- Adjust `.photo-window img { object-position: center; }` if your photo needs a different crop.
- Initial music volume is 35%. Audio is requested only after the envelope or music button is clicked; browsers may still require another click.

The hosted preview is private to the owner. The downloadable folder can be placed
on any static website host when you are ready to share it with Julie.
