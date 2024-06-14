console.log("Webpage loaded!");



//get performance, can use localhost to prevent spamming api b/c idk how to make a server
async function getPerformance(beatmapId, mods) {
    //console.log("Getting pp: " + beatmapId);
    //getMods
    //http://127.0.0.1:5000 for local server usage
	

	return fetch(`https://pp.osuck.net/pp?id=${beatmapId}&mods=${mods}`)
		.then(response => {
				return response.json();
		})
		.then(info => {
			return info["pp"]["fc"];
		})
		.catch(() => {
			return 0;
		});
    
}

async function getMods() {
    const hd = await chrome.storage.local.get(['hd']).then((result) => {
		if (result.hd == null) {
			return 0;
		}
		return result.hd * 8;
	});
	const hr = await chrome.storage.local.get(['hr']).then((result) => {
		if (result.hr == null) {
			return 0;
		}
		return result.hr * 16;
	});
	const dt = await chrome.storage.local.get(['dt']).then((result) => {
		if (result.dt == null) {
			return 0;
		}
		return result.dt * 64;
	});
	listMods(hd + hr + dt);
    return hd + hr + dt;
}
async function update() {
	const mods = await getMods();
	//class="beatmapset-beatmap-picker__beatmap beatmapset-beatmap-picker__beatmap--active"
	const select = document.getElementsByClassName("beatmapset-beatmap-picker__beatmap beatmapset-beatmap-picker__beatmap--active")[0];
	if (select != null)
	{
		const performance = await getPerformance(select.href.split("#osu/")[1], mods);
		console.log(select.href.split("#osu/")[1]);
		const title = document.getElementsByClassName("beatmapset-header__details-text-link")[0];
		
		if (title != null)
		{
			const performance_text = document.getElementsByClassName("beatmapset-header__details-text-link pp")[0];
			if (performance_text == null)
			{
				title.insertAdjacentHTML("afterend", `<a class="beatmapset-header__details-text-link pp"> ${performance}-pp</a>`);
			}
			else
			{
				performance_text.innerHTML = " " + performance + "-pp";
			}
				
		}
	}
	
}
//check for mod changes
chrome.storage.onChanged.addListener(async function update() {
	const mods = await getMods();
	//class="beatmapset-beatmap-picker__beatmap beatmapset-beatmap-picker__beatmap--active"
	const select = document.getElementsByClassName("beatmapset-beatmap-picker__beatmap beatmapset-beatmap-picker__beatmap--active")[0];
	if (select != null)
	{
		const performance = await getPerformance(select.href.split("#osu/")[1], mods);
		const title = document.getElementsByClassName("beatmapset-header__details-text-link")[0];
		
		if (title != null)
		{
			const performance_text = document.getElementsByClassName("beatmapset-header__details-text-link pp")[0];
			if (performance_text == null)
			{
				title.insertAdjacentHTML("afterend", `<a class="beatmapset-header__details-text-link pp"> ${performance}-pp</a>`);
			}
			else
			{
				performance_text.innerHTML = " " + performance + "-pp";
			}
				
		}
	}
	
});

function listMods (mods) {
	const modifier = mods == 0 ? "NM" : mods == 8 ? "HD" : mods == 16 ? "HR" : mods == 64 ? "DT" : mods == 24 ? "HDHR" : mods == 72 ? "HDDT" : mods == 80 ? "DTHR" :"HDDTHR";
	const title = document.getElementsByClassName("header-v4__title")[0];
	
	if (document.getElementById("MODS") == null)
	{
		if (title != null)
			title.insertAdjacentHTML("afterend", `<div class="header-v4__title" id="MODS" style="font-weight: bold;">-${modifier}</div>`);
	}
	else
	{
		document.getElementById("MODS").innerHTML = "-" + modifier;
	}
}



const callback = async () => {
    await update();
};

const observer = new MutationObserver(callback);

const pageChange = async (mutationList) => {
	//console.log("page change");
	observer.disconnect();
	//console.log(document.getElementsByClassName("beatmapset-beatmap-picker").length);
	if (document.getElementsByClassName("beatmapset-beatmap-picker").length > 0)
	{
		let attr = { attributes: true, childList: true, characterData: true };
		//console.log("updating");
		sleep(100).then(() => {
			const a = document.getElementsByClassName("beatmapset-beatmap-picker__beatmap");
			observer.observe(document.getElementsByClassName("beatmapset-beatmap-picker__beatmap beatmapset-beatmap-picker__beatmap--active")[0], attr);
			for (const b of a)
			{
				observer.observe(b, attr);
			}
		});
		
		//observer.observe(document.getElementsByClassName("beatmapset-header__diff-name")[0], { childList: true, attributes: true, characterData: true, subtree: true });
		update();
	}

}
if (document.URL.length > 30)
{
	let attr = { attributes: true, childList: true, characterData: true };
	//console.log("updating");
	sleep(100).then(() => {
		const a = document.getElementsByClassName("beatmapset-beatmap-picker__beatmap");
		observer.observe(document.getElementsByClassName("beatmapset-beatmap-picker__beatmap beatmapset-beatmap-picker__beatmap--active")[0], attr);
		for (const b of a)
		{
			observer.observe(b, attr);
		}
	});
	
	//observer.observe(document.getElementsByClassName("beatmapset-header__diff-name")[0], { childList: true, attributes: true, characterData: true, subtree: true });
	update();
}
const pageObserver = new MutationObserver(pageChange);
pageObserver.observe(document.querySelector('html'), { childList: true });

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}