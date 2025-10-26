namespace INF.CommApp.DATA.Models
{
    /// <summary>
    /// Predefined notification types for the system
    /// </summary>
    public static class NotificationTypes
    {
        /// <summary>Email notifications</summary>
        public const string Email = "email";

        /// <summary>SMS/Text message notifications</summary>
        public const string Sms = "sms";

        /// <summary>Push notifications to mobile devices</summary>
        public const string Push = "push";

        /// <summary>In-app notifications within the application</summary>
        public const string InApp = "in-app";

        /// <summary>Emergency notifications (highest priority)</summary>
        public const string Emergency = "emergency";

        /// <summary>Medication reminders</summary>
        public const string MedicationReminder = "medication-reminder";

        /// <summary>Appointment reminders</summary>
        public const string AppointmentReminder = "appointment-reminder";

        /// <summary>Care plan updates</summary>
        public const string CarePlanUpdate = "care-plan-update";

        /// <summary>System maintenance notifications</summary>
        public const string SystemMaintenance = "system-maintenance";

        /// <summary>Get all available notification types</summary>
        public static string[] All => new[]
        {
            Email,
            Sms,
            Push,
            InApp,
            Emergency,
            MedicationReminder,
            AppointmentReminder,
            CarePlanUpdate,
            SystemMaintenance
        };
    }
}