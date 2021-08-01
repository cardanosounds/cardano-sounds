using System;

using System.Globalization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace CS.Models
{
	public partial class Metadata
	{
		[JsonProperty("id")]
		public string Id { get; set; }

		[JsonProperty("token_name")]
		public string TokenName { get; set; }

		[JsonProperty("player")]
		public string Player { get; set; }

		[JsonProperty("image")]
		public string PlayerImage { get; set; }

		[JsonProperty("probability")]
		public long Probability { get; set; }

		[JsonProperty("rarity")]
		public string Rarity { get; set; }

		[JsonProperty("sounds")]
		public Sound[] Sounds { get; set; }

		[JsonProperty("arweave_id_sound")]
		public string ArweaveIdSound { get; set; }

		[JsonProperty("ipfs_id_sound")]
		public string IpfsIdSound { get; set; }

		[JsonProperty("arweave_website_uri")]
		public string ArweaveWebsiteUri { get; set; }
	}

	public partial class Sound
	{
		[JsonProperty("probability")]
		public long Probability { get; set; }

		[JsonProperty("filename")]
		public string Filename { get; set; }

		[JsonProperty("category")]
		public string Category { get; set; }
	}

	public partial class Metadata
	{
		public static Metadata FromJson(string json) => JsonConvert.DeserializeObject<Metadata>(json, Converter.Settings);
	}

	public static class Serialize
	{
		public static string ToJson(this Metadata self) => JsonConvert.SerializeObject(self, Converter.Settings);
	}

	internal static class Converter
	{
		public static readonly JsonSerializerSettings Settings = new JsonSerializerSettings
		{
			MetadataPropertyHandling = MetadataPropertyHandling.Ignore,
			DateParseHandling = DateParseHandling.None,
			Converters = {
				new IsoDateTimeConverter { DateTimeStyles = DateTimeStyles.AssumeUniversal }
			},
		};
	}
}
