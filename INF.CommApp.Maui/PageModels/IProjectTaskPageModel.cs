using CommunityToolkit.Mvvm.Input;
using INF.CommApp.Maui.Models;

namespace INF.CommApp.Maui.PageModels
{
    public interface IProjectTaskPageModel
    {
        IAsyncRelayCommand<ProjectTask> NavigateToTaskCommand { get; }
        bool IsBusy { get; }
    }
}