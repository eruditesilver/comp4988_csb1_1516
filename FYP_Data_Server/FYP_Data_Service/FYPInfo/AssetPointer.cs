using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace FYPDataService.FYPInfo
{
    [DataContract(Name = "Asset pointer")]
    public class AssetPointer
    {
        [DataMember(Name = "Asset ID")]
        public int id { get; set; }
        [DataMember(Name = "Asset path")]
        public string path { get; set; }

        public AssetType type { get; set; }
        [DataMember(Name = "Asset type")]
        public string assetTypeString
        {
            get { return Enum.GetName(typeof(AssetType), this.type); }
            set { this.type = (AssetType)Enum.Parse(typeof(AssetType), value); }
        }

        [DataMember(Name = "Point of start")]
        public int start { get; set; }
        [DataMember(Name = "Point of end")]
        public int end { get; set; }
      

        public AssetPointer(int id, string path, AssetType type, int start, int end)
        {
            this.id = id;
            this.path = path;
            this.type = type;
            this.start = start;
            this.end = end;
        }

        public void updatePointer(AssetPointer pointer)
        {
            if (this.id == pointer.id)
            {
                this.path = pointer.path;
                this.type = pointer.type;
                this.start = pointer.start;
                this.end = pointer.end;
            }
        }

        public void updatePath(string path)
        {
            this.path = path;
        }
    }
    [DataContract(Name = "Asset type")]
    public enum AssetType
    {
        [EnumMember(Value = "PDF")]
        PDF,
        [EnumMember(Value = "PPT")]
        PPT,
        [EnumMember(Value = "Audio")]
        Audio,
        [EnumMember(Value = "Video")]
        Video,
        [EnumMember(Value = "Q&A")]
        QandA,
        [EnumMember(Value = "Self test")]
        SelfTest
    }
}