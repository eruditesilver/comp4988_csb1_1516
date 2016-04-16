using FYPDataService.AuthenticationDataSetTableAdapters;
using FYPDataService.FYPInfo;
using FYPDataService.FYPSystemDatasetTableAdapters;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Runtime.Serialization;
using System.Security.Cryptography;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using System.Web.Hosting;


namespace FYPDataService
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the class name "Service1" in code, svc and config file together.
    // NOTE: In order to launch WCF Test Client for testing this service, please select Service1.svc or Service1.svc.cs at the Solution Explorer and start debugging.
    public class FYPDataService : IFYPGetDataService
    {
        public string GetData(string value)
        {
            return string.Format("You entered: {0}", value);
        }

        public List<FYPMember> GetFYPInfo()
        {
            List<FYPMember> memberList = new List<FYPMember>();
            FYPMember tmy = new FYPMember("To Man Yin", "");
            FYPMember rv = new FYPMember("Vivek Rajanala", "");
            FYPMember wsf = new FYPMember("Wong Siu Fai", "");
            FYPMember ypy = new FYPMember("Yu Pui Yin", "");

            memberList.Add(tmy);
            memberList.Add(rv);
            memberList.Add(wsf);
            memberList.Add(ypy);
            return memberList;
        }

        public string InsertAccount(string name, string password, string accountType)
        {
            //    UserDataTableAdapter adapter = new UserDataTableAdapter();

            //    if (!adapter.UserExist(name).Equals(0))
            //        return string.Format("Username exist");
            //    var status = 0;
            //    if (accountType.ToLower().Equals("instructor"))
            //        status = adapter.InsertNewAccount(name, password, 1);
            //    else if (accountType.ToLower().Equals("student"))
            //        status = adapter.InsertNewAccount(name, password, 2);
            //    if (status == 0)
            //    {
            //        return string.Format("failed");
            //    }
            //    return string.Format("success");
            return string.Format("You entered: {0} , {1} , {2}", name, password, accountType);
        }

        public List<Person> GetAllAccount()
        {
            UserDataTableAdapter adapter = new UserDataTableAdapter();
            List<Person> accountList = new List<Person>();
            var accountTable = adapter.GetAllAccounts();
            string id = "";
            string name = "";
            int typeId = 0;
            string type = "";
            foreach (var row in accountTable)
            {
                id = Convert.ToString(row.Id);
                name = Convert.ToString(row.Username);
                typeId = Convert.ToInt16(row.Type);
                AccountTypeTableAdapter acadapter = new AccountTypeTableAdapter();
                type = Convert.ToString(acadapter.GetTypeNameById(typeId)[0].TypeName);
                accountList.Add(new Person(id, name, type));

            }
            return accountList;
        }

        public List<KnowledgePoint> GetKnowledgePoints(string courseId, string section)
        {
            KnowledgePoint p1 = new KnowledgePoint(1, courseId + " " + section, "binary system", 0, 0);
            AssetPointer ap1 = new AssetPointer(1001, "/L1/introduction.pdf", AssetType.PDF, 3, 8);
            p1.addAsset(ap1);
            AssetPointer ap2 = new AssetPointer(1002, "/L1/introduction.ppt", AssetType.PPT, 1, 2);
            p1.addAsset(ap2);
            AssetPointer ap3 = new AssetPointer(1003, "/Asset/COMP_2611/Lecture_1/sample.wav", AssetType.Audio, 0, 2);
            p1.addAsset(ap3);
            AssetPointer ap4 = new AssetPointer(1004, "/Asset/COMP_2611/Lecture_1/COMP2611.mp4", AssetType.Video, 0, 50);
            p1.addAsset(ap4);

            //create messages for KP

            Message q1 = new Message("ypy", "Is this the question 1?");
            Message q2 = new Message("rv", "Is this the question 2?");
            Message answeredQ1 = new Message("wsf", "Is this answered question 3?");
            answeredQ1.addAnswer(new Answer(AnswerType.Audio, "\\path\\" + answeredQ1.messageId + "\\Q3\\answer.acc"));
            Message answeredQ2 = new Message("tmy", "Is this answered question 4?");
            answeredQ2.addAnswer(new Answer(AnswerType.Text, "This is the answer of Q4"));
            p1.addMessage(q1);
            p1.addMessage(q2);
            p1.addMessage(answeredQ1);
            p1.addMessage(answeredQ2);

            SelfTestQuesion stq1 = new SelfTestQuesion("This is self test question Q1 with answer", "This is answer key");
            SelfTestQuesion stq2 = new SelfTestQuesion("This is self test question Q2 without answer (might be drawing answer)");
            p1.addTestQuestion(stq1);
            p1.addTestQuestion(stq2);
            p1.setPriority(Priority.High);

            KnowledgePoint p2 = new KnowledgePoint(2, courseId + "_" + section, "binary addition", 0, 200);
            p2.addParent(p1.id);
            AssetPointer ap7 = new AssetPointer(1007, "/L1/introduction.ppt", AssetType.PPT, 5, 6);
            p2.addAsset(ap7);
            p2.setPriority(Priority.Medium);

            KnowledgePoint p3 = new KnowledgePoint(3, courseId + "_" + section, "binary substraction", 400, 200);
            p3.addParent(p1.id);
            AssetPointer ap8 = new AssetPointer(1008, "/L1/introduction.ppt", AssetType.PPT, 7, 9);
            p3.addAsset(ap8);
            p3.setPriority(Priority.Medium);

            KnowledgePoint p4 = new KnowledgePoint(4, courseId + "_" + section, "binary operation", 0, 400);
            p4.addParent(p2.id);
            p4.addParent(p3.id);
            AssetPointer ap9 = new AssetPointer(1009, "/L1/introduction.ppt", AssetType.PPT, 10, 10);
            p4.addAsset(ap9);
            p4.setPriority(Priority.Low);

            List<KnowledgePoint> points = new List<KnowledgePoint>();
            points.Add(p1);
            points.Add(p2);
            points.Add(p3);
            points.Add(p4);

            return points;
        }

        public MessageBox GetMessageList(string courseId, string section)
        {
            MessageBox messageBox = new MessageBox(courseId, section);
            Message q1 = new Message("ypy", "Is this the question 1?");
            messageBox.addMessage(q1);
            Message q2 = new Message("rv", "Is this the question 2?");
            messageBox.addMessage(q2);
            Message answeredQ1 = new Message("wsf", "Is this answered question 3?");
            answeredQ1.addAnswer(new Answer(AnswerType.Audio, "\\path\\" + answeredQ1.messageId + "\\Q3\\answer.acc"));
            Message answeredQ2 = new Message("tmy", "Is this answered question 4?");
            answeredQ2.addAnswer(new Answer(AnswerType.Text, "This is the answer of Q4"));
            messageBox.addMessage(answeredQ1);
            messageBox.addMessage(answeredQ2);
            return messageBox;
        }

        public MessageBox GetMessageBox(string courseCode, string courseNumber)
        {
            MessageBox messageBox = new MessageBox(courseCode + courseNumber, "");
            QandATableAdapter qaAdapter = new QandATableAdapter();
            CourseTableAdapter courseAdapter = new CourseTableAdapter();
            var courseIdList = courseAdapter.GetIdByCourseDetails(courseCode, Convert.ToInt32(courseNumber));
            int courseId = courseIdList[0].Id;
            var qaTable = qaAdapter.GetMessageListByCourseId(courseId);
            AnswerTypeTableAdapter answerTypeAdapter = new AnswerTypeTableAdapter();
            UserDataTableAdapter userAdapter = new UserDataTableAdapter();
            foreach (var row in qaTable)
            {
                int userId = row.AskedBy;
                string username = userAdapter.GetUserDataById(userId)[0].Username;
                Message message = new Message(username, row.Question);
                message.createTime = row.CreatedTime.ToString("G");
                message.messageId = row.Id;
                try
                {
                    Answer answer = new Answer(row.AnswerType, row.Answer);
                    message.addAnswer(answer);
                }
                catch (StrongTypingException e)
                {

                }
                messageBox.addMessage(message);
            }
            return messageBox;
        }

        public List<KnowledgePoint> GetKnowledgePointList(string courseCode, string CourseNumber)
        {
            List<KnowledgePoint> list = new List<KnowledgePoint>();
            KnowledgePointTableAdapter kpAdapter = new KnowledgePointTableAdapter();
            KnowledgePointParentChildRelationTableAdapter kpRelationAdatper = new KnowledgePointParentChildRelationTableAdapter();
            KnowledgePointAssetRelationTableAdapter kpAssetAdapter = new KnowledgePointAssetRelationTableAdapter();
            CourseTableAdapter courseAdapter = new CourseTableAdapter();
            var courseIdList = courseAdapter.GetIdByCourseDetails(courseCode, Convert.ToInt32(CourseNumber));
            int courseId = courseIdList[0].Id;
            PriorityTableAdapter priorityAdapter = new PriorityTableAdapter();
            AssetTableAdapter assetAdapter = new AssetTableAdapter();
            AssetTypeTableAdapter assetTypeAdapter = new AssetTypeTableAdapter();

            foreach (var row in kpAdapter.GetKnowledgePointByCourseId(courseId))
            {
                KnowledgePoint kp = new KnowledgePoint(row.Id, courseCode + CourseNumber, row.Name, row.xPos, row.yPos);
                kp.priority = (Priority)Enum.Parse(typeof(Priority), priorityAdapter.GetPriorityById(row.Priority)[0].Priority);
                kp.createDate = row.CreatedTime.ToString("G");
                kp.modifiedDate = row.LastModifiedTime.ToString("G");
                foreach (var relation in kpRelationAdatper.GetParentIdByChildId(row.Id))
                {
                    kp.addParent(relation.ParentKnowledgePointId);
                }

                foreach (var relatedAsset in kpAssetAdapter.GetAssetListByKnowledgePointId(row.Id))
                {
                    foreach (var assetPointer in assetAdapter.GetAssetDetailById(relatedAsset.AssetId))
                    {
                        AssetType type = (AssetType)Enum.Parse(typeof(AssetType), assetTypeAdapter.GetDataById(assetPointer.AssetType)[0].AssetType);
                        if (type == AssetType.PDF | type == AssetType.PPT | type == AssetType.Audio | type == AssetType.Video)
                        {
                            AssetPointer pointer = new AssetPointer(assetPointer.Id, assetPointer.Path + assetPointer.AssetName, type, relatedAsset.Start, relatedAsset.End);
                            kp.addAsset(pointer);
                        }
                        else if (type == AssetType.SelfTest)
                        {
                            int selftestId = Convert.ToInt32(assetPointer.AssetName);
                            SelfTestTableAdapter stAdapter = new SelfTestTableAdapter();
                            var st = stAdapter.GetSelfTestDataById(Convert.ToInt32(assetPointer.AssetName))[0];
                            SelfTestQuesion stQuestion = new SelfTestQuesion(st.Question, st.AnswerKey);
                            kp.addTestQuestion(stQuestion);
                        }
                        else if (type == AssetType.QandA)
                        {
                            int messageId = Convert.ToInt32(assetPointer.AssetName);
                            QandATableAdapter qaAdapter = new QandATableAdapter();
                            var qa = qaAdapter.GetQAsById(messageId)[0];
                            Message message = new Message(qa.Id, "user Id: " + qa.AskedBy, qa.Question);
                            try
                            {
                                string answerTypeString = (new AnswerTypeTableAdapter()).GetDataById(qa.AnswerType)[0].AnswerType;
                                Answer answer = new Answer(answerTypeString, qa.Answer);
                            
                            }
                            catch
                            {

                            }
                            finally {
                                message.addAnswer(new Answer(AnswerType.NoAnswer, ""));
                            }
                            
                            message.createTime = qa.CreatedTime.ToString("G");
                            kp.messageBox.lastModifiedDate = qa.CreatedTime.ToString("G");
                            kp.addMessage(message);
                        }
                    }
                }
                kp.createDate = row.CreatedTime.ToString("G");
                kp.modifiedDate = row.LastModifiedTime.ToString("G");
                list.Add(kp);
            }
            return list;
        }

        public string insertNewMessage(string courseCode, string courseNumber, string userId, string message)
        {
            QandATableAdapter qaAdapter = new QandATableAdapter();
            CourseTableAdapter courseAdapter = new CourseTableAdapter();
            AssetTableAdapter assetAdapter = new AssetTableAdapter();
            var table = courseAdapter.GetIdByCourseDetails(courseCode, Convert.ToInt32(courseNumber));
            if (table.Count > 0)
            {
                
                qaAdapter.InsertNewQuestion(message, Convert.ToInt32(userId), null, null, DateTime.Now, null, Convert.ToInt32(table[0].Id));
                var qaTable = qaAdapter.GetMessageListByCourseId(Convert.ToInt32(table[0].Id));
                int qaID = qaTable[qaTable.Count-1].Id;
                assetAdapter.InsertAsset(qaID.ToString(), qaID.ToString(), 3104);
                return "success";
            }
            return "failed";
        }

        public string insertAnswerToMessage(string courseCode, string courseNumber, string messageId, string answer, string answerTypeId)
        {
            QandATableAdapter qaAdapter = new QandATableAdapter();
            CourseTableAdapter courseAdapter = new CourseTableAdapter();
            var table = courseAdapter.GetIdByCourseDetails(courseCode, Convert.ToInt32(courseNumber));
            if (table.Count > 0)
            {
                if (qaAdapter.GetQAsById(Convert.ToInt32(messageId)).Count > 0)
                {
                    qaAdapter.AddAnswerToQuestion(answer, Convert.ToInt32(answerTypeId), DateTime.Now, Convert.ToInt32(messageId));
                    return "success";
                }
            }
            return "failed";
        }

        public List<SelfTestResult> getSelfTestResult(string questionId)
        {
            UserResultInSelfTestTableAdapter userSTAdapter = new UserResultInSelfTestTableAdapter();
            List<SelfTestResult> list = new List<SelfTestResult>();
            int qId = Convert.ToInt32(questionId);

            UserDataTableAdapter adapter = new UserDataTableAdapter();
            foreach (var row in userSTAdapter.GetSelfTestResultByQuestionId(qId))
            {
                SelfTestResult str = new SelfTestResult();
                str.questionId = row.SelfTestId;
                str.userId = row.UserId;
                str.username = adapter.GetUserDataById(str.userId)[0].Username;
                try
                {
                    str.score = row.Score;

                }
                catch (StrongTypingException e)
                {
                    str.score = -1;
                }
                try
                {
                    str.answer = row.Answer;

                }
                catch (StrongTypingException e)
                {
                    str.answer = null;
                }

                list.Add(str);
            }
            return list;
        }

        public List<SelfTestResult> getUserSelfTestResult(string userId)
        {
            UserResultInSelfTestTableAdapter userSTAdapter = new UserResultInSelfTestTableAdapter();
            List<SelfTestResult> list = new List<SelfTestResult>();
            int uId = Convert.ToInt32(userId);
            UserDataTableAdapter adapter = new UserDataTableAdapter();
            foreach (var row in userSTAdapter.GetSelfTestResultByUserId(uId))
            {
                SelfTestResult str = new SelfTestResult();
                str.questionId = row.SelfTestId;
                str.userId = row.UserId;
                str.username = adapter.GetUserDataById(str.userId)[0].Username;
                try
                {
                    str.score = row.Score;

                }
                catch (StrongTypingException e)
                {
                    str.score = -1;
                }
                try
                {
                    str.answer = row.Answer;

                }
                catch (StrongTypingException e)
                {
                    str.answer = null;
                }
                list.Add(str);
            }
            return list;
        }

        public string updateKnowledgePoints(List<KnowledgePoint> updatedKnowledgePointList)
        {
            int i = 0;
            KnowledgePointTableAdapter kpAdapter = new KnowledgePointTableAdapter();
            //kpAdapter.DeleteKPByCourseId(Convert.ToInt16(updatedKnowledgePointList[0].courseId));
            for (; i < updatedKnowledgePointList.Count; i++)
            {
                string result = updateKnowledgePoint(updatedKnowledgePointList[i]);
                if (!result.Equals("Success"))
                {
                    return result + " from Knowledge point " + i;
                }
            }
            return "Success";
        }

        public string updateKnowledgePoint(KnowledgePoint updatedKnowledgePoint)
        {
            KnowledgePointTableAdapter kpAdapter = new KnowledgePointTableAdapter();
            //check knowledge point exist
            if (kpAdapter.GetKnowledgePointById(updatedKnowledgePoint.id).Count > 0)
            {
                int success = kpAdapter.UpdateKnowledgePoint(updatedKnowledgePoint.name, (int)(updatedKnowledgePoint.priority), updatedKnowledgePoint.posX, updatedKnowledgePoint.posY, Convert.ToDateTime(updatedKnowledgePoint.createDate), Convert.ToDateTime(updatedKnowledgePoint.modifiedDate), Convert.ToInt32(updatedKnowledgePoint.courseId), updatedKnowledgePoint.id);
                if (success == 0)
                {
                    return "Failed in update the details";
                }
            }
            else
            {
                //int success = kpAdapter.InsertNewKnowledgePoint(updatedKnowledgePoint.name, (int)updatedKnowledgePoint.priority, updatedKnowledgePoint.posX, updatedKnowledgePoint.posY, Convert.ToDateTime("1/1/1753 12:00:00"), Convert.ToDateTime("1/1/1753 12:00:00"), Convert.ToInt32(updatedKnowledgePoint.courseId));                
                int success = kpAdapter.InsertNewKnowledgePoint(updatedKnowledgePoint.name, (int)updatedKnowledgePoint.priority, updatedKnowledgePoint.posX, updatedKnowledgePoint.posY, Convert.ToDateTime(updatedKnowledgePoint.createDate), Convert.ToDateTime(updatedKnowledgePoint.modifiedDate), Convert.ToInt32(updatedKnowledgePoint.courseId));
                if (success == 0)
                {
                    return "Failed in add the details";
                }
            }
            KnowledgePointParentChildRelationTableAdapter relationAdapter = new KnowledgePointParentChildRelationTableAdapter();
            var updateTable = updatedKnowledgePoint.parentsKnowledgePointsId;

            relationAdapter.DeleteAllByChildId(updatedKnowledgePoint.id);

            for (int j = 0; j < updateTable.Count; j++)
            {
                relationAdapter.InsertNewRelation(updatedKnowledgePoint.id, updateTable[j]);
            }
            KnowledgePointAssetRelationTableAdapter assetAdapter = new KnowledgePointAssetRelationTableAdapter();

            assetAdapter.DeleteRelationByKnowledgePointId(updatedKnowledgePoint.id);
            for (int j = 0; j < updatedKnowledgePoint.assets.Count; j++)
            {
                assetAdapter.InsertNewAssetRelation(updatedKnowledgePoint.id, updatedKnowledgePoint.assets[j].id, updatedKnowledgePoint.assets[j].start, updatedKnowledgePoint.assets[j].end);
            }
            AssetTableAdapter ata = new AssetTableAdapter();
            for (int j = 0; j < updatedKnowledgePoint.messageBox.messageList.Count; j++)
            {
                assetAdapter.InsertNewAssetRelation(updatedKnowledgePoint.id, ata.GetIdByAssetName(updatedKnowledgePoint.messageBox.messageList[j].messageId.ToString())[0].Id, -1, -1);
            }
            return "Success";
        }

        public string deleteKnowledgePoint(string kpId) {
            KnowledgePointTableAdapter kpta = new KnowledgePointTableAdapter();
            KnowledgePointAssetRelationTableAdapter assetAdapter = new KnowledgePointAssetRelationTableAdapter();
            try
            {
                kpta.DeleteKPById(Convert.ToInt16(kpId));
                assetAdapter.DeleteRelationByKnowledgePointId(Convert.ToInt16(kpId));
                return "success";
            }
            catch {
                return "error";
            }
            
        }

        public string insertNewSelfTestRecord(string userId, string selfTestId, string answer)
        {
            UserResultInSelfTestTableAdapter stResultAdapter = new UserResultInSelfTestTableAdapter();
            int success = stResultAdapter.InsertNewAnswerToSelfTest(Convert.ToInt32(userId), Convert.ToInt32(selfTestId), answer);
            if (success == 1)
            {
                return "Success";
            }
            return "Failed to insert a new self test record.";
        }

        public string markASelfTestRecord(string userId, string score, string selfTestId)
        {
            UserResultInSelfTestTableAdapter resultAdapter = new UserResultInSelfTestTableAdapter();
            int success = resultAdapter.UpdateScore(Convert.ToInt32(score), Convert.ToInt32(userId), Convert.ToInt32(selfTestId));
            if (success == 1)
            {
                return "Success";
            }
            return "Failed to mark the student with ID:" + userId + " in question " + selfTestId;
        }

        public string uploadFile(string courseCode, string courseNumber, string folderName, string filename, Stream stream)
        {
            string FilePath = Path.Combine(HostingEnvironment.MapPath("~/Asset/" + courseCode + "_" + courseNumber + "/" + folderName), filename);
            if (stream.Length > 65535)
            {
                return "Failed, the file is too large.";
            }
            int length = 0;
            try
            {
                using (FileStream writer = new FileStream(FilePath, FileMode.Create))
                {
                    int readCount;
                    var buffer = new byte[65545];
                    while ((readCount = stream.Read(buffer, 0, buffer.Length)) != 0)
                    {
                        writer.Write(buffer, 0, readCount);
                        length += readCount;
                    }
                }
            }
            catch (Exception e)
            {
                return "Failed, caused by exception: " + e.ToString();
            }
            return "Success";
        }

        public Person loginToSystem(string username, string password)
        {
            UserDataTableAdapter udAdapter = new UserDataTableAdapter();
            try
            {
                var details = udAdapter.GetUserDataWithLogin(username, password)[0];
                string name = details.Username;
                int id = details.Id;
                AccountTypeTableAdapter acTypeAdapter = new AccountTypeTableAdapter();
                string type = acTypeAdapter.GetTypeNameById(details.Type)[0].TypeName;
                return new Person(Convert.ToString(id), name, type);
            }
            catch {
                return null;
            }

        }

        public string login(string username, string password)
        {
            if (username.Equals("vivek") && password.Equals("password01"))
            {
                MD5 md5 = new MD5CryptoServiceProvider();
                //compute hash from the bytes of text
                md5.ComputeHash(ASCIIEncoding.ASCII.GetBytes(username + password));

                //get hash result after compute it
                byte[] result = md5.Hash;

                StringBuilder strBuilder = new StringBuilder();
                for (int i = 0; i < result.Length; i++)
                {
                    //change it into 2 hexadecimal digits
                    //for each byte
                    strBuilder.Append(result[i].ToString("x2"));
                }

                return "Login success, your secret code is " + strBuilder.ToString();
            }
            return "Login failed, please try again";
        }
    }
}
