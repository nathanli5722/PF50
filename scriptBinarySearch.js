console.log("Webpage loaded!");

let localMaps = [];
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

function inLocalMaps(beatmapLink) {
	let start = 0;
	let end = localMaps.length - 1;

	while (start <= end) {
		let mid = Math.floor((start + end) / 2);
        //console.log("COMPARING: " + beatmapLink + " - " + localMaps[mid]);

		if (localMaps[mid] == beatmapLink) {
		  return true;
		}

		if (beatmapLink < localMaps[mid]) {
			end = mid - 1;
		} else {
			start = mid + 1;
		}
	}
	return false;
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
    const components = document.getElementsByClassName("sc-eCImPb ms-auto px-2 py-0 btn btn-outline-secondary btn-sm");
	//console.log("got components");
	const mods = await getMods();
    for (const component of components) {
		
		//console.log(component.href);

        if (await inLocalMaps(parseInt(component.href.split("/beatmaps/")[1])) == false)
        {
			const href = component.href.split("/beatmaps/")[1]
			const performance = await getPerformance(href, mods);
			//console.log(`<b id="mr-2 ${component.href}">${performance}pp</b>`);
			addMap(parseInt(component.href.split("/beatmaps/")[1]));
			
			
			//create ok looking html
			if (document.getElementById("mr-2 " + component.href) == null)
			{
				component.parentElement.insertAdjacentHTML("beforebegin", `<b id="mr-2 ${component.href}">${performance}-pp</b>`);
			}
        }
    }
	return;
}

//check for mod changes
chrome.storage.onChanged.addListener(async () => {
	const mods = await getMods();
	

    const components = document.getElementsByClassName("sc-eCImPb ms-auto px-2 py-0 btn btn-outline-secondary btn-sm");
	//console.log("got components");
	
    for (const component of components) {
		
		const href = component.href.split("/beatmaps/")[1];
		const performance = await getPerformance(href, mods);
		
        if (await inLocalMaps(parseInt(component.href.split("/beatmaps/")[1])) == true)
        {
			
			//console.log("Changing value");
			
			const e = document.getElementById("mr-2 " + component.href);
			if (e != null)
			{
				e.innerHTML = performance + "-pp";
			}
        }
		else
		{
			//console.log(`<b id="mr-2 ${component.href}">${performance}pp</b>`);
			addMap(parseInt(component.href.split("/beatmaps/")[1]));
			
			
			//create ok looking html
			if (document.getElementById("mr-2 " + component.href) == null)
			{
				component.parentElement.insertAdjacentHTML("beforebegin", `<b id="mr-2 ${component.href}">${performance}-pp</b>`);
			}
		}
    }
	return;
});

function listMods (mods) {
	const modifier = mods == 0 ? "NM" : mods == 8 ? "HD" : mods == 16 ? "HR" : mods == 64 ? "DT" : mods == 24 ? "HDHR" : mods == 72 ? "HDDT" : mods == 80 ? "DTHR" :"HDDTHR";
	const title = document.getElementsByClassName("mb-0 mr-4")[0];
	
	if (document.getElementById("MODS") == null)
	{
		if (title != null)
			title.insertAdjacentHTML("afterend", `<h1 class="mb-0 mr-4" id="MODS">${modifier}</h1>`);
	}
	else
	{
		document.getElementById("MODS").innerHTML = modifier;
	}
}

function addMap (beatmapLink) {
	let start = 0;
	let end = localMaps.length - 1;
    let mid = 0;

	while (start <= end) {
		mid = Math.floor((start + end) / 2);

		if (localMaps[mid] == beatmapLink) {
		  return;
		}

		if (beatmapLink < localMaps[mid]) {
			end = mid - 1;
		} else {
			start = mid + 1;
		}
	}
	if (localMaps[mid] < beatmapLink) {
        localMaps.splice(mid + 1, 0, beatmapLink);
    }
    else {
        localMaps.splice(mid, 0, beatmapLink);
    }
}


//check for changes in infinite-scroll-component row - check - untested
//select this for href: sc-eCImPb jaxPta ms-auto px-2 py-0 mr-1 btn btn-outline-secondary btn-sm
//this is href https://osu.ppy.sh/beatmaps/2723086
//add adjacent html to this before beginning

const callback = async (mutationList) => {
    //console.log("List has expanded");
    await update();
};


const observer = new MutationObserver(callback);


//when clicking things, it just adds to body instead of reloading, 
//so should use another mutation object to see when webpage has changed to a listing

const pageChange = async (mutationList) => {
	for (const mutation of mutationList) {
		if (mutation.type === 'childList') {
			//console.log("Page has changed");
			
			//restart
			
			observer.disconnect();
			const a = document.getElementsByClassName("pt-4 container")[0];
			if (a.className === "pt-4 container")
			{
				//console.log("in listpage");
				await update();
				observer.observe(document.getElementsByClassName("infinite-scroll-component row")[0], { childList: true });
				
			}
			else
			{
				//when go back to main page, then empty
				//console.log("emptied maps");
				localMaps = [];
			}
		}
	}
}

const pageObserver = new MutationObserver(pageChange);
pageObserver.observe(document.getElementsByClassName("pt-4 container")[0].parentElement, { childList: true });


//if they skipped homepage, still have to print points
if (document.URL.length > 26) {
	observer.observe(document.getElementsByClassName("infinite-scroll-component row")[0], { childList: true });
	update().then( () => {
		//console.log(":)");
	});
}
