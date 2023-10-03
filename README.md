# Brumes - City of Mist Obsidian Theme

Brumes is an [Obsidian](https://obsidian.md) theme based on the award-winning tabletop role-playing game [City of Mist](https://cityofmist.co/). It aims to imitate the overall style of the City of Mist rulebooks and to provide easy-to-use features for the MC to easily prepare her cases.

## Credits

This theme is developed by [**@4rtamis**](https://github.com/4rtamis).

City of Mist is a game created by **Amìt Moshe**. This theme is heaviliy based on the [City of Mist - Style Guide](https://preview.drivethrurpg.com/en/product/363318/city-of-mist-garage-style-guide) published by Son of Oak Game Studio.

The workflow and the Gruntfile used to develop this theme are based on [@kepano](https://www.buymeacoffee.com/kepano)'s famous [Minimal](https://github.com/kepano/obsidian-minimal) theme.

## Screenshots

![](./doc/demo_light_theme.PNG)
![](./doc/demo_dark_theme.PNG)

## Installation

To install Brumes:

1. Download `theme.css` and move it into the folder `.obsidian/themes/` located in your vault folder.
2. Rename this CSS file to `Brumes.css`.
3. In Obsidian, go to `Settings -> Appearance -> Themes`, and select `Brumes`.

## Companion plugins

The following plugins should be installed alongside Brumes:

-   [Templater](https://github.com/SilentVoid13/Templater) is a community plugin that defines a powerful templating language right inside Obsidian. It is used to facilitate the creation of **dangers**, **tags**, **statuses** and **spectrums**.
-   [Canvas CSS Class](https://github.com/Lisandra-dev/obsidian-canvas-css-class) is a community plugin that can add CSS classes to canvas. It is especially useful to create **Icebergs**.

### Templater

You can install Templater via the Community Plugins tab within Obsidian.

Go to `Settings -> Community plugins -> Browse`. You might need to turn off "Restricted mode". Simply search for "Templater" and install it. You can restart the obsidian app after the installation to make sure everything is working properly.

> [!NOTE]
> Templater is used to facilitate the creation of **dangers**, **tags**, **statuses** and **spectrums** inside the editor. Once the plugins installed, you will need to create a `Templates` folder in which you will paste the actual templates for the aforementioned elements. You can find these templates in the [Features](#features) section. Do not forget to add this folder to Templater settings by going to `Settings -> Community plugins -> Templater -> Options -> Template folder location`.

### Canvas CSS Class

You need to manually install this plugin.

Download the [latest release](https://github.com/Lisandra-dev/obsidian-canvas-css-class/releases) (`canvas-css-class.zip`) and unzip it in the `.obsidian/plugins` folder of your vault.

## Features

Among the common elements of an Obsidian theme (headings, paragraphs, fonts, colors...), Brumes implements some whole new elements that the MC may find useful for preparing City of Mist cases.

### Tags, statuses & spectrums

![Tags, statuses & spectrums](./doc/features/tags_statuses_spectrums.png)

Main gameplay elements in City of Mist, Brumes enables you to add tags, statuses and spectrums to your Obsidian notes. Use the following HTML block whenever you need them:

```html
<mark class="tag">security guards</mark>
<mark class="status">far-away-3</mark>
<mark class="spectrum">catch:5</mark>
```

To facilitate the writing process, you can make use of [Templater](#templater). Inside your templates folder in your vault, create a new note named `Tags, Statuses & Spectrums`. Then, copy and paste the following code:

```js
<%*
selection = tp.file.selection();
const type = await tp.system.suggester(["Tag","Status","Spectrum"], ["tag","status","spectrum"]);

if (type === undefined || type === null) {
	return;
} else {
	return "<mark class='" + type + "'>" + selection + "</mark>";
}
%>
```

Whenever you need to add one of these, you can select the corresponding text and use the shortcut `Alt+E`. Use the prompt to select either the tag, status or spectrum format.

### Dangers

![Dangers](./doc/features/dangers.png)

Most of the tense scenes of City of mist involve one or more dangers. Brumes enables you to create custom Danger blocks using the following HTML code:

```html
<div class="danger bg0">
	<h3>Danger Name ★★★</h3>
	<p>Description of the danger</p>
	<h4>Spectrum 2 / Spectrum 5</h4>
	<ul>
		<li><b>Custom Move</b> : Description of the custom move.</li>
		<li><b>Custom Move</b> : Description of the custom move.</li>
	</ul>
	<hr />
	<ul>
		<li>Major move description</li>
	</ul>
	<hr />
	<ul>
		<li>Minor move description</li>
	</ul>
</div>
```

> [!NOTE]
> There are 8 background colors available for dangers. Simply pick one of the 8 corresponding HTML classes at the top of the block : `bg0`, `bg1`, `bg2`, `bg3`, `bg4`, `bg5`, `bg6` or `bg7`.

You can also add the following template to [Templater](#templater). Add a new note named `Danger` to your templates folder. The compy and paste this code:

```js
<%*
selection = tp.file.selection();
let min = 0;
let max = 7;
let background = Math.floor(Math.random() * (max - min + 1) + min);
return(`
<div class='danger bg${background}'>
	<h3>${selection} ★★★</h3>
	<p>Description of the danger</p>
	<h4>Spectrum 2 / Spectrum 5</h4>
	<ul>
		<li><b>Custom Move</b> : Description of the custom move.</li>
		<li><b>Custom Move</b> : Description of the custom move.</li>
	</ul>
	<hr>
	<ul>
		<li>Major move description</li>
	</ul>
	<hr>
	<ul>
		<li>Minor move description</li>
	</ul>
</div>
`);
%>
```

Now, you can use `Alt+E` to open the template prompt and select your danger template. Note that every new danger block gets assigned a background color when initialized.

### Clues

![Clues](./doc/features/clues.png)

As City of Mist is by essence an investigation game, clues are crucial when writing cases. Brumes enables the MC to easily add clue blocks in two different styles.

-   **Single case clues** (yellow) are relevant to the currently played case. They are focused on short-term gameplay elements.
-   **Long-term clues** (red) are used to hide clues for the bigger picture. They are especially useful when writing a whole serie of cases that are somehow linked to each other.

Brumes makes use of [callouts](https://help.obsidian.md/Editing+and+formatting/Callouts) to design clues. Use the `clue` type identifier for single case clues and the `special-clue` type identifier for long-term clues.

```md
> [!clue] **She will ascribe her own methods to the killer** (and technically, she wouldn’t be lying), hinting that she thinks the killer somehow causes the victims to die of grief.

> [!special-clue] **The doctor is lying** about what really happened to Martha. He knows that she was on the crime scene but the Avatar of Peter Pan threatened him to death two days ago.
```

### Moves

![Moves](./doc/features/moves.png)

If needed, the MC can create **custom moves**, specific to a situation or a character. Brumes enables you to format those moves using a [callout](https://help.obsidian.md/Editing+and+formatting/Callouts) with the type identifier `move`.

```md
> [!move] Face Danger
> When you use your abilities to avoid an incoming hit, endure harm, resist a malign influence, or hold it together, the MC (or player) will name a status with its tag and tier. Roll+Power. On a 10+, you fend off the effect and take no status at all. On a 7-9, you take the status, but with -1 tier. On a miss, you take the full status.
```

### Descriptions

![Descriptions](./doc/features/descriptions.png)

If you need to prepare some paragraphs to read aloud when your players enter in a specific location, or if you need to write beforehand the voice over that will start the next session, you can use a description block.

Brumes uses the custom [callout](https://help.obsidian.md/Editing+and+formatting/Callouts) type identifier `description` to create such blocks in Markdown.

```md
> [!description] Tucked in the basement of a grimey brownstone building overshadowed by Downtown’s great skyscrapers, the Washboard couldn’t be located any lower without dropping into the sewers. Faint cellwo and piano notes echo in the maze.
```

### Icebergs

![Icebergs](./doc/features/icebergs.png)
![Icebergs Alt](./doc/features/icebergs_alt.png)

TODO: Add instructions on how to create Icebergs.

## Contributing

## Contact

## License
