# Architecture

Hash Identifier is designed as a static browser application. It does not need a backend, database, package manager, API key, or build system.

## High-Level Flow

```text
User input
  |
  v
Split one hash per line
  |
  v
identifyHash()
  |
  +-- Prefix rules
  +-- Known pattern rules
  +-- Hex length rules
  +-- Generic PHC fallback
  +-- Non-hash shape hints
  |
  v
Candidate objects
  |
  v
Evidence cards in the UI
```

## Main Files

```text
index.html
```

Defines the application structure:

- Header navigation
- Hero section
- Hash input form
- Evidence/result panel
- Example hash cards
- Reference section
- Creator credit section

```text
styles.css
```

Defines the visual system:

- Professional dark security-lab theme
- Responsive two-column workspace
- Wider result/evidence cards
- Mobile-first fallback behavior
- Subtle panel and card animations
- Creator credit card styling

```text
app.js
```

Contains all application logic:

- Hash format rules
- Hashcat mode mapping
- John the Ripper format mapping
- Difficulty labels
- Input parsing
- Candidate generation
- Evidence card rendering
- Copy-report behavior
- Example-card interactions

## Data-Driven Rules

Most detection knowledge lives in plain JavaScript objects and arrays:

```text
PREFIX_RULES
HEX_LENGTH_RULES
HASHCAT_MODES
JOHN_FORMATS
DIFFICULTY
```

This keeps the project easy to extend. To add a new prefix-based format, add a row to `PREFIX_RULES`. To add a new raw hex digest length, update `HEX_LENGTH_RULES`.

## Candidate Model

Each result candidate includes:

- `algorithm`
- `confidence`
- `reason`
- `mode`
- `johnFormat`
- `difficulty`
- `commands`

This lets the UI render more than just a name. Every result explains what matched and how a user could continue in an authorized lab workflow.

## Privacy Model

The app runs entirely in the browser:

- No form submission to a server
- No network request for input analysis
- No local storage
- No cookies
- No analytics

The input is processed in memory and rendered directly into the page.

## Extension Ideas

- Add more hash families to `PREFIX_RULES`
- Add export as JSON
- Add drag-and-drop text file support
- Add confidence scoring instead of simple confidence labels
- Add a dedicated limitations page for ambiguous hash families
