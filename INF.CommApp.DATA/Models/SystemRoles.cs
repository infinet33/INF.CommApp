namespace INF.CommApp.DATA.Models
{
    /// <summary>
    /// Predefined roles for the healthcare communication system
    /// </summary>
    public static class SystemRoles
    {
        /// <summary>System-wide administrator with full access across all facilities</summary>
        public const string Administrator = "Administrator";

        /// <summary>Facility administrator with full facility management permissions</summary>
        public const string FacilityAdmin = "FacilityAdmin";

        /// <summary>Facility operations manager with staff and scheduling permissions</summary>
        public const string FacilityManager = "FacilityManager";

        /// <summary>Facility billing and accounting administrator</summary>
        public const string BillingAdmin = "BillingAdmin";

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

        /// <summary>Assisted living resident</summary>
        public const string Resident = "Resident";

        /// <summary>Family member of resident</summary>
        public const string FamilyMember = "FamilyMember";

        /// <summary>Read-only access (reporting, etc.)</summary>
        public const string ReadOnly = "ReadOnly";

        /// <summary>Get all available roles</summary>
        public static string[] All => new[]
        {
            Administrator,
            FacilityAdmin,
            FacilityManager,
            BillingAdmin,
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
            Resident,
            FamilyMember,
            ReadOnly
        };

        /// <summary>Roles that can access all residents in a facility</summary>
        public static string[] FacilityWideAccess => new[]
        {
            Administrator,
            FacilityAdmin,
            FacilityManager,
            Nurse,
            Doctor,
            NursePractitioner,
            PhysicianAssistant
        };

        /// <summary>Administrative roles with elevated permissions</summary>
        public static string[] AdministrativeRoles => new[]
        {
            Administrator,
            FacilityAdmin,
            FacilityManager,
            BillingAdmin
        };

        /// <summary>System-wide roles that can manage multiple facilities</summary>
        public static string[] SystemWideRoles => new[]
        {
            Administrator
        };

        /// <summary>Facility-level administrative roles</summary>
        public static string[] FacilityLevelAdmin => new[]
        {
            FacilityAdmin,
            FacilityManager,
            BillingAdmin
        };

        /// <summary>Roles that can only access assigned residents</summary>
        public static string[] AssignedResidentsOnly => new[]
        {
            LPN,
            CNA,
            Caregiver,
            SocialWorker,
            PhysicalTherapist,
            OccupationalTherapist,
            FamilyMember
        };

        /// <summary>Roles that can only access their own information</summary>
        public static string[] SelfAccessOnly => new[]
        {
            Resident,
            ReadOnly
        };
    }
}