import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { basename } from 'path';
import { text } from 'stream/consumers';

// Remember to rename these classes and interfaces!

interface Text2LinkSettings {
	subFolders: string;
	wikiLinks: boolean; // wiki линки типа [[WikiLinks]]
}

const DEFAULT_SETTINGS: Text2LinkSettings = {
	subFolders: '',
	wikiLinks: false
}

export default class MyPlugin extends Plugin {
	settings: Text2LinkSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'Text2Link Plugin', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('This is a notice!');
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status Bar Text');


		// добавление команды который выделение из одного выделенного блока текста 
		//  делает ссылку на страницу с этим названием
		this.addCommand({
			id: 'one-convert-text2link',
			name: 'One line convert text to link',
			editorCallback: (editor: Editor, view: MarkdownView) => {	
				
				// console.log("Flag wiki links = ", this.settings.wikiLinks)
				// получаем информацию об активном окне редакторе (т.е. о текущей заметке)
				var cur_file = this.app.workspace.activeEditor.file

				var cur_path = cur_file.path
				var cur_filename = cur_file.name

				var cur_text = editor.getSelection()

				if (this.settings.wikiLinks) {
					console.log("Create wiki links")
					var cur_text_link = cur_text.trim()
					var cur_onlypath = cur_file.parent.path
					var subfolder_link = cur_onlypath + "/"+this.settings.subFolders.trim()
					console.log("subfolder_link: ", subfolder_link)

					cur_text = `[[${subfolder_link}/${cur_text_link}|${cur_text}]]`

				} else {
					console.log("Create Markdown links")			
					var cur_text_link = encodeURIComponent(cur_text.trim())				
					var cur_onlypath = cur_file.parent.path.split(' ').join('%20');
					console.log("Current File: ")
					console.log(cur_onlypath)
					var subfolder_link = cur_onlypath + "/"+encodeURIComponent(this.settings.subFolders.trim())
					
					cur_text = `[${cur_text}](${subfolder_link}/${cur_text_link})`					
				}
				editor.replaceSelection(cur_text);
			}
		});

		// добавление команды который выделение из одного выделенного блока текста 
		//  делает ссылку на страницу с этим названием но каждую строку 
		// которая завершается \n отдельная страница
		this.addCommand({
			id: 'many-convert-text2link',
			name: 'Many line convert text to links',
			editorCallback: (editor: Editor, view: MarkdownView) => {				
				// получаем информацию об активном окне редакторе (т.е. о текущей заметке)
				var cur_file = this.app.workspace.activeEditor.file
				var cur_path = cur_file.path
				var cur_filename = cur_file.name
				// получаем текущую папку в vault
				var cur_onlypath = cur_file.parent.path
				// console.log("Current File: ")
				// console.log(cur_onlypath)
				
				var many_cur_text = editor.getSelection()
				var arr_sur_text = many_cur_text.split('\n')

				console.log(arr_sur_text)

				for(var index in arr_sur_text)
					{ 
						var cur_text = arr_sur_text[index].trim()
						if (cur_text != '') {
							if (this.settings.wikiLinks) {
								console.log("Create wiki links")
								var cur_text_link = cur_text.trim()
								var cur_onlypath = cur_file.parent.path
								var subfolder_link = cur_onlypath + "/"+this.settings.subFolders.trim()
								console.log("subfolder_link: ", subfolder_link)
			
								cur_text = `[[${subfolder_link}/${cur_text_link}|${cur_text}]]\n`
			
							} else {
								console.log("Create Markdown links")			
								var cur_text_link = encodeURIComponent(cur_text.trim())				
								var cur_onlypath = cur_file.parent.path.split(' ').join('%20');
								console.log("Current File: ")
								console.log(cur_onlypath)
								var subfolder_link = cur_onlypath + "/"+encodeURIComponent(this.settings.subFolders.trim())
								
								cur_text = `[${cur_text}](${subfolder_link}/${cur_text_link})\n`					
							}
							editor.replaceSelection(cur_text);
						}
					}
			}
		});
		

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Settings for Text2Link converter plugin.'});

		new Setting(containerEl)
			.setName('Subfolder name')
			.setDesc('If your file is under "vault/folder" and you set subfolder name to "pages", links path will create "vault/folder/pages".')
			.addText(text => text
				.setPlaceholder('Enter links subfolder')
				.setValue(this.plugin.settings.subFolders)
				.onChange(async (value) => {
					console.log('subFolder: ' + value);
					this.plugin.settings.subFolders = value;
					await this.plugin.saveSettings();
				}));
		
		new Setting(containerEl)
			.setName('Use [[WikiLinks]]')
			.setDesc('If .')
			.addToggle((toggle) => {
				toggle.setValue(this.plugin.settings.wikiLinks);
				toggle.onChange(async (value) => {
					this.plugin.settings.wikiLinks = value;
					await this.plugin.saveSettings();
					});
				});

	}
}
