using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace FYPDataService.FYPInfo
{
    [DataContract(Name = "Message box")]
    public class MessageBox
    {
         [DataMember(Name = "Message List")]
        public List<Message> messageList { get; set; }
         [DataMember(Name = "Course Id")]
        public string courseId { get; set; }
         [DataMember(Name = "Lecture session")]
        public string lectureSection { get; set; }
         [DataMember(Name = "Last modified date")]
         public string lastModifiedDate { get; set; }


        public MessageBox(string courseId, string lectureSection)
        {
            this.courseId = courseId;
            this.lectureSection = lectureSection;
            this.messageList = new List<Message>();
            lastModifiedDate = DateTime.Now.ToString();
        }

        public MessageBox(string courseId)
        {
            this.courseId = courseId;
            this.messageList = new List<Message>();
            lastModifiedDate = DateTime.Now.ToString();
        }

        public void addMessage(Message message)
        {
            messageList.Add(message);
            lastModifiedDate = DateTime.Now.ToString();
        }

        public void addAnswerToMessage(int messageId, Answer answer)
        {
            foreach (Message message in messageList) {
                if (message.messageId == messageId) {
                    message.addAnswer(answer);
                    break;
                }
            }
            lastModifiedDate = DateTime.Now.ToString();
        }
    }
}