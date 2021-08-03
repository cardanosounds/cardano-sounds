export interface Metadata {
	id: string;
	token_name: string;
	player: string;
	image: string;
	probability: number;
	rarity: string;
	sounds: Sound[];
	arweave_id_sound: string;
	ipfs_id_sound: string;
	arweave_website_uri: string;
}

export interface Sound {
	probability: number;
	filename: string;
	category: string;
}

export interface Metadata {

}