using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace CS.Models
{
    public class FullTransaction : IncommingTransaction
    {
       public Metadata Metadata { get; set; }
    }
}
