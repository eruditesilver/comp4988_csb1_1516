using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace FYPDataService.FYPInfo
{
    [DataContract(Name = "Self test question")]
    public class SelfTestQuesion
    {
        [DataMember(Name = "Question")]
        public string question { get; set; }
        [DataMember(Name = "Answer Key")]
        public string answerKey { get; set; }

        public SelfTestQuesion(string question)
        {
            this.question = question;
        }

        public SelfTestQuesion(string question, string answerKey)
        {
            this.question = question;
            this.answerKey = answerKey;
        }



    }
}