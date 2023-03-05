# Text to Link converter

convert selected text to markdown link(s)

link for [russian README](https://github.com/kaefik/obsidian-text2link/blob/main/README.ru.md)

![Using plugin Text2Link](https://github.com/kaefik/obsidian-text2link/blob/main/Using%20plugin%20Text2Link.gif)

## How to use

- Clone this repo.
- `npm i` or `yarn` to install dependencies
- `npm run dev` to start compilation in watch mode.

## Manually installing the plugin

- Copy over `main.js`, `styles.css`, `manifest.json` to your vault `VaultFolder/.obsidian/plugins/text2link/`.



## Plugin modes

### One-way mode

command: Text2Link converter: One line convert to link

when you select a word or several words and apply the command, the selected text turns into a markdown or wiki link of the form

```markdown
[Selected text](Selected%20text)
```

### Multiline mode

command: Text2Link converter: Many line convert text to links

turns each selected line into a markdown or wiki links to pages

## Plugin settings

- Subfolder name - if the parameter is empty, then a link to the page is generated, which should be in the current folder of the note in which the command is applied. If the parameter specifies a folder name, then the link contains a link to a subfolder in the current note folder.
- Use [[WikiLinks]] - if the option is enabled, then a wiki link is generated, otherwise a markdown link
