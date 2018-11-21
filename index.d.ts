interface HostData {
	host_id: number;
	target_id: number;
	host_login: string;
	target_login: string;
	host_display_name: string;
	target_display_name: string;
}
interface HostsResponse {
	hosts: HostData[];
}

interface StreamsData {
	id: string;
	user_id: string;
	user_name: string;
	game_id: string;
	community_ids: string[];
	type: string;
	title: string;
	viewer_count: number;
	started_at: string;
	language: string;
	thumbnail_url: string;
	tag_ids: string[];
}

interface StreamsResponse {
	data: StreamsData[];
}

interface RejectResponse {
	status: number;
	text: string;
	response: string;
}
