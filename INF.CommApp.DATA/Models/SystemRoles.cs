namespace INF.CommApp.DATA.Models
{
    /// <summary>
    /// Predefined roles for the healthcare communication system
    /// </summary>
    public static class SystemRoles
    {
        /// <summary>System administrator with full access</summary>
        public const string Administrator = "Administrator";

        /// <summary>Facility administrator</summary>
        public const string FacilityAdmin = "FacilityAdmin";

        /// <summary>Registered nurse</summary>
        public const string Nurse = "Nurse";

        /// <summary>Licensed practical nurse</summary>
        public const string LPN = "LPN";

        /// <summary>Certified nursing assistant</summary>
        public const string CNA = "CNA";

        /// <summary>Medical doctor</summary>
        public const string Doctor = "Doctor";

        /// <summary>Nurse practitioner</summary>
        public const string NursePractitioner = "NursePractitioner";

        /// <summary>Physician assistant</summary>
        public const string PhysicianAssistant = "PhysicianAssistant";

        /// <summary>Family member or caregiver</summary>
        public const string Caregiver = "Caregiver";

        /// <summary>Social worker</summary>
        public const string SocialWorker = "SocialWorker";

        /// <summary>Pharmacist</summary>
        public const string Pharmacist = "Pharmacist";

        /// <summary>Physical therapist</summary>
        public const string PhysicalTherapist = "PhysicalTherapist";

        /// <summary>Occupational therapist</summary>
        public const string OccupationalTherapist = "OccupationalTherapist";

        /// <summary>Read-only access (reporting, etc.)</summary>
        public const string ReadOnly = "ReadOnly";

        /// <summary>Get all available roles</summary>
        public static string[] All => new[]
        {
            Administrator,
            FacilityAdmin,
            Nurse,
            LPN,
            CNA,
            Doctor,
            NursePractitioner,
            PhysicianAssistant,
            Caregiver,
            SocialWorker,
            Pharmacist,
            PhysicalTherapist,
            OccupationalTherapist,
            ReadOnly
        };

        /// <summary>Roles that can access all residents in a facility</summary>
        public static string[] FacilityWideAccess => new[]
        {
            Administrator,
            FacilityAdmin,
            Nurse,
            Doctor,
            NursePractitioner,
            PhysicianAssistant
        };

        /// <summary>Roles that can only access assigned residents</summary>
        public static string[] AssignedResidentsOnly => new[]
        {
            LPN,
            CNA,
            Caregiver,
            SocialWorker,
            PhysicalTherapist,
            OccupationalTherapist
        };
    }
}