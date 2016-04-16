using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace FYPDataService.FYPInfo
{
    [DataContract]
    public class Person
    {
        [DataMember]
        public string name { get; set; }

        [DataMember]
        public string id { get; set; }

        [DataMember]
        public string type { get; set; }

        public Person(string id, string name, string type)
        {
            this.name = name;
            this.id = id;
            this.type = type;
        }
    }
}