using System;
using System.Collections.Generic;
using System.Globalization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace CS.Csharp.CardanoCLI.Models
{
	public partial class Tip
	{
		[JsonProperty("epoch")]
		public long Epoch { get; set; }

		[JsonProperty("hash")]
		public string Hash { get; set; }

		[JsonProperty("slot")]
		public long Slot { get; set; }

		[JsonProperty("block")]
		public long Block { get; set; }

		[JsonProperty("era")]
		public string Era { get; set; }
	}

	public partial class Tip
	{
		public static Tip FromJson(string json) => JsonConvert.DeserializeObject<Tip>(json, QuickType.Converter.Settings);
	}

	public static class Serialize
	{
		public static string ToJson(this Tip self) => JsonConvert.SerializeObject(self, QuickType.Converter.Settings);
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