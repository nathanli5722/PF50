const check = "#9ba1ab";
const uncheck = "#011433";


document.addEventListener('DOMContentLoaded', async () => {
	const hd = await chrome.storage.local.get(['hd']).then((result) => {
		if (result.hd == null) {
			return 0;
		}
		return result.hd;
	});
	const hr = await chrome.storage.local.get(['hr']).then((result) => {
		if (result.hr == null) {
			return 0;
		}
		return result.hr;
	});
	const dt = await chrome.storage.local.get(['dt']).then((result) => {
		if (result.dt == null) {
			return 0;
		}
		return result.dt;
	});
	console.log(`${hd} - ${hr} - ${dt}`);
	
	
	if (hd == 1)
	{
		const c = document.getElementById("hidden");
		c.checked = true;
		document.getElementsByClassName("button hd")[0].style.background = check;
	}
	else
	{
		document.getElementById("hidden").checked = false;
		document.getElementsByClassName("button hd")[0].style.background = uncheck;
	}
	if (hr == 1)
	{
		document.getElementById("hardrock").checked = true;
		document.getElementsByClassName("button hr")[0].style.background = check;
	}
	else
	{
		document.getElementById("hardrock").checked = false;
		document.getElementsByClassName("button hr")[0].style.background = uncheck;
	}
	if (dt == 1)
	{
		document.getElementById("doubletime").checked = true;
		document.getElementsByClassName("button dt")[0].style.background = check;
	}
	else
	{
		document.getElementById("doubletime").checked = false;
		document.getElementsByClassName("button dt")[0].style.background = uncheck;
	}
	
	document.getElementById('hidden').addEventListener('change', (event) => {
		console.log('hd change ' + event.currentTarget.checked);
		if (event.currentTarget.checked) {
			//checked
			//8
			event.currentTarget.parentElement.parentElement.style.background = check;
			chrome.storage.local.set({hd: 1}).then(() => {console.log("hd set");});
		}	
		else {
			//not checked
			event.currentTarget.parentElement.parentElement.style.background = uncheck;
			chrome.storage.local.set({hd: 0}).then(() => {console.log("hd set 0");});
		}
	});
	document.getElementById('hardrock').addEventListener('change', (event) => {
		console.log('hr change ' + event.currentTarget.checked);
		if (event.currentTarget.checked) {
			//checked
			//16
			event.currentTarget.parentElement.parentElement.style.background = check;
			chrome.storage.local.set({hr: 1}).then(() => {console.log("hr set");});
		}
		else {
			//not checked
			event.currentTarget.parentElement.parentElement.style.background = uncheck;
			chrome.storage.local.set({hr: 0}).then(() => {console.log("hr set 0");});
		}
	});
	document.getElementById('doubletime').addEventListener('change', (event) => {
		console.log('dt change ' + event.currentTarget.checked);
		if (event.currentTarget.checked) {
			//checked
			//64
			event.currentTarget.parentElement.parentElement.style.background = check;
			chrome.storage.local.set({dt: 1}).then(() => {console.log("dt set");});
		}
		else {
			//not checked
			event.currentTarget.parentElement.parentElement.style.background = uncheck;
			chrome.storage.local.set({dt: 0}).then(() => {console.log("dt set 0");});
		}
	});
	const buttons = document.getElementsByClassName("button");
	for (const button of buttons)
	{
		button.addEventListener("click", () => {
			
			
			if (button.className === "button hd")
			{
				document.getElementById('hidden').click();
			}
			if (button.className === "button hr")
			{
				document.getElementById('hardrock').click();
			}
			if (button.className === "button dt")
			{
				document.getElementById('doubletime').click();
			}
		});
	}
});