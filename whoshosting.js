let input = document.getElementById("whos-hosting");
let res = document.getElementById("response-pre");
document.getElementById("send-button").onclick = () => {
	getUserId(input.value, (data) => {
		console.log(data);
		if (data.data != null && data.data.length > 0) {
			getHostingChannels(data.data[0].user_id, (data) => {
				console.log(data);
				if (data.hosts != null && data.hosts.length > 0) {
					res.innerHTML = "Hosting " + input.value + ":</br>";
					data.hosts.forEach((data) => {
						res.innerHTML += data.host_display_name + "    " + "<a href='https://twitch.tv/" + data.host_login + ">Twitch</a></br>";
					});
				} else {
					console.error("invalid response", data);
				}
			}, (data) => {
				res.innerText = JSON.stringify(data);
			})
		} else {
			console.error("invalid response", data);
		}
	}, (data) => {
		res.innerText = JSON.stringify(data);
	})
};

/**
 * @param {string[]|string} names
 * @param {(data: StreamsResponse) => void} resolve
 * @param {(data: RejectResponse) => void} reject
 */
function getUserId(names, resolve, reject) {
	let query = "";
	let delim = "?";
	if (Array.isArray(names)) {
		for (name in names) {
			query += delim + "user_login=" + name;
			delim = "&";
		}
	} else {
		query += delim + "user_login=" + names;
	}
	console.log(query)
	let xhr = new XMLHttpRequest();
	xhr.open("GET", "https://api.twitch.tv/helix/streams" + query, true);
	xhr.setRequestHeader("client-id", "97yq2gelafkeg261vnwsym9jr9jitj");
	xhr.onreadystatechange = function () {
		if (this.readyState === XMLHttpRequest.DONE) {
			if (this.status !== 200) {
				reject({
					status: this.status,
					text: this.statusText,
					response: this.responseText
				});
			} else {
				let json = JSON.parse(this.responseText);
				resolve(json);
			}
		}
	};
	xhr.send(null);
}

/**
 * @param {number} id
 * @param {(data: HostsResponse) => void} resolve
 * @param {(data: RejectResponse) => void} reject
 */
function getHostingChannels(id, resolve, reject) {
	let query = "?include_logins=1&target=" + id;
	let xhr = new XMLHttpRequest();
	xhr.open("GET", "https://tmi.twitch.tv/hosts" + query, true);
	xhr.setRequestHeader("client-id", "97yq2gelafkeg261vnwsym9jr9jitj");
	xhr.onreadystatechange = function () {
		if (this.readyState === XMLHttpRequest.DONE) {
			if (this.status !== 200) {
				reject({
					status: this.status,
					text: this.statusText,
					response: this.responseText
				});
			} else {
				let json = JSON.parse(this.responseText);
				resolve(json);
			}
		}
	};
	xhr.send(null);
}
