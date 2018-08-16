var https = require("https");

var streams = {};

var whitelist = [
	"speedrun",
	"speedruns",
	"speed run",
	"speed runs",
	"any%",
	"100%",
	"no im/ww",
	"all dungeons",
	"mst",
	"no wrong warp",
	"glitchless",
	"ganonless",
];

var blacklist = [
	"rando",
	"casual",
	"blind"
];

function process_streams() {
	document.write("<pre><code style=\"display: block; white-space: pre-line;\">");
	for (var key in streams) {
		var disp_name = streams[key].user_info.display_name;
		var title = streams[key].stream_info.title;
		var type = streams[key].stream_info.type;
		document.write(disp_name + " is live! - " + title + "<br>");
	}
	document.write("</code></pre>");
}

function get_streams_info() {
	var params = "";
	for (var key in streams) {
		params += "id=" + streams[key].stream_info.user_id + "&";
	}
	https.get({
		hostname: "api.twitch.tv",
		path: "/helix/users?" + params,
		method: "GET",
		headers: {
			"client-id": "97yq2gelafkeg261vnwsym9jr9jitj",
		},
	}, (res) => {
		var body = "";
		res.on('data', (chunk) => body += chunk);
		res.on('end', () => {
			var json = JSON.parse(body);
			[].forEach.call(json.data, (user_info) => {
				streams[user_info.id].user_info = user_info;
			});
			process_streams();
		});
	}
	).on('error', (e) => console.log(e));
}

function get_streams_for_game(id) {
	streams = {};
	https.get({
		hostname: "api.twitch.tv",
		path: "/helix/streams?game_id=" + id,
		method: "GET",
		headers: {
			"client-id": "97yq2gelafkeg261vnwsym9jr9jitj",
		},
	}, (res) => {
		var body = "";
		res.on('data', (chunk) => body += chunk);
		res.on('end', () => {
			var json = JSON.parse(body);
			[].forEach.call(json.data, (stream) => {
				var title = stream.title.toLowerCase();
				if (whitelist.some((v) => title.indexOf(v) > -1) && blacklist.every((v) => title.indexOf(v) == -1)) {
					streams[stream.user_id] = {};
					streams[stream.user_id].stream_info = stream;
				}
			});
			get_streams_info();
		});
	}
	).on('error', (e) => console.log(e));
}

get_streams_for_game(11557);
