import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
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
				var cur_text = editor.getSelection()
				var cur_text_link = encodeURIComponent(cur_text.trim())
				var subfolder_link = encodeURIComponent(this.settings.subFolders.trim())
				console.log(cur_text);
				cur_text = `[${cur_text}](${subfolder_link}/${cur_text_link})`
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
				var many_cur_text = editor.getSelection()

				var arr_sur_text = many_cur_text.split('\n')

				console.log(arr_sur_text)

				for(var index in arr_sur_text)
					{ 
						var cur_text = arr_sur_text[index].trim()
						if (cur_text != '') {
							var cur_text_link = encodeURIComponent(cur_text.trim())
							var subfolder_link = encodeURIComponent(this.settings.subFolders.trim())
							console.log(cur_text);
							cur_text = `[${cur_text}](${subfolder_link}/${cur_text_link})\n`
							editor.replaceSelection(cur_text);
						}
					}

				

			}
		});


		// // This adds a simple command that can be triggered anywhere
		// this.addCommand({
		// 	id: 'open-sample-modal-simple',
		// 	name: 'Open sample modal (simple)',
		// 	callback: () => {
		// 		new SampleModal(this.app).open();
		// 	}
		// });
		// // This adds an editor command that can perform some operation on the current editor instance
		// this.addCommand({
		// 	id: 'sample-editor-command',
		// 	name: 'Sample editor command',
		// 	editorCallback: (editor: Editor, view: MarkdownView) => {
		// 		console.log(editor.getSelection());
		// 		editor.replaceSelection('Sample Editor Command');
		// 	}
		// });
		// // This adds a complex command that can check whether the current state of the app allows execution of the command
		// this.addCommand({
		// 	id: 'open-sample-modal-complex',
		// 	name: 'Open sample modal (complex)',
		// 	checkCallback: (checking: boolean) => {
		// 		// Conditions to check
		// 		const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
		// 		if (markdownView) {
		// 			// If checking is true, we're simply "checking" if the command can be run.
		// 			// If checking is false, then we want to actually perform the operation.
		// 			if (!checking) {
		// 				new SampleModal(this.app).open();
		// 			}

		// 			// This command will only show up in Command Palette when the check function returns true
		// 			return true;
		// 		}
		// 	}
		// });

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
		
			// new Setting(containerEl)
			// .setName('Use [[WikiLinks]]')
			// .setDesc('If .')
			// .addText(text => text
			// 	.setPlaceholder('Enable for using wikilinks')
			// 	.setValue(this.plugin.settings.wikiLinks)
			// 	.onChange(async (value) => {
			// 		console.log('Flag wikilinks: ' + value);
			// 		this.plugin.settings.wikiLinks = value;
			// 		await this.plugin.saveSettings();
			// 	}));
	
	}
}
