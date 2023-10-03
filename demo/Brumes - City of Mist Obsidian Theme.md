> This note gives you an example of what you can do using **Brumes** along with some plugins. For more information on how to properly configure your vault, visit the [GitHub repository](https://github.com/4rtamis/obsidian-brumes) of the theme.

***

The following contains examples of story tags, spectrums, statuses, and locations displayed on regular background. Attempting to catch the spook can spark off a chase (<mark class='spectrum'>catch:5</mark>), but the spook starts with <mark class='status'>far-away-3</mark> and will vanish the first time the MC makes a hard move (**Deny Them Something They Want**).

>[!description] Tucked in the basement of a grimey brownstone building overshadowed by Downtown’s great skyscrapers, the Washboard couldn’t be located any lower without dropping into the sewers. Faint cello and piano notes echo in the maze.

**The security team is closely monitoring the place**, with <mark class='tag'>security guards</mark> and <mark class='tag'>security cameras</mark> covering the floor. All access to [[the casino]] and other areas [[inside the hotel]] is strictly limited to staff and guests.

The legend of the Grail and those who seek it is a story about returning to a spiritual point of origin, the source of all things. When the heroic individuals finally prevail over adversity and connect to something deeper in themselves, something that binds all things together, it is immensely restorative and heals not only them but everyone around.

>[!clue] **To excuse her presence at a crime scene**, Martha may feign confiding with the crew and revealing her powers. She will claim she can feel impending death and that she is irresistibly drawn to where the killer will strike, trying to warn the victim.

>[!clue] **She will ascribe her own methods to the killer** (and technically, she wouldn’t be lying), hinting that she thinks the killer somehow causes the victims to die of grief.

>[!special-clue] **The doctor is lying** about what really happened to Martha. He knows that she was on the crime scene but the Avatar of Peter Pan threatened him to death two days ago.

If the group tries to flee the crime scene, you can start a chase scene. Use the following Police Car danger and add the following story tags to the scene : <mark class='tag'>bumpy road</mark>, <mark class='tag'>market place</mark> and <mark class='tag'>rainy day</mark>.

<div class='danger bg3'>
	<h3>Police Squad Car ★★</h3>
	<p>Police squad cars patrol the streets of the City and chase down criminals on wheels.</p>
	<h4>Decommission 3 / Outrun 4</h4>
	<ul>
		<li><b>Vehicle</b> : When the police officers driving the Police Squad Car disembark, create a new Danger: Beat Cops. This happens automatically when <mark class='spectrum'>decommission</mark> is maxed out, but Beat Cops take <mark class='status'>hurt-1</mark>.</li>
	</ul>
	<hr>
	<ul>
		<li>Block your escape (<mark class='status'>blocked-3</mark>)</li>
		<li>Fire while driving, using intermediate or deadly force (<mark class='status'>bean-bag-bruise-2</mark> or <mark class='status'>pellet-wounds-3</mark>)</li>
		<li>Ram with bullbar (<mark class='status'>smashed-4</mark>, but gives itself <mark class='status'>damaged-1</mark>)</li>
	</ul>
	<hr>
	<ul>
		<li>Catch up with a target in flight</li>
	</ul>
</div>

### The Iceberg
If you ever need to draw an iceberg for a case, an organisation, etc... you can use canvas like the one below. Two different canvas are provided, the [[Iceberg.canvas|first one]] being the closest to City of Mist style, and the [[Iceberg Alternate.canvas|second one]] focusing more on readability.

>[!move] Face Danger
>When you use your abilities to avoid an incoming hit, endure harm, resist a malign influence, or hold it together, the MC (or player) will name a status with its tag and tier. Roll+Power. On a 10+, you fend off the effect and take no status at all. On a 7-9, you take the status, but with -1 tier. On a miss, you take the full status.
