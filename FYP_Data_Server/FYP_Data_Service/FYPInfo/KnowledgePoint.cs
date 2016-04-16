using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace FYPDataService.FYPInfo
{
    [DataContract]
    public class KnowledgePoint
    {
        [DataMember(Name = "Knowledge Point name")]
        public string name { get; set; }
        [DataMember(Name = "Knowledge Point ID")]
        public int id { get; set; }
        [DataMember(Name = "Course ID")]
        public string courseId { get; set; }
        
        public Priority priority { get; set; }
        [DataMember(Name = "Priority")]
        public string priorityString {
            get { return Enum.GetName(typeof(Priority), this.priority); }
            set { this.priority = (Priority)Enum.Parse(typeof(Priority), value); }
        }
        [DataMember(Name = "Date of create")]
        public string createDate { get; set; }
        [DataMember(Name = "Date of last modified")]
        public string modifiedDate { get; set; }

        //Parents
        [DataMember(Name = "Knowledge point parents")]
        public List<int> parentsKnowledgePointsId { get; set; }

        //Display location in canvas
        [DataMember(Name = "Knowledge point location X")]
        public int posX { get; set; }
        [DataMember(Name = "Knowledge point location Y")]
        public int posY { get; set; }

        //Contents
        [DataMember(Name = "Related Assets")]
        public List<AssetPointer> assets { get; set; }
        [DataMember(Name = "Related message in Q&A")]
        public MessageBox messageBox { get; set; }
        [DataMember(Name = "Related self test set")]
        public List<SelfTestQuesion> testSet { get; set; }


        public KnowledgePoint(int id, string courseId, string name, int posX, int posY)
        {
            this.id = id;
            this.name = name;
            this.courseId = courseId;
            this.createDate = DateTime.Now.ToString();
            this.modifiedDate = DateTime.Now.ToString();
            this.posX = posX;
            this.posY = posY;
            this.parentsKnowledgePointsId = new List<int>();
            this.assets = new List<AssetPointer>();
            this.messageBox = new MessageBox(courseId);
            this.testSet = new List<SelfTestQuesion>();
            //this.modifiedDate = DateTime.Now.ToString();
        }

        public void setPriority(Priority priority) {
            this.priority = priority;
            this.modifiedDate = DateTime.Now.ToString();
        }

        public void updateKnowledgePoint(KnowledgePoint knowledgePoint)
        {
            if (this.id == knowledgePoint.id)
            {
                updateName(knowledgePoint.name);
                updatePosition(knowledgePoint.posX, knowledgePoint.posY);
                foreach (AssetPointer pointer in knowledgePoint.assets)
                {
                    addAsset(pointer);
                }
                foreach (int parentId in knowledgePoint.parentsKnowledgePointsId)
                {
                    addParent(parentId);
                }
            }
        }

        public void updateName(string name)
        {
            this.name = name;
            this.modifiedDate = DateTime.Now.ToString();
        }

        public void updatePosition(int x, int y)
        {
            this.posX = x;
            this.posY = y;
            this.modifiedDate = DateTime.Now.ToString();
        }

        public void addParent(int parent)
        {
            this.parentsKnowledgePointsId.Add(parent);
            this.modifiedDate = DateTime.Now.ToString();
        }

        public void addAsset(AssetPointer newAssetPointer)
        {
            this.assets.Add(newAssetPointer);
            this.modifiedDate = DateTime.Now.ToString();
        }

        public void addMessage(Message message) {
            this.messageBox.addMessage(message);
        }

        public void addTestQuestion(SelfTestQuesion question) {
            this.testSet.Add(question);
        }

       
    } 
    [DataContract(Name = "Priority")]
        public enum Priority { 
            High = 1100,
            Medium,
            Low
        }
}