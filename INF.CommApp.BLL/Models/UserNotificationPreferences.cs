using INF.CommApp.DATA.Models;

namespace INF.CommApp.BLL.Models
{
    /// <summary>
    /// User's notification preferences for different channels
    /// </summary>
    public class UserNotificationPreferences
    {
        public int UserId { get; set; }
        public bool SmsEnabled { get; set; } = true;
        public bool PushEnabled { get; set; } = true;
        public bool IvrEnabled { get; set; } = false;
        public bool EmailEnabled { get; set; } = true;
        
        /// <summary>
        /// Time preferences for non-urgent notifications
        /// </summary>
        public TimeSpan? QuietHoursStart { get; set; }
        public TimeSpan? QuietHoursEnd { get; set; }
        
        /// <summary>
        /// Priority levels that can interrupt quiet hours
        /// </summary>
        public NotificationPriority MinimumUrgentPriority { get; set; } = NotificationPriority.High;
        
        /// <summary>
        /// Convert preferences to NotificationChannel flags
        /// </summary>
        public NotificationChannel GetEnabledChannels()
        {
            NotificationChannel channels = NotificationChannel.None;
            
            if (SmsEnabled)
            {
                channels |= NotificationChannel.SMS;
            }

            if (PushEnabled)
            {
                channels |= NotificationChannel.Push;
            }

            if (IvrEnabled)
            {
                channels |= NotificationChannel.IVR;
            }

            if (EmailEnabled)
            {
                channels |= NotificationChannel.Email;
            }

            return channels;
        }
        
        /// <summary>
        /// Check if notification should be sent based on time and priority
        /// </summary>
        public bool ShouldSendNow(NotificationPriority priority)
        {
            // Always send urgent notifications
            if (priority >= MinimumUrgentPriority)
            {
                return true;
            }

            // Check quiet hours for non-urgent notifications
            if (QuietHoursStart.HasValue && QuietHoursEnd.HasValue)
            {
                TimeSpan now = DateTime.Now.TimeOfDay;
                TimeSpan start = QuietHoursStart.Value;
                TimeSpan end = QuietHoursEnd.Value;
                
                // Handle overnight quiet hours (e.g., 10 PM to 6 AM)
                if (start > end)
                {
                    return !(now >= start || now <= end);
                }
                else
                {
                    return !(now >= start && now <= end);
                }
            }
            
            return true;
        }
    }
}