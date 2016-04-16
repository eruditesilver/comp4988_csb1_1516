using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace FYPDataService.FYPInfo
{
    [DataContract(Name = "Answer")]
    public class Answer
    {
        public AnswerType type { get; set; }
        [DataMember(Name = "Answer type")]
        public string answerTypeString
        {
            get { return Enum.GetName(typeof(AnswerType), this.type); }
            set { this.type = (AnswerType)Enum.Parse(typeof(AnswerType), value); }
        }


        [DataMember(Name = "Answer")]
        public string answer { get; set; }

        public Answer(AnswerType answerType, string answer)
        {
            // TODO: Complete member initialization
            this.type = answerType;
            this.answer = answer;
        }

        public Answer(int answerType, string answer)
        {
            this.type = (AnswerType)answerType;
            this.answer = answer;
        }

        public Answer(string answerType, string answer)
        {
            this.type = (AnswerType)Enum.Parse(typeof(AnswerType), answerType);
            this.answer = answer;
        }


    }
    [DataContract(Name = "Answer type")]
    public enum AnswerType
    {
        [EnumMember(Value = "Audio")]
        Audio = 2100,
        [EnumMember(Value = "Text")]
        Text,
        [EnumMember(Value = "No Answer")]
        NoAnswer
    };
}