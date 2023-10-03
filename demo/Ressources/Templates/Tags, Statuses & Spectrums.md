<%* 
selection = tp.file.selection();
const type = await tp.system.suggester(["Tag","Status","Spectrum"], ["tag","status","spectrum"]);

if (type === undefined || type === null) {
	return;
} else {
	return "<mark class='" + type + "'>" + selection + "</mark>";
}
%>