using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace CS.Models
{
    public class TxStatus
    {
        public TxStatus(string id, string txHash, int outputIndex, string status, DateTime created)
        {
            Id = id;
            Status = status;
            Tx_Hash = txHash;
            Output_Index = outputIndex;
            Created = created;
        }

        public string Id { get; set; }
        public string Tx_Hash { get; set; }
        public int Output_Index { get; set; }
        public string Status { get; set; }
        public DateTime Created { get; set; }
    }
}
