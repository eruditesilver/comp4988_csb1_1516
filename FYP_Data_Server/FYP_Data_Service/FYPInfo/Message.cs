using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace FYPDataService.FYPInfo
{
    [DataContract(Name = "Q&A")]
    public class Message
    {
        public static int noOfMessage = 1;
        public Message(string username, string question)
        {
            // TODO: Complete member initialization
            this.askBy = username;
            this.question = question;
            this.createTime = DateTime.Now.ToString();
            this.messageId = noOfMessage;
            this.answers = new List<Answer>();
            noOfMessage++;
        }

        public Message(int id, string username, string question)
        {
            // TODO: Complete member initialization
            this.askBy = username;
            this.question = question;
            this.createTime = DateTime.Now.ToString();
            this.messageId = id;
            this.answers = new List<Answer>();
            noOfMessage++;
        }

        public void addAnswer(Answer answer)
        {
            answers.Add(answer);
        }
        [DataMember(Name = "Q&A ID")]
        public int messageId { get; set; }
        [DataMember(Name = "Date of create")]
        public string createTime { get; set; }
        [DataMember(Name = "Ask by")]
        public string askBy { get; set; }
        [DataMember(Name = "Question")]
        public string question { get; set; }
        [DataMember(Name = "Answer List")]
        public List<Answer> answers { get; set; }
    }
}