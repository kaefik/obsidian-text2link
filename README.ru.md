# Text to Link converter

преобразует выделенный текст в маркдаун или вики ссылку



![Using plugin Text2Link](https://github.com/kaefik/obsidian-text2link/blob/main/Using%20plugin%20Text2Link.gif)




## Как использовать

- Склонируйте репозиторий
- `npm i` или `yarn` для установки зависимостей
- `npm run dev` для запуска компиляции в live режиме

## Ручная установка плагина

- Скопируйте  `main.js`, `styles.css`, `manifest.json` в вашу базу знаний `VaultFolder/.obsidian/plugins/text2link/`.


## Режимы работы плагина

### Односторочный режим 

команда: Text2Link converter: One line convert to link

при выделении слова или нескольких слов и применение команды выделенный текст превращается в маркдаун или вики ссылку вида

```markdown
[Выделенный текст](Выделенный%20текст)
```

### Мультистрочный режим

команда: Text2Link converter: Many line convert text to links

каждую выделенную строку превращает в  маркдаун или вики ссылки на страницы


## Настройки плагина

- Subfolder name - если параметр пустой, то генерируется ссылка на страницу которая должна быть в текущей папки заметки в которой применена команда. Если в параметре указана имя папки то в ссылке идет ссылка на подпапку в текущей папки заметки.
- Use [[WikiLinks]] - если опция включена то генерируется вики ссылка, иначе маркдаун ссылка



