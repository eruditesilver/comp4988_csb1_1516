using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace FYPDataService.FYPInfo
{
    [DataContract]
    public class FYPMember
    {
        [DataMember]
        public string name { get; set; }

        [DataMember]
        public string email { get; set; }

        public FYPMember(string name, string email)
        {
            // TODO: Complete member initialization
            this.name = name;
            this.email = email;
        }
    }
}
