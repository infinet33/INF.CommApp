import { useState } from 'react';
import { Plus, Search, MoreVertical, Edit, Trash2, Mail, Phone } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Care Coordinator' | 'Activities Director' | 'Dining Services Manager' | 'Nurse' | 'Administrator';
  status: 'Active' | 'Inactive';
  shift?: string;
  department?: string;
}

const mockStaff: StaffMember[] = [
  {
    id: '1',
    name: 'Jennifer Lee',
    email: 'jennifer.lee@valencia.com',
    phone: '(555) 123-4567',
    role: 'Care Coordinator',
    status: 'Active',
    shift: 'Day',
    department: 'Care Services',
  },
  {
    id: '2',
    name: 'David Martinez',
    email: 'david.martinez@valencia.com',
    phone: '(555) 234-5678',
    role: 'Activities Director',
    status: 'Active',
    shift: 'Day',
    department: 'Recreation',
  },
  {
    id: '3',
    name: 'Amanda Wilson',
    email: 'amanda.wilson@valencia.com',
    phone: '(555) 345-6789',
    role: 'Dining Services Manager',
    status: 'Active',
    shift: 'Day',
    department: 'Dining',
  },
  {
    id: '4',
    name: 'Robert Thompson',
    email: 'robert.thompson@valencia.com',
    phone: '(555) 456-7890',
    role: 'Nurse',
    status: 'Active',
    shift: 'Night',
    department: 'Care Services',
  },
  {
    id: '5',
    name: 'Maria Garcia',
    email: 'maria.garcia@valencia.com',
    phone: '(555) 567-8901',
    role: 'Administrator',
    status: 'Active',
    shift: 'Day',
    department: 'Administration',
  },
];

export function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>(mockStaff);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Care Coordinator' as StaffMember['role'],
    status: 'Active' as StaffMember['status'],
    shift: '',
    department: '',
  });

  const filteredStaff = staff.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.department?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesRole = selectedRole === 'all' || member.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const handleAddStaff = () => {
    const newStaff: StaffMember = {
      id: Date.now().toString(),
      ...formData,
    };
    setStaff([...staff, newStaff]);
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditStaff = () => {
    if (editingStaff) {
      setStaff(
        staff.map((member) =>
          member.id === editingStaff.id ? { ...member, ...formData } : member
        )
      );
      setIsEditDialogOpen(false);
      setEditingStaff(null);
      resetForm();
    }
  };

  const handleDeleteStaff = (id: string) => {
    setStaff(staff.filter((member) => member.id !== id));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'Care Coordinator',
      status: 'Active',
      shift: '',
      department: '',
    });
  };

  const openEditDialog = (member: StaffMember) => {
    setEditingStaff(member);
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone,
      role: member.role,
      status: member.status,
      shift: member.shift || '',
      department: member.department || '',
    });
    setIsEditDialogOpen(true);
  };

  const getRoleBadgeColor = (role: StaffMember['role']) => {
    const colors = {
      'Care Coordinator': 'border-[#2563eb] text-[#2563eb]',
      'Activities Director': 'border-[#16a34a] text-[#16a34a]',
      'Dining Services Manager': 'border-[#d97706] text-[#d97706]',
      'Nurse': 'border-[#8b5cf6] text-[#8b5cf6]',
      'Administrator': 'border-[#dc2626] text-[#dc2626]',
    };
    return colors[role];
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg border border-[#e2e8f0]">
      {/* Header */}
      <div className="p-6 border-b border-[#e2e8f0]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-[#1e293b] mb-1">Staff</h1>
            <p className="text-sm text-[#64748b]">
              Manage facility staff members
            </p>
          </div>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Staff Member
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#94a3b8]" />
            <Input
              placeholder="Search staff..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="Care Coordinator">Care Coordinator</SelectItem>
              <SelectItem value="Activities Director">Activities Director</SelectItem>
              <SelectItem value="Dining Services Manager">Dining Services Manager</SelectItem>
              <SelectItem value="Nurse">Nurse</SelectItem>
              <SelectItem value="Administrator">Administrator</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-[#f9fafb] sticky top-0">
            <tr>
              <th className="text-left px-6 py-3 text-xs text-[#64748b]">Name</th>
              <th className="text-left px-6 py-3 text-xs text-[#64748b]">Role</th>
              <th className="text-left px-6 py-3 text-xs text-[#64748b]">
                Department
              </th>
              <th className="text-left px-6 py-3 text-xs text-[#64748b]">
                Contact
              </th>
              <th className="text-left px-6 py-3 text-xs text-[#64748b]">
                Status
              </th>
              <th className="text-right px-6 py-3 text-xs text-[#64748b]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e2e8f0]">
            {filteredStaff.map((member) => (
              <tr key={member.id} className="hover:bg-[#f9fafb]">
                <td className="px-6 py-4">
                  <div className="text-sm text-[#1e293b]">{member.name}</div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs border bg-[#f8fafc] ${getRoleBadgeColor(
                      member.role
                    )}`}
                  >
                    {member.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-[#64748b]">
                    {member.department || '-'}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-xs text-[#64748b]">
                      <Mail className="h-3 w-3" />
                      {member.email}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#64748b]">
                      <Phone className="h-3 w-3" />
                      {member.phone}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs ${
                      member.status === 'Active'
                        ? 'bg-[#dcfce7] text-[#16a34a]'
                        : 'bg-[#f1f5f9] text-[#64748b]'
                    }`}
                  >
                    {member.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditDialog(member)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteStaff(member.id)}
                        className="text-[#dc2626]"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredStaff.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#64748b]">No staff members found</p>
          </div>
        )}
      </div>

      {/* Add Staff Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Staff Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="email@valencia.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="(555) 123-4567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value as StaffMember['role'] })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Care Coordinator">Care Coordinator</SelectItem>
                  <SelectItem value="Activities Director">Activities Director</SelectItem>
                  <SelectItem value="Dining Services Manager">Dining Services Manager</SelectItem>
                  <SelectItem value="Nurse">Nurse</SelectItem>
                  <SelectItem value="Administrator">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department (Optional)</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
                placeholder="Department name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shift">Shift (Optional)</Label>
              <Select
                value={formData.shift}
                onValueChange={(value) =>
                  setFormData({ ...formData, shift: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select shift" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Day">Day</SelectItem>
                  <SelectItem value="Night">Night</SelectItem>
                  <SelectItem value="Evening">Evening</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value as StaffMember['status'] })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddDialogOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddStaff}
              className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white"
            >
              Add Staff Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Staff Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Staff Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="email@valencia.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="(555) 123-4567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value as StaffMember['role'] })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Care Coordinator">Care Coordinator</SelectItem>
                  <SelectItem value="Activities Director">Activities Director</SelectItem>
                  <SelectItem value="Dining Services Manager">Dining Services Manager</SelectItem>
                  <SelectItem value="Nurse">Nurse</SelectItem>
                  <SelectItem value="Administrator">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-department">Department (Optional)</Label>
              <Input
                id="edit-department"
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
                placeholder="Department name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-shift">Shift (Optional)</Label>
              <Select
                value={formData.shift}
                onValueChange={(value) =>
                  setFormData({ ...formData, shift: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select shift" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Day">Day</SelectItem>
                  <SelectItem value="Night">Night</SelectItem>
                  <SelectItem value="Evening">Evening</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value as StaffMember['status'] })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setEditingStaff(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditStaff}
              className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
