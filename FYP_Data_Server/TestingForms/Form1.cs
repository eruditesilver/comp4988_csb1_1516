using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using TestingForms.AuthenticationDatabaseDataSetTableAdapters;
using FYPDataService;

namespace TestingForms
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            // TODO: This line of code loads data into the 'authenticationDatabaseDataSet.UserDataTable' table. You can move, or remove it, as needed.
            this.userDataTableTableAdapter.Fill(this.authenticationDatabaseDataSet.UserDataTable);

        }

        private void TestQueryButton_Click(object sender, EventArgs e)
        {
            FYPServiceReference.FYPGetDataServiceClient dataService = new FYPServiceReference.FYPGetDataServiceClient();
            dataService.InsertAccount("lixin", "abab", "Instructor");
        }
    }
}
