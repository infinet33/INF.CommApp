import { useState } from 'react';
import { Plus, Download, FileSpreadsheet } from 'lucide-react';
import { Button } from './ui/button';
import { ResidentCard } from './ResidentCard';
import { ResidentDetailsModal } from './ResidentDetailsModal';
import { AddResidentModal } from './AddResidentModal';
import { SearchFilters } from './SearchFilters';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination';
import { Checkbox } from './ui/checkbox';

export interface Resident {
  id: string;
  firstName: string;
  lastName: string;
  preferredName?: string;
  photo?: string;
  roomNumber: string;
  age: number;
  dateOfBirth: string;
  careLevel: 'Independent' | 'Assisted' | 'Full Care';
  medicalAlerts: {
    fallRisk?: boolean;
    allergies?: boolean;
    dietaryRestrictions?: boolean;
    medicationAlerts?: boolean;
  };
  facility: string;
  primaryCareTeam: string;
  lastActivity: string;
  gender: string;
  ssn?: string;
  medicalRecordNumber: string;
  phone: string;
  email: string;
  primaryPhysician: string;
  medicalConditions: string[];
  medications: Array<{ name: string; dosage: string; frequency: string }>;
  allergies: string[];
  dietaryRestrictions: string[];
  mobilityLevel: string;
  cognitiveStatus: string;
  admissionDate: string;
  roomType: string;
  emergencyContacts: Array<{
    name: string;
    relationship: string;
    phone: string;
    email: string;
    isPrimary: boolean;
  }>;
  insurance: {
    primary: string;
    secondary?: string;
  };
  status: 'Active' | 'Inactive';
}

const mockResidents: Resident[] = [
  {
    id: '1',
    firstName: 'Margaret',
    lastName: 'Anderson',
    preferredName: 'Maggie',
    roomNumber: '101A',
    age: 78,
    dateOfBirth: '1947-03-15',
    careLevel: 'Assisted',
    medicalAlerts: {
      fallRisk: true,
      allergies: true,
    },
    facility: 'Valencia Assisted Living of Cottonwood',
    primaryCareTeam: 'Nurse Sarah Johnson',
    lastActivity: '2 hours ago',
    gender: 'Female',
    medicalRecordNumber: 'MRN-001234',
    phone: '(555) 123-4567',
    email: 'maggie.anderson@email.com',
    primaryPhysician: 'Dr. Robert Chen',
    medicalConditions: ['Hypertension', 'Osteoarthritis', 'Type 2 Diabetes'],
    medications: [
      { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily' },
      { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily' },
    ],
    allergies: ['Penicillin', 'Latex'],
    dietaryRestrictions: ['Low Sodium', 'Diabetic Diet'],
    mobilityLevel: 'Walker',
    cognitiveStatus: 'Alert and Oriented',
    admissionDate: '2023-06-15',
    roomType: 'Private',
    emergencyContacts: [
      {
        name: 'Jennifer Anderson',
        relationship: 'Daughter',
        phone: '(555) 234-5678',
        email: 'jennifer.a@email.com',
        isPrimary: true,
      },
    ],
    insurance: {
      primary: 'Medicare',
      secondary: 'Blue Cross',
    },
    status: 'Active',
  },
  {
    id: '2',
    firstName: 'Robert',
    lastName: 'Williams',
    preferredName: 'Bob',
    roomNumber: '102B',
    age: 82,
    dateOfBirth: '1943-07-22',
    careLevel: 'Full Care',
    medicalAlerts: {
      fallRisk: true,
      dietaryRestrictions: true,
      medicationAlerts: true,
    },
    facility: 'Valencia Assisted Living of Cottonwood',
    primaryCareTeam: 'Nurse Michael Torres',
    lastActivity: '1 hour ago',
    gender: 'Male',
    medicalRecordNumber: 'MRN-001235',
    phone: '(555) 234-5678',
    email: 'bob.williams@email.com',
    primaryPhysician: 'Dr. Emily Martinez',
    medicalConditions: ['CHF', 'COPD', 'Dementia'],
    medications: [
      { name: 'Furosemide', dosage: '40mg', frequency: 'Twice daily' },
      { name: 'Donepezil', dosage: '10mg', frequency: 'Once daily at bedtime' },
    ],
    allergies: ['Sulfa drugs'],
    dietaryRestrictions: ['Low Sodium', 'Pureed Diet'],
    mobilityLevel: 'Wheelchair',
    cognitiveStatus: 'Moderate Cognitive Impairment',
    admissionDate: '2022-11-03',
    roomType: 'Semi-Private',
    emergencyContacts: [
      {
        name: 'Susan Williams',
        relationship: 'Wife',
        phone: '(555) 345-6789',
        email: 'susan.w@email.com',
        isPrimary: true,
      },
    ],
    insurance: {
      primary: 'Medicare',
      secondary: 'Medicaid',
    },
    status: 'Active',
  },
  {
    id: '3',
    firstName: 'Dorothy',
    lastName: 'Chen',
    roomNumber: '103A',
    age: 75,
    dateOfBirth: '1950-11-08',
    careLevel: 'Independent',
    medicalAlerts: {
      allergies: true,
    },
    facility: 'Valencia Assisted Living of Cottonwood',
    primaryCareTeam: 'Nurse Sarah Johnson',
    lastActivity: '30 minutes ago',
    gender: 'Female',
    medicalRecordNumber: 'MRN-001236',
    phone: '(555) 456-7890',
    email: 'dorothy.chen@email.com',
    primaryPhysician: 'Dr. Robert Chen',
    medicalConditions: ['Hypothyroidism'],
    medications: [
      { name: 'Levothyroxine', dosage: '75mcg', frequency: 'Once daily' },
    ],
    allergies: ['Shellfish', 'Iodine'],
    dietaryRestrictions: [],
    mobilityLevel: 'Independent',
    cognitiveStatus: 'Alert and Oriented',
    admissionDate: '2024-01-20',
    roomType: 'Private',
    emergencyContacts: [
      {
        name: 'Michael Chen',
        relationship: 'Son',
        phone: '(555) 567-8901',
        email: 'michael.chen@email.com',
        isPrimary: true,
      },
    ],
    insurance: {
      primary: 'Private Insurance',
    },
    status: 'Active',
  },
  {
    id: '4',
    firstName: 'James',
    lastName: 'Thompson',
    preferredName: 'Jim',
    roomNumber: '104A',
    age: 80,
    dateOfBirth: '1945-05-12',
    careLevel: 'Assisted',
    medicalAlerts: {
      fallRisk: true,
      medicationAlerts: true,
    },
    facility: 'Valencia Assisted Living of Cottonwood',
    primaryCareTeam: 'Nurse Michael Torres',
    lastActivity: '3 hours ago',
    gender: 'Male',
    medicalRecordNumber: 'MRN-001237',
    phone: '(555) 678-9012',
    email: 'jim.thompson@email.com',
    primaryPhysician: 'Dr. Emily Martinez',
    medicalConditions: ['Atrial Fibrillation', 'Hypertension'],
    medications: [
      { name: 'Warfarin', dosage: '5mg', frequency: 'Once daily' },
      { name: 'Metoprolol', dosage: '50mg', frequency: 'Twice daily' },
    ],
    allergies: [],
    dietaryRestrictions: ['Vitamin K Restricted'],
    mobilityLevel: 'Cane',
    cognitiveStatus: 'Alert and Oriented',
    admissionDate: '2023-09-10',
    roomType: 'Private',
    emergencyContacts: [
      {
        name: 'Patricia Thompson',
        relationship: 'Daughter',
        phone: '(555) 789-0123',
        email: 'patricia.t@email.com',
        isPrimary: true,
      },
    ],
    insurance: {
      primary: 'Medicare',
    },
    status: 'Active',
  },
  {
    id: '5',
    firstName: 'Eleanor',
    lastName: 'Martinez',
    preferredName: 'Ellie',
    roomNumber: '105B',
    age: 77,
    dateOfBirth: '1948-09-30',
    careLevel: 'Assisted',
    medicalAlerts: {
      dietaryRestrictions: true,
    },
    facility: 'Valencia Assisted Living of Cottonwood',
    primaryCareTeam: 'Nurse Sarah Johnson',
    lastActivity: '1 hour ago',
    gender: 'Female',
    medicalRecordNumber: 'MRN-001238',
    phone: '(555) 890-1234',
    email: 'ellie.martinez@email.com',
    primaryPhysician: 'Dr. Robert Chen',
    medicalConditions: ['Celiac Disease', 'Osteoporosis'],
    medications: [
      { name: 'Alendronate', dosage: '70mg', frequency: 'Once weekly' },
      { name: 'Calcium', dosage: '600mg', frequency: 'Twice daily' },
    ],
    allergies: [],
    dietaryRestrictions: ['Gluten-Free'],
    mobilityLevel: 'Independent',
    cognitiveStatus: 'Alert and Oriented',
    admissionDate: '2023-08-05',
    roomType: 'Semi-Private',
    emergencyContacts: [
      {
        name: 'Carlos Martinez',
        relationship: 'Son',
        phone: '(555) 901-2345',
        email: 'carlos.m@email.com',
        isPrimary: true,
      },
    ],
    insurance: {
      primary: 'Medicare',
      secondary: 'AARP Supplemental',
    },
    status: 'Active',
  },
  {
    id: '6',
    firstName: 'William',
    lastName: 'Davis',
    preferredName: 'Bill',
    roomNumber: '106A',
    age: 85,
    dateOfBirth: '1940-02-14',
    careLevel: 'Full Care',
    medicalAlerts: {
      fallRisk: true,
      allergies: true,
      medicationAlerts: true,
    },
    facility: 'Valencia Assisted Living of Cottonwood',
    primaryCareTeam: 'Nurse Michael Torres',
    lastActivity: '45 minutes ago',
    gender: 'Male',
    medicalRecordNumber: 'MRN-001239',
    phone: '(555) 012-3456',
    email: 'bill.davis@email.com',
    primaryPhysician: 'Dr. Emily Martinez',
    medicalConditions: ['Parkinsons Disease', 'Hypertension', 'Depression'],
    medications: [
      { name: 'Carbidopa-Levodopa', dosage: '25-100mg', frequency: 'Three times daily' },
      { name: 'Sertraline', dosage: '50mg', frequency: 'Once daily' },
    ],
    allergies: ['Codeine', 'Morphine'],
    dietaryRestrictions: ['Soft Diet'],
    mobilityLevel: 'Wheelchair',
    cognitiveStatus: 'Mild Cognitive Impairment',
    admissionDate: '2022-05-18',
    roomType: 'Private',
    emergencyContacts: [
      {
        name: 'Mary Davis',
        relationship: 'Wife',
        phone: '(555) 123-4567',
        email: 'mary.davis@email.com',
        isPrimary: true,
      },
    ],
    insurance: {
      primary: 'Medicare',
      secondary: 'Medicaid',
    },
    status: 'Active',
  },
];

export function ResidentsPage() {
  const [residents, setResidents] = useState<Resident[]>(mockResidents);
  const [filteredResidents, setFilteredResidents] = useState<Resident[]>(mockResidents);
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const residentsPerPage = 8;

  const indexOfLastResident = currentPage * residentsPerPage;
  const indexOfFirstResident = indexOfLastResident - residentsPerPage;
  const currentResidents = filteredResidents.slice(indexOfFirstResident, indexOfLastResident);
  const totalPages = Math.ceil(filteredResidents.length / residentsPerPage);

  const handleViewDetails = (resident: Resident) => {
    setSelectedResident(resident);
    setIsDetailsModalOpen(true);
  };

  const handleAddResident = (newResident: Resident) => {
    setResidents([...residents, newResident]);
    setFilteredResidents([...residents, newResident]);
    setIsAddModalOpen(false);
  };

  const handleUpdateResident = (updatedResident: Resident) => {
    const updatedResidents = residents.map(r => 
      r.id === updatedResident.id ? updatedResident : r
    );
    setResidents(updatedResidents);
    setFilteredResidents(updatedResidents);
    setIsDetailsModalOpen(false);
  };

  const handleDeleteResident = (residentId: string) => {
    const updatedResidents = residents.filter(r => r.id !== residentId);
    setResidents(updatedResidents);
    setFilteredResidents(updatedResidents);
    setIsDetailsModalOpen(false);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(currentResidents.map(r => r.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectResident = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    }
  };

  const handleExportPDF = () => {
    alert('Export to PDF functionality would be implemented here');
  };

  const handleExportExcel = () => {
    alert('Export to Excel functionality would be implemented here');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[#1e293b]">Residents</h2>
          <p className="text-sm text-[#64748b]">
            {filteredResidents.length} total residents
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Button
            variant="outline"
            onClick={handleExportPDF}
            className="gap-2 text-sm"
            size="sm"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export PDF</span>
            <span className="sm:hidden">PDF</span>
          </Button>
          <Button
            variant="outline"
            onClick={handleExportExcel}
            className="gap-2 text-sm"
            size="sm"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span className="hidden sm:inline">Export Excel</span>
            <span className="sm:hidden">Excel</span>
          </Button>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white gap-2 text-sm"
            size="sm"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add New Resident</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <SearchFilters
        residents={residents}
        onFilter={setFilteredResidents}
      />

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="bg-[#eff6ff] border border-[#2563eb] rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={selectedIds.length === currentResidents.length}
              onCheckedChange={handleSelectAll}
            />
            <span className="text-sm text-[#1e293b]">
              {selectedIds.length} resident{selectedIds.length !== 1 ? 's' : ''} selected
            </span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Bulk Edit
            </Button>
            <Button variant="outline" size="sm">
              Export Selected
            </Button>
          </div>
        </div>
      )}

      {/* Residents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentResidents.map((resident) => (
          <ResidentCard
            key={resident.id}
            resident={resident}
            isSelected={selectedIds.includes(resident.id)}
            onSelect={handleSelectResident}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              {[...Array(totalPages)].map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    onClick={() => setCurrentPage(index + 1)}
                    isActive={currentPage === index + 1}
                    className="cursor-pointer"
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Modals */}
      {selectedResident && (
        <ResidentDetailsModal
          resident={selectedResident}
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          onUpdate={handleUpdateResident}
          onDelete={handleDeleteResident}
        />
      )}

      <AddResidentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddResident}
      />
    </div>
  );
}
