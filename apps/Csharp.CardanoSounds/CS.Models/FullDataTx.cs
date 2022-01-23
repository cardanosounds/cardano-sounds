using System;

using System.Globalization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;


namespace CS.Models
{
	public partial class FullDataTx
	{
		[JsonProperty("hash")]
		public string Hash { get; set; }

		[JsonProperty("inputs")]
		public Input[] Inputs { get; set; }

		[JsonProperty("outputs")]
		public Output[] Outputs { get; set; }
	}

	public partial class Input
	{
		[JsonProperty("address")]
		public string Address { get; set; }

		[JsonProperty("amount")]
		public Amount[] Amount { get; set; }

		[JsonProperty("tx_hash")]
		public string TxHash { get; set; }

		[JsonProperty("output_index")]
		public long OutputIndex { get; set; }

		[JsonProperty("collateral")]
		public bool Collateral { get; set; }

		[JsonProperty("data_hash")]
		public object DataHash { get; set; }
	}

	public partial class Amount
	{
		[JsonProperty("unit")]
		public string Unit { get; set; }

		[JsonProperty("quantity")]
		public string Quantity { get; set; }
	}

	public partial class Output
	{
		[JsonProperty("address")]
		public string Address { get; set; }

		[JsonProperty("amount")]
		public Amount[] Amount { get; set; }
	}

	public partial class FullDataTx
	{
		public static FullDataTx FromJson(string json) => JsonConvert.DeserializeObject<FullDataTx>(json, Converter.Settings);
	}

	public static class Serialize
	{
		public static string ToJson(this FullDataTx self) => JsonConvert.SerializeObject(self, Converter.Settings);
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