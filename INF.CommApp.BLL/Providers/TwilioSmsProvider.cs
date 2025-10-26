using INF.CommApp.BLL.Interfaces;
using INF.CommApp.BLL.Models;
using INF.CommApp.DATA.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;

namespace INF.CommApp.BLL.Providers
{
    /// <summary>
    /// Twilio SMS notification provider
    /// </summary>
    public class TwilioSmsProvider : INotificationProvider
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<TwilioSmsProvider> _logger;
        private readonly string _accountSid;
        private readonly string _authToken;
        private readonly string _fromNumber;

        public NotificationChannel SupportedChannel => NotificationChannel.SMS;

        public bool IsConfigured { get; private set; }

        public TwilioSmsProvider(IConfiguration configuration, ILogger<TwilioSmsProvider> logger)
        {
            _configuration = configuration;
            _logger = logger;

            // Get Twilio configuration from appsettings or Azure Key Vault
            _accountSid = _configuration["Twilio:AccountSid"];
            _authToken = _configuration["Twilio:AuthToken"];
            _fromNumber = _configuration["Twilio:FromNumber"];

            IsConfigured = !string.IsNullOrEmpty(_accountSid) && 
                          !string.IsNullOrEmpty(_authToken) && 
                          !string.IsNullOrEmpty(_fromNumber);

            if (IsConfigured)
            {
                TwilioClient.Init(_accountSid, _authToken);
                _logger.LogInformation("Twilio SMS provider initialized successfully");
            }
            else
            {
                _logger.LogWarning("Twilio SMS provider not configured. Missing AccountSid, AuthToken, or FromNumber");
            }
        }

        public async Task<NotificationResult> SendAsync(NotificationRequest request)
        {
            if (!IsConfigured)
            {
                return new NotificationResult
                {
                    IsSuccess = false,
                    Channel = NotificationChannel.SMS,
                    Message = "Twilio SMS provider not configured",
                    ErrorCode = "PROVIDER_NOT_CONFIGURED",
                    SentAt = DateTime.UtcNow
                };
            }

            try
            {
                // For SMS, we expect phone numbers in the Recipients list
                List<NotificationResult> results = [];

                foreach (string phoneNumber in request.Recipients)
                {
                    if (string.IsNullOrWhiteSpace(phoneNumber))
                    {
                        results.Add(new NotificationResult
                        {
                            IsSuccess = false,
                            Channel = NotificationChannel.SMS,
                            Message = "Empty phone number",
                            ErrorCode = "INVALID_RECIPIENT",
                            SentAt = DateTime.UtcNow
                        });
                        continue;
                    }

                    try
                    {
                        MessageResource message = await MessageResource.CreateAsync(
                            body: FormatMessage(request.Message, request.Priority),
                            from: new PhoneNumber(_fromNumber),
                            to: new PhoneNumber(phoneNumber)
                        );

                        results.Add(new NotificationResult
                        {
                            IsSuccess = message.Status != MessageResource.StatusEnum.Failed,
                            Channel = NotificationChannel.SMS,
                            Message = $"SMS sent to {phoneNumber}",
                            ExternalId = message.Sid,
                            SentAt = DateTime.UtcNow
                        });

                        _logger.LogInformation($"SMS sent successfully to {phoneNumber}, SID: {message.Sid}");
                    }
                    catch (Exception ex)
                    {
                        results.Add(new NotificationResult
                        {
                            IsSuccess = false,
                            Channel = NotificationChannel.SMS,
                            Message = $"Failed to send SMS to {phoneNumber}: {ex.Message}",
                            ErrorCode = ex.GetType().Name,
                            SentAt = DateTime.UtcNow
                        });

                        _logger.LogError(ex, $"Failed to send SMS to {phoneNumber}");
                    }
                }

                // Return the first result (for single recipient) or a summary for multiple
                return results.FirstOrDefault() ?? new NotificationResult
                {
                    IsSuccess = false,
                    Channel = NotificationChannel.SMS,
                    Message = "No recipients provided",
                    ErrorCode = "NO_RECIPIENTS",
                    SentAt = DateTime.UtcNow
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending SMS notification");
                return new NotificationResult
                {
                    IsSuccess = false,
                    Channel = NotificationChannel.SMS,
                    Message = $"SMS sending failed: {ex.Message}",
                    ErrorCode = ex.GetType().Name,
                    SentAt = DateTime.UtcNow
                };
            }
        }

        public async Task<NotificationBatchResult> SendBatchAsync(List<NotificationRequest> requests)
        {
            NotificationBatchResult batchResult = new NotificationBatchResult();

            foreach (NotificationRequest request in requests)
            {
                NotificationResult result = await SendAsync(request);
                batchResult.Results.Add(result);
            }

            _logger.LogInformation($"Batch SMS sending completed. Sent: {batchResult.TotalSent}, Failed: {batchResult.TotalFailed}");
            
            return batchResult;
        }

        /// <summary>
        /// Format message based on priority
        /// </summary>
        private string FormatMessage(string message, NotificationPriority priority)
        {
            string prefix = priority switch
            {
                NotificationPriority.High => "[HIGH PRIORITY] ",
                NotificationPriority.Incident => "[INCIDENT] ",
                NotificationPriority.Medium => "[MEDIUM] ",
                NotificationPriority.Low => "[LOW] ",
                _ => ""
            };

            return $"{prefix}{message}";
        }
    }
}