using INF.CommApp.Maui.Models;
using INF.CommApp.Maui.PageModels;

namespace INF.CommApp.Maui.Pages
{
    public partial class MainPage : ContentPage
    {
        public MainPage(MainPageModel model)
        {
            InitializeComponent();
            BindingContext = model;
        }
    }
}