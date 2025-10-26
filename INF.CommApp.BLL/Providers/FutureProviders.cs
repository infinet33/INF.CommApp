using INF.CommApp.BLL.Interfaces;
using INF.CommApp.BLL.Models;
using Microsoft.Extensions.Logging;

namespace INF.CommApp.BLL.Providers
{
    /// <summary>
    /// Placeholder for future MAUI push notification provider
    /// </summary>
    public class MauiPushProvider : INotificationProvider
    {
        private readonly ILogger<MauiPushProvider> _logger;

        public NotificationChannel SupportedChannel => NotificationChannel.Push;
        public bool IsConfigured => false; // Not implemented yet

        public MauiPushProvider(ILogger<MauiPushProvider> logger)
        {
            _logger = logger;
        }

        public Task<NotificationResult> SendAsync(NotificationRequest request)
        {
            _logger.LogInformation("MAUI Push notifications not yet implemented");
            
            return Task.FromResult(new NotificationResult
            {
                IsSuccess = false,
                Channel = NotificationChannel.Push,
                Message = "Push notifications not yet implemented",
                ErrorCode = "NOT_IMPLEMENTED",
                SentAt = DateTime.UtcNow
            });
        }

        public Task<NotificationBatchResult> SendBatchAsync(List<NotificationRequest> requests)
        {
            NotificationBatchResult batchResult = new NotificationBatchResult();
            
            foreach (NotificationRequest request in requests)
            {
                batchResult.Results.Add(new NotificationResult
                {
                    IsSuccess = false,
                    Channel = NotificationChannel.Push,
                    Message = "Push notifications not yet implemented",
                    ErrorCode = "NOT_IMPLEMENTED",
                    SentAt = DateTime.UtcNow
                });
            }

            return Task.FromResult(batchResult);
        }
    }

    /// <summary>
    /// Placeholder for future IVR notification provider
    /// </summary>
    public class IvrProvider : INotificationProvider
    {
        private readonly ILogger<IvrProvider> _logger;

        public NotificationChannel SupportedChannel => NotificationChannel.IVR;
        public bool IsConfigured => false; // Not implemented yet

        public IvrProvider(ILogger<IvrProvider> logger)
        {
            _logger = logger;
        }

        public Task<NotificationResult> SendAsync(NotificationRequest request)
        {
            _logger.LogInformation("IVR notifications not yet implemented");
            
            return Task.FromResult(new NotificationResult
            {
                IsSuccess = false,
                Channel = NotificationChannel.IVR,
                Message = "IVR notifications not yet implemented",
                ErrorCode = "NOT_IMPLEMENTED",
                SentAt = DateTime.UtcNow
            });
        }

        public Task<NotificationBatchResult> SendBatchAsync(List<NotificationRequest> requests)
        {
            NotificationBatchResult batchResult = new NotificationBatchResult();
            
            foreach (NotificationRequest request in requests)
            {
                batchResult.Results.Add(new NotificationResult
                {
                    IsSuccess = false,
                    Channel = NotificationChannel.IVR,
                    Message = "IVR notifications not yet implemented",
                    ErrorCode = "NOT_IMPLEMENTED",
                    SentAt = DateTime.UtcNow
                });
            }

            return Task.FromResult(batchResult);
        }
    }
}