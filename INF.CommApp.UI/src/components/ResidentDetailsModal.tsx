import { useState } from 'react';
import { X, Edit, Trash2, Phone, Mail, MapPin, Calendar, User, Shield, Heart, Home, DollarSign, Activity } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { Resident } from './ResidentsPage';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

interface ResidentDetailsModalProps {
  resident: Resident;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (resident: Resident) => void;
  onDelete: (residentId: string) => void;
}

export function ResidentDetailsModal({
  resident,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
}: ResidentDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const initials = `${resident.firstName[0]}${resident.lastName[0]}`;

  const careLevelColors = {
    Independent: 'bg-[#f1f5f9] text-[#16a34a] border-2 border-[#16a34a]',
    Assisted: 'bg-[#f1f5f9] text-[#d97706] border-2 border-[#d97706]',
    'Full Care': 'bg-[#f1f5f9] text-[#dc2626] border-2 border-[#dc2626]',
  };

  const handleDelete = () => {
    onDelete(resident.id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <DialogTitle className="text-[#1e293b]">Resident Profile</DialogTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-[#dc2626] hover:text-[#dc2626]"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          {/* Profile Header */}
          <div className="flex items-start gap-6 pb-6 border-b">
            <Avatar className="h-32 w-32">
              <AvatarImage src={resident.photo} />
              <AvatarFallback className="bg-[#eff6ff] text-[#2563eb]">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h2 className="text-[#1e293b] mb-1">
                    {resident.firstName} {resident.lastName}
                  </h2>
                  {resident.preferredName && (
                    <p className="text-sm text-[#64748b]">
                      Preferred: "{resident.preferredName}"
                    </p>
                  )}
                </div>
                <Badge className={`${careLevelColors[resident.careLevel]} rounded-sm`}>
                  {resident.careLevel}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-[#64748b]" />
                  <span className="text-[#64748b]">Age:</span>
                  <span className="text-[#1e293b]">{resident.age} years</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Home className="h-4 w-4 text-[#64748b]" />
                  <span className="text-[#64748b]">Room:</span>
                  <span className="text-[#1e293b]">{resident.roomNumber}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-[#64748b]" />
                  <span className="text-[#64748b]">Facility:</span>
                  <span className="text-[#1e293b]">{resident.facility}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-[#64748b]" />
                  <span className="text-[#64748b]">MRN:</span>
                  <span className="text-[#1e293b]">{resident.medicalRecordNumber}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="healthcare">Healthcare</TabsTrigger>
              <TabsTrigger value="facility">Facility</TabsTrigger>
              <TabsTrigger value="care-team">Care Team</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="personal" className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm text-[#64748b] mb-3">Personal Details</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-[#94a3b8]">Full Name</label>
                      <p className="text-sm text-[#1e293b]">
                        {resident.firstName} {resident.lastName}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-[#94a3b8]">Date of Birth</label>
                      <p className="text-sm text-[#1e293b]">
                        {new Date(resident.dateOfBirth).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-[#94a3b8]">Gender</label>
                      <p className="text-sm text-[#1e293b]">{resident.gender}</p>
                    </div>
                    <div>
                      <label className="text-xs text-[#94a3b8]">Social Security Number</label>
                      <p className="text-sm text-[#1e293b]">***-**-{resident.ssn || '****'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm text-[#64748b] mb-3">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-[#64748b]" />
                      <div>
                        <label className="text-xs text-[#94a3b8]">Phone</label>
                        <p className="text-sm text-[#1e293b]">{resident.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-[#64748b]" />
                      <div>
                        <label className="text-xs text-[#94a3b8]">Email</label>
                        <p className="text-sm text-[#1e293b]">{resident.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Healthcare Information Tab */}
            <TabsContent value="healthcare" className="space-y-4">
              <div>
                <h3 className="text-sm text-[#64748b] mb-3">Medical Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-[#94a3b8]">Primary Care Physician</label>
                    <p className="text-sm text-[#1e293b]">{resident.primaryPhysician}</p>
                  </div>

                  <div>
                    <label className="text-xs text-[#94a3b8]">Medical Conditions</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {resident.medicalConditions.map((condition, index) => (
                        <Badge key={index} variant="outline">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <label className="text-xs text-[#94a3b8]">Current Medications</label>
                    <div className="space-y-2 mt-2">
                      {resident.medications.map((med, index) => (
                        <div key={index} className="p-3 bg-[#f9fafb] rounded-lg">
                          <p className="text-sm text-[#1e293b]">{med.name}</p>
                          <p className="text-xs text-[#64748b]">
                            {med.dosage} - {med.frequency}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <label className="text-xs text-[#94a3b8]">Allergies</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {resident.allergies.length > 0 ? (
                        resident.allergies.map((allergy, index) => (
                          <Badge key={index} className="bg-[#fef2f2] text-[#dc2626]">
                            {allergy}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-[#64748b]">No known allergies</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-[#94a3b8]">Dietary Restrictions</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {resident.dietaryRestrictions.length > 0 ? (
                        resident.dietaryRestrictions.map((diet, index) => (
                          <Badge key={index} className="bg-[#fffbeb] text-[#d97706]">
                            {diet}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-[#64748b]">No dietary restrictions</p>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-[#94a3b8]">Mobility Level</label>
                      <p className="text-sm text-[#1e293b]">{resident.mobilityLevel}</p>
                    </div>
                    <div>
                      <label className="text-xs text-[#94a3b8]">Cognitive Status</label>
                      <p className="text-sm text-[#1e293b]">{resident.cognitiveStatus}</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Facility & Housing Tab */}
            <TabsContent value="facility" className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm text-[#64748b] mb-3">Room Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-[#94a3b8]">Room Number</label>
                      <p className="text-sm text-[#1e293b]">{resident.roomNumber}</p>
                    </div>
                    <div>
                      <label className="text-xs text-[#94a3b8]">Room Type</label>
                      <p className="text-sm text-[#1e293b]">{resident.roomType}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm text-[#64748b] mb-3">Admission Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-[#94a3b8]">Admission Date</label>
                      <p className="text-sm text-[#1e293b]">
                        {new Date(resident.admissionDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-[#94a3b8]">Length of Stay</label>
                      <p className="text-sm text-[#1e293b]">
                        {Math.floor(
                          (new Date().getTime() - new Date(resident.admissionDate).getTime()) /
                            (1000 * 60 * 60 * 24)
                        )}{' '}
                        days
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Care Team & Family Tab */}
            <TabsContent value="care-team" className="space-y-4">
              <div>
                <h3 className="text-sm text-[#64748b] mb-3">Primary Care Team</h3>
                <div className="p-4 bg-[#f9fafb] rounded-lg">
                  <p className="text-sm text-[#1e293b]">{resident.primaryCareTeam}</p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm text-[#64748b] mb-3">Emergency Contacts</h3>
                <div className="space-y-3">
                  {resident.emergencyContacts.map((contact, index) => (
                    <div key={index} className="p-4 bg-[#f9fafb] rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-sm text-[#1e293b]">{contact.name}</p>
                          <p className="text-xs text-[#64748b]">{contact.relationship}</p>
                        </div>
                        {contact.isPrimary && (
                          <Badge className="bg-[#2563eb] text-white">Primary</Badge>
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs">
                          <Phone className="h-3 w-3 text-[#64748b]" />
                          <span className="text-[#64748b]">{contact.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <Mail className="h-3 w-3 text-[#64748b]" />
                          <span className="text-[#64748b]">{contact.email}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Financial & Insurance Tab */}
            <TabsContent value="financial" className="space-y-4">
              <div>
                <h3 className="text-sm text-[#64748b] mb-3">Insurance Information</h3>
                <div className="space-y-3">
                  <div className="p-4 bg-[#f9fafb] rounded-lg">
                    <label className="text-xs text-[#94a3b8]">Primary Insurance</label>
                    <p className="text-sm text-[#1e293b] mt-1">{resident.insurance.primary}</p>
                  </div>
                  {resident.insurance.secondary && (
                    <div className="p-4 bg-[#f9fafb] rounded-lg">
                      <label className="text-xs text-[#94a3b8]">Secondary Insurance</label>
                      <p className="text-sm text-[#1e293b] mt-1">{resident.insurance.secondary}</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Activity & Care Logs Tab */}
            <TabsContent value="activity" className="space-y-4">
              <div>
                <h3 className="text-sm text-[#64748b] mb-3">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="p-4 bg-[#f9fafb] rounded-lg flex items-start gap-3">
                    <Activity className="h-5 w-5 text-[#2563eb] mt-0.5" />
                    <div>
                      <p className="text-sm text-[#1e293b]">Medication administered</p>
                      <p className="text-xs text-[#64748b]">{resident.lastActivity}</p>
                    </div>
                  </div>
                  <div className="p-4 bg-[#f9fafb] rounded-lg flex items-start gap-3">
                    <Heart className="h-5 w-5 text-[#16a34a] mt-0.5" />
                    <div>
                      <p className="text-sm text-[#1e293b]">Vital signs recorded</p>
                      <p className="text-xs text-[#64748b]">4 hours ago</p>
                    </div>
                  </div>
                  <div className="p-4 bg-[#f9fafb] rounded-lg flex items-start gap-3">
                    <User className="h-5 w-5 text-[#d97706] mt-0.5" />
                    <div>
                      <p className="text-sm text-[#1e293b]">Family visit</p>
                      <p className="text-xs text-[#64748b]">Yesterday at 2:30 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {resident.firstName} {resident.lastName}'s record. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-[#dc2626] hover:bg-[#b91c1c]"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
