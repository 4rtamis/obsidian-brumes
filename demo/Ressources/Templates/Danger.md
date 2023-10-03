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