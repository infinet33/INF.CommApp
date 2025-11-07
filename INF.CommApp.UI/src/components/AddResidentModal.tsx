import { useState } from 'react';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Resident } from './ResidentsPage';
import { Textarea } from './ui/textarea';

interface AddResidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (resident: Resident) => void;
}

export function AddResidentModal({ isOpen, onClose, onAdd }: AddResidentModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    preferredName: '',
    roomNumber: '',
    dateOfBirth: '',
    gender: '',
    phone: '',
    email: '',
    careLevel: 'Independent' as 'Independent' | 'Assisted' | 'Full Care',
    facility: 'Valencia Assisted Living of Cottonwood',
    primaryPhysician: '',
    medicalRecordNumber: '',
    admissionDate: '',
    roomType: 'Private',
    primaryCareTeam: '',
    emergencyContactName: '',
    emergencyContactRelationship: '',
    emergencyContactPhone: '',
    emergencyContactEmail: '',
    primaryInsurance: '',
    secondaryInsurance: '',
    medicalConditions: '',
    allergies: '',
    dietaryRestrictions: '',
    mobilityLevel: '',
    cognitiveStatus: 'Alert and Oriented',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const age = formData.dateOfBirth
      ? Math.floor(
          (new Date().getTime() - new Date(formData.dateOfBirth).getTime()) /
            (1000 * 60 * 60 * 24 * 365.25)
        )
      : 0;

    const newResident: Resident = {
      id: `new-${Date.now()}`,
      firstName: formData.firstName,
      lastName: formData.lastName,
      preferredName: formData.preferredName || undefined,
      roomNumber: formData.roomNumber,
      age,
      dateOfBirth: formData.dateOfBirth,
      careLevel: formData.careLevel,
      medicalAlerts: {
        fallRisk: false,
        allergies: formData.allergies.length > 0,
        dietaryRestrictions: formData.dietaryRestrictions.length > 0,
        medicationAlerts: false,
      },
      facility: formData.facility,
      primaryCareTeam: formData.primaryCareTeam,
      lastActivity: 'Just added',
      gender: formData.gender,
      medicalRecordNumber: formData.medicalRecordNumber,
      phone: formData.phone,
      email: formData.email,
      primaryPhysician: formData.primaryPhysician,
      medicalConditions: formData.medicalConditions
        ? formData.medicalConditions.split(',').map((c) => c.trim())
        : [],
      medications: [],
      allergies: formData.allergies
        ? formData.allergies.split(',').map((a) => a.trim())
        : [],
      dietaryRestrictions: formData.dietaryRestrictions
        ? formData.dietaryRestrictions.split(',').map((d) => d.trim())
        : [],
      mobilityLevel: formData.mobilityLevel,
      cognitiveStatus: formData.cognitiveStatus,
      admissionDate: formData.admissionDate,
      roomType: formData.roomType,
      emergencyContacts: [
        {
          name: formData.emergencyContactName,
          relationship: formData.emergencyContactRelationship,
          phone: formData.emergencyContactPhone,
          email: formData.emergencyContactEmail,
          isPrimary: true,
        },
      ],
      insurance: {
        primary: formData.primaryInsurance,
        secondary: formData.secondaryInsurance || undefined,
      },
      status: 'Active',
    };

    onAdd(newResident);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      preferredName: '',
      roomNumber: '',
      dateOfBirth: '',
      gender: '',
      phone: '',
      email: '',
      careLevel: 'Independent',
      facility: 'Valencia Assisted Living of Cottonwood',
      primaryPhysician: '',
      medicalRecordNumber: '',
      admissionDate: '',
      roomType: 'Private',
      primaryCareTeam: '',
      emergencyContactName: '',
      emergencyContactRelationship: '',
      emergencyContactPhone: '',
      emergencyContactEmail: '',
      primaryInsurance: '',
      secondaryInsurance: '',
      medicalConditions: '',
      allergies: '',
      dietaryRestrictions: '',
      mobilityLevel: '',
      cognitiveStatus: 'Alert and Oriented',
    });
  };

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#1e293b]">Add New Resident</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="medical">Medical</TabsTrigger>
              <TabsTrigger value="facility">Facility</TabsTrigger>
              <TabsTrigger value="contacts">Contacts</TabsTrigger>
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="personal" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => updateField('firstName', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => updateField('lastName', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferredName">Preferred Name</Label>
                  <Input
                    id="preferredName"
                    value={formData.preferredName}
                    onChange={(e) => updateField('preferredName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => updateField('dateOfBirth', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select value={formData.gender} onValueChange={(value) => updateField('gender', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                      <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medicalRecordNumber">Medical Record Number *</Label>
                  <Input
                    id="medicalRecordNumber"
                    value={formData.medicalRecordNumber}
                    onChange={(e) => updateField('medicalRecordNumber', e.target.value)}
                    placeholder="MRN-XXXXXX"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="(555) 123-4567"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="resident@email.com"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Medical Information Tab */}
            <TabsContent value="medical" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryPhysician">Primary Care Physician *</Label>
                  <Input
                    id="primaryPhysician"
                    value={formData.primaryPhysician}
                    onChange={(e) => updateField('primaryPhysician', e.target.value)}
                    placeholder="Dr. John Smith"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="careLevel">Care Level *</Label>
                  <Select
                    value={formData.careLevel}
                    onValueChange={(value) => updateField('careLevel', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Independent">Independent</SelectItem>
                      <SelectItem value="Assisted">Assisted</SelectItem>
                      <SelectItem value="Full Care">Full Care</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="medicalConditions">Medical Conditions (comma-separated)</Label>
                  <Textarea
                    id="medicalConditions"
                    value={formData.medicalConditions}
                    onChange={(e) => updateField('medicalConditions', e.target.value)}
                    placeholder="Hypertension, Diabetes, etc."
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="allergies">Allergies (comma-separated)</Label>
                  <Textarea
                    id="allergies"
                    value={formData.allergies}
                    onChange={(e) => updateField('allergies', e.target.value)}
                    placeholder="Penicillin, Latex, etc."
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="dietaryRestrictions">Dietary Restrictions (comma-separated)</Label>
                  <Textarea
                    id="dietaryRestrictions"
                    value={formData.dietaryRestrictions}
                    onChange={(e) => updateField('dietaryRestrictions', e.target.value)}
                    placeholder="Low Sodium, Diabetic Diet, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobilityLevel">Mobility Level *</Label>
                  <Select
                    value={formData.mobilityLevel}
                    onValueChange={(value) => updateField('mobilityLevel', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select mobility level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Independent">Independent</SelectItem>
                      <SelectItem value="Cane">Cane</SelectItem>
                      <SelectItem value="Walker">Walker</SelectItem>
                      <SelectItem value="Wheelchair">Wheelchair</SelectItem>
                      <SelectItem value="Bedridden">Bedridden</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cognitiveStatus">Cognitive Status *</Label>
                  <Select
                    value={formData.cognitiveStatus}
                    onValueChange={(value) => updateField('cognitiveStatus', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Alert and Oriented">Alert and Oriented</SelectItem>
                      <SelectItem value="Mild Cognitive Impairment">
                        Mild Cognitive Impairment
                      </SelectItem>
                      <SelectItem value="Moderate Cognitive Impairment">
                        Moderate Cognitive Impairment
                      </SelectItem>
                      <SelectItem value="Severe Cognitive Impairment">
                        Severe Cognitive Impairment
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            {/* Facility Information Tab */}
            <TabsContent value="facility" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="roomNumber">Room Number *</Label>
                  <Input
                    id="roomNumber"
                    value={formData.roomNumber}
                    onChange={(e) => updateField('roomNumber', e.target.value)}
                    placeholder="101A"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="roomType">Room Type *</Label>
                  <Select
                    value={formData.roomType}
                    onValueChange={(value) => updateField('roomType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Private">Private</SelectItem>
                      <SelectItem value="Semi-Private">Semi-Private</SelectItem>
                      <SelectItem value="Shared">Shared</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admissionDate">Admission Date *</Label>
                  <Input
                    id="admissionDate"
                    type="date"
                    value={formData.admissionDate}
                    onChange={(e) => updateField('admissionDate', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="primaryCareTeam">Primary Care Team Member *</Label>
                  <Input
                    id="primaryCareTeam"
                    value={formData.primaryCareTeam}
                    onChange={(e) => updateField('primaryCareTeam', e.target.value)}
                    placeholder="Nurse Sarah Johnson"
                    required
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="facility">Facility</Label>
                  <Input
                    id="facility"
                    value={formData.facility}
                    onChange={(e) => updateField('facility', e.target.value)}
                    disabled
                  />
                </div>
              </div>
            </TabsContent>

            {/* Emergency Contacts & Insurance Tab */}
            <TabsContent value="contacts" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-sm text-[#64748b]">Emergency Contact</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactName">Name *</Label>
                    <Input
                      id="emergencyContactName"
                      value={formData.emergencyContactName}
                      onChange={(e) => updateField('emergencyContactName', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactRelationship">Relationship *</Label>
                    <Input
                      id="emergencyContactRelationship"
                      value={formData.emergencyContactRelationship}
                      onChange={(e) => updateField('emergencyContactRelationship', e.target.value)}
                      placeholder="Daughter, Son, etc."
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactPhone">Phone *</Label>
                    <Input
                      id="emergencyContactPhone"
                      type="tel"
                      value={formData.emergencyContactPhone}
                      onChange={(e) => updateField('emergencyContactPhone', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactEmail">Email</Label>
                    <Input
                      id="emergencyContactEmail"
                      type="email"
                      value={formData.emergencyContactEmail}
                      onChange={(e) => updateField('emergencyContactEmail', e.target.value)}
                    />
                  </div>
                </div>

                <h3 className="text-sm text-[#64748b] pt-4">Insurance Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryInsurance">Primary Insurance *</Label>
                    <Input
                      id="primaryInsurance"
                      value={formData.primaryInsurance}
                      onChange={(e) => updateField('primaryInsurance', e.target.value)}
                      placeholder="Medicare, Private, etc."
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondaryInsurance">Secondary Insurance</Label>
                    <Input
                      id="secondaryInsurance"
                      value={formData.secondaryInsurance}
                      onChange={(e) => updateField('secondaryInsurance', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                onClose();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-[#2563eb] hover:bg-[#1d4ed8] gap-2">
              <Plus className="h-4 w-4" />
              Add Resident
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
