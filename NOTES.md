- Flag color? Marker color?
- Export shot list to CSV?
- Consider using proper color-blind mode
- Add a view for synced videos?
- Add a color marker that can be exported in CSV.
- Can I add a folder to google drive?

[] rearrange the shot order (but keep takes in there)

- create a storyboard of existing shots
- review takes - it is its own editor
- MOVE the THUMBNAIL WITHIN the scene
  - SUGGESTION: putting it all in the script itself.

x. pre-vis storyboard :D

- FOCUS -> SCENE -> SHOT -> TAKE

- // SCREEN DOOR
- CU sdflaskdjf
- /// DICKSTEEL
- sdfasdf

- Scene/Shot/Take metadata is in da vinci, we should check.

EXPORT TO PDF with all the storyboard, image to filename.

flag marker for in-content. comments?

- reassign takes

## Collapsible Design

- Text left-aligned
- Shotlist right-aligned?

SCREENPLAY => Text editing
STORYBOARD => Node editing
SHOTLIST => List editing
TAKELIST => Sub-shotlist

```
SCREENPLAY       -> STORYBOARD  -> SHOTLIST  -> TAKEVIEW
^- Text document ^- Thumbnails? ^- shot list ^- take list? (context-full)
|                |              |            |
| Vertical sticky notes in margins           |
                 |              |            |
                 | captions below thumbnails (sequencing)
                                |            |
                                | list of shots (details in cells)
                                             |
                                             | full context? (partial preview)
```

```
There is something amiss in Marde.
---- [ + ] -----------------------
Other text goes here.
```

->

```
---- [ + ] -- [ ? ] -- [ + ] ----
---- [ + ] -- [ - ] -- [ - ] ----
---- [ - ] -- [ + ] -- [ + ] ----
```

->

```
???
```

- Custom Recorder
- Orientation / Aspect Ratio
- Lock screen orientation

- Limited chars for searching - Some search - numpad would be nice
- 19k-20k

- Take Previews/Shot Thumbnails -> into the script
- Storyboard minimap

- Hide frontmatter somewhere

- Grid for white box
- 4:3 box within 16:9 (semi-transparent white line)

---

# 2024-01-12 -----------------------------------------------------

I think we should have an import button that imports shotlists. We shouldn't be
making them in the app.

We should have a slate screen for the QR code. This connects external cameras with metadata.

How do we sync audio?

This is for hobbyist.

So they may have a storyboard and a script. They import that.

And they want to connect it to their editing software.

Cineshots.ai - how are they different?

- They generate shotlists using ai. And can create images and rental searches for the equipment.

Storyboarder

- Create a storyboard from script.

So there are a lot of script visualization tools already.

We want to help bridge those pieces together in the editing room, per shot.

The storyboard info is there.
The shotlist is there.

There's a gap between shotlist to editing.

- When the shotlist meets reality basically.
- Information is tangled up.

is it?

I have to sort video and audio together.

I have to sort all the video into scenes.
Then each into shots.

What we really want is a search engine of footage.

- Everything we do before that is to help make that possible/more efficient/more accurate.

Currently, we can search by name.

- If we can name footage with relevant story handles, then we can search better.

---

1. Remove the editable text-- expect people to write things outside of this app (there is an option to edit minor text, but we don't want a full blown shortcut editor.)
2. This means we'd expect people to write shots like: [[SHOT: ...]]. OR drag-n-drop the shotlist into the script on new lines.
3. The primary goal of this app is to make searchable easy with context
4. Is there a universal format for shotlists? Are tehre shotlist tools?

- Screenwriting: Final Draft / Slugline 2 / Highland 2
- Annotating: Scriptation https://scriptation.com/features/annotations/

---

- JSON file has ALL the things.
- unique key per take

Creating QR code

1.

Scanning QR Code

1. Get all footage in this directory.
2. Scan each footage for a QR code.
3. Generate Shot Hash
4. Generate a list mapping of file names to new filenames
5. Uncomment last bit so that it can work
6. Run it again (load it in to memory and disable the list again)
7. It will now rename everything.

ShotHash 4 digit randomly?

1234T00

---

- Favorite vs "Print It!"
- Put all "Printed" into a folder

Folder Structure:

- Date is important. SAVED by date.
- Call sheets - scenes and shots are usually categorized by date.
- SD card usually have CFAST cards
- RED has a harddrive

CFAST1A_01 => CFAST card Day 1 Cam A and First card

- grouped by folders first (this is then copied and backed up)
- putting folders

---

- Google Drive project synx
- QR scanner should get the take preview (also have a standalone one)
- Import shot syntax from fountain
- Relayout slate

- What if you create a shot later?

- Focus chart?

- Announce the slate - Text-to-speech recognition?

---

Symlink

- Starts in the slate app.

- Roll (CARD) is typed in.

---

What I really want:

- EAGLE slate saves the ENTIRE STORE to app data.
  - Probably a document list with then each file as a document itself.
- Over time, each project update will that document file by itself.
  - Only the latest updated document is preferred.

---

SHOT HASH -> editing identifier
SHOT NUMBER -> quick reference for the editor

Sequence of shots are determined:

- in storyboard
  - useful to have shot info in app to relay on set.
- or while editing
  - useful to have shot info on screen for quick reference.

moving shots between scenes are rare.

- because it breaks continuity
- usually just object close-ups (cause they don't have continuity)

Once recorded it cannot rename.

- On import, if it fails to find location, then just dump it. The editor will have to figure it out.

---

Possible next steps?

- Photo recorder for story building
- Zoom requires it ZOOMS out before zooming back in?
- Be able to record QR code in recorder
- GIF take preview
- Ultrasound pairing
- Add thumbnails to export all button

- Firefox click button doesn't work.

- Read more for Scene text?

- Scrub through scenes in numbers

- Collections button

---

BACK
Scan directory
Analyze files
Transcode files
Import to project
Rename files on disk
Export list to csv

--

- Move takes to recorder

- Scanner revamp ui
- Integrate FFmpeg

- Import by paste

---

Add shotlist button at bottom of block with plus sign

---

final draft

import and show a title?

clap later to sync

add proxy

H.264 MOV

White background slate

- Slate it in the classic way
- Name DIR, DP, PROD

Clap sound?

viewfinder app for android

- To look at app

- Shareable as a pdf
- CSV

---

Add slate black/white

export storyboard in drawer.

- export by scene

multiple view of storyboard

- landscape/portrait

split by scene

strips?

scenewise storyboard

- scene heading
- LANDSCAPE

- Shot Angle List

Pre-vis for story is document only (no scene split)

- project id and credits in the header/footer
- and date of export

---

storyboard in split view is missing.

---

renumbering scenes

- partial writing scenes / shot lists
- (reimport script)

creating shotlists (days)

- shot hashes generated when generating PDF shotlist
- Fix pdf file name
- Letter size for PDF
- Remove gray background

- FDX import
