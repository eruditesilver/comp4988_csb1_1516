using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace FYPDataService.FYPInfo
{
    [DataContract(Name = "Self test result")]
    public class SelfTestResult
    {
        [DataMember(Name = "Question ID")]
        public int questionId { get; set; }
        [DataMember(Name = "Score")]
        public int score { get; set; }
        [DataMember(Name = "User ID")]
        public int userId { get; set; }
        [DataMember(Name = "User Name")]
        public string username { get; set; }
        [DataMember(Name = "Answer")]
        public string answer { get; set; }
        
        
    }
}