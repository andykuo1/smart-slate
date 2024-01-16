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

- AutoUpdate for scanner
