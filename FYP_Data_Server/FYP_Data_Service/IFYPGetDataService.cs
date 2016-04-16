using FYPDataService.FYPInfo;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;

namespace FYPDataService
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the interface name "IService1" in both code and config file together.
    [ServiceContract]
    public interface IFYPGetDataService
    {
        [OperationContract]
        [WebInvoke(Method = "GET", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped, UriTemplate = "getFYPInfo")]
        List<FYPMember> GetFYPInfo();

        [OperationContract]
        [WebInvoke(Method = "GET", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped, UriTemplate = "getMessageList/{courseId}_{section}")]
        MessageBox GetMessageList(string courseId, string section);

        [OperationContract]
        [WebInvoke(Method = "GET", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped, UriTemplate = "getKnowledgePoints/{courseId}_{section}")]
        List<KnowledgePoint> GetKnowledgePoints(string courseId, string section);

        [OperationContract]
        [WebInvoke(Method = "GET", ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped, UriTemplate = "getData/{value}")]
        string GetData(string value);

        [OperationContract]
        [WebInvoke(Method = "GET", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped, UriTemplate = "insertAccount/{name}/{password}/{accountType}")]
        string InsertAccount(string name, string password, string accountType);

        [OperationContract]
        [WebInvoke(Method = "GET", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped, UriTemplate = "getAllAccount")]
        List<Person> GetAllAccount();

        //Authorentication
        [OperationContract]
        [WebInvoke(Method = "GET", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped, UriTemplate = "login/{username}/{password}")]
        string login(string username, string password); //Return a user key

         [OperationContract]
        [WebInvoke(Method = "GET", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped, UriTemplate = "getMessageBox/{courseCode}_{courseNumber}")]
        MessageBox GetMessageBox(string courseCode, string CourseNumber);

         [OperationContract]
         [WebInvoke(Method = "GET", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped, UriTemplate = "getKnowledgePointList/{courseCode}_{courseNumber}")]
         List<KnowledgePoint> GetKnowledgePointList(string courseCode, string CourseNumber);

         [OperationContract]
         [WebInvoke(Method = "GET", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped, UriTemplate = "insertNewMessage/{courseCode}_{courseNumber}/{userId}_{message}")]
         string insertNewMessage(string courseCode, string courseNumber, string userId, string message);

         [OperationContract]
         [WebInvoke(Method = "GET", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped, UriTemplate = "insertNewMessage/{courseCode}_{courseNumber}/{messageId}_{answerTypeId}_{answer}")]
         string insertAnswerToMessage(string courseCode, string courseNumber, string messageId, string answer, string answerTypeId);

         [OperationContract]
         [WebInvoke(Method = "GET", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped, UriTemplate = "getUserSelfTestRecord/{userId}")]
         List<SelfTestResult> getUserSelfTestResult(string userId);

         [OperationContract]
         [WebInvoke(Method = "GET", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped, UriTemplate = "getSelfTestRecord/{questionId}")]
         List<SelfTestResult> getSelfTestResult(string questionId);

         [OperationContract]
         [WebInvoke(Method = "POST", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped, UriTemplate = "updateKnowledgePoints")]
         string updateKnowledgePoints(List<KnowledgePoint> updatedKnowledgePointList);
        
         [OperationContract]
         [WebInvoke(Method = "POST", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped, UriTemplate = "updateKnowledgePoint")]
         string updateKnowledgePoint(KnowledgePoint updatedKnowledgePoint);

         [OperationContract]
         [WebInvoke(Method = "GET", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped, UriTemplate = "deleteKnowledgePoint/{kpId}")]
         string deleteKnowledgePoint(string kpId);

         [OperationContract]
         [WebInvoke(Method = "GET", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped, UriTemplate = "insertNewSelfTestRecord/{userId}/{selfTestId}_{answer}")]
         string insertNewSelfTestRecord(string userId, string selfTestId, string answer);

         [OperationContract]
         [WebInvoke(Method = "GET", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped, UriTemplate = "marking/{userId}_{selfTestId}_{score}")]
         string markASelfTestRecord(string userId, string score, string selfTestId);

         [OperationContract]
         [WebInvoke(Method = "POST", UriTemplate = "uploadFile/{courseCode}_{courseNumber}_{folderName}_{filename}")]
         string uploadFile(string courseCode, string courseNumber, string folderName, string filename, Stream stream);

         [OperationContract]
         [WebInvoke(Method = "GET", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped, UriTemplate = "loginToSystem/{username}_{password}")]
         Person loginToSystem(string username, string password);

        /*
        //General
        string getCourseIdBy(string courseCode, string courseNumber);

        //Question box
        bool insertNewQuestion(string question, string courseId, string userId); //requires user key for authorentication
        MessageBox getAllQuestions(string courseId); 

        //Knowledge point
        bool insertNewKnowledgePoint(KnowledgePoint kp); //POST an KnowledgePoint Object
        bool updateKnowledgePoint(List<KnowledgePoint> kpList); //POST a List<KnowledgePoint>
        List<KnowledgePoint> GetAllKnowledgePoints(string courseId, string userId); //requires user key for authorentication
        bool insertSelfTestAnswer(string assetId, string answer, string userId);//Self test is one kind of assets
        */
        

    }


    // Use a data contract as illustrated in the sample below to add composite types to service operations.
    [DataContract]
    public class CompositeType
    {
        bool boolValue = true;
        string stringValue = "Hello ";

        [DataMember]
        public bool BoolValue
        {
            get { return boolValue; }
            set { boolValue = value; }
        }

        [DataMember]
        public string StringValue
        {
            get { return stringValue; }
            set { stringValue = value; }
        }
    }
}
