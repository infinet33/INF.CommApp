import { useState } from 'react';
import { Plus, Search, MoreVertical, Edit, Trash2, Mail, Phone, MapPin, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface Vendor {
  id: string;
  name: string;
  type: 'Home Health Agency' | 'Hospice' | 'Pharmacy' | 'Medical Equipment' | 'Therapy Services' | 'Transportation' | 'Lab Services' | 'Other';
  contactName: string;
  email: string;
  phone: string;
  address: string;
  status: 'Active' | 'Inactive';
  notes?: string;
}

const mockVendors: Vendor[] = [
  {
    id: '1',
    name: 'Caring Hands Home Health',
    type: 'Home Health Agency',
    contactName: 'Emily Rodriguez',
    email: 'emily@caringhands.com',
    phone: '(555) 345-6789',
    address: '123 Healthcare Ave, Medical City, MC 12345',
    status: 'Active',
    notes: 'Primary home health provider',
  },
  {
    id: '2',
    name: 'Mobility Plus Equipment',
    type: 'Medical Equipment',
    contactName: 'James Wilson',
    email: 'jwilson@mobilityplus.com',
    phone: '(555) 456-7890',
    address: '456 Equipment Rd, Medical City, MC 12345',
    status: 'Active',
  },
  {
    id: '3',
    name: 'Advanced Therapy Solutions',
    type: 'Therapy Services',
    contactName: 'Sarah Mitchell',
    email: 'sarah@advancedtherapy.com',
    phone: '(555) 567-8901',
    address: '789 Therapy Ln, Medical City, MC 12345',
    status: 'Active',
    notes: 'Physical and occupational therapy',
  },
  {
    id: '4',
    name: 'SafeRide Medical Transport',
    type: 'Transportation',
    contactName: 'Robert Chen',
    email: 'robert@saferide.com',
    phone: '(555) 678-9012',
    address: '321 Transit St, Medical City, MC 12345',
    status: 'Active',
  },
  {
    id: '5',
    name: 'QuickLab Diagnostics',
    type: 'Lab Services',
    contactName: 'Maria Garcia',
    email: 'maria@quicklab.com',
    phone: '(555) 789-0123',
    address: '654 Lab Plaza, Medical City, MC 12345',
    status: 'Inactive',
  },
];

export function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>(mockVendors);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Home Health Agency' as Vendor['type'],
    contactName: '',
    email: '',
    phone: '',
    address: '',
    status: 'Active' as Vendor['status'],
    notes: '',
  });

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch =
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || vendor.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleAddVendor = () => {
    const newVendor: Vendor = {
      id: Date.now().toString(),
      ...formData,
    };
    setVendors([...vendors, newVendor]);
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditVendor = () => {
    if (editingVendor) {
      setVendors(
        vendors.map((vendor) =>
          vendor.id === editingVendor.id ? { ...vendor, ...formData } : vendor
        )
      );
      setIsEditDialogOpen(false);
      setEditingVendor(null);
      resetForm();
    }
  };

  const handleDeleteVendor = (id: string) => {
    setVendors(vendors.filter((vendor) => vendor.id !== id));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'Home Health Agency',
      contactName: '',
      email: '',
      phone: '',
      address: '',
      status: 'Active',
      notes: '',
    });
  };

  const openEditDialog = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setFormData({
      name: vendor.name,
      type: vendor.type,
      contactName: vendor.contactName,
      email: vendor.email,
      phone: vendor.phone,
      address: vendor.address,
      status: vendor.status,
      notes: vendor.notes || '',
    });
    setIsEditDialogOpen(true);
  };

  const getTypeBadgeColor = (type: Vendor['type']) => {
    const colors = {
      'Home Health Agency': 'border-[#16a34a] text-[#16a34a]',
      'Hospice': 'border-[#9333ea] text-[#9333ea]',
      'Pharmacy': 'border-[#2563eb] text-[#2563eb]',
      'Medical Equipment': 'border-[#2563eb] text-[#2563eb]',
      'Therapy Services': 'border-[#9333ea] text-[#9333ea]',
      'Transportation': 'border-[#d97706] text-[#d97706]',
      'Lab Services': 'border-[#dc2626] text-[#dc2626]',
      'Other': 'border-[#64748b] text-[#64748b]',
    };
    return colors[type];
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg border border-[#e2e8f0]">
      {/* Header */}
      <div className="p-6 border-b border-[#e2e8f0]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-[#1e293b] mb-1">Vendors</h1>
            <p className="text-sm text-[#64748b]">
              Manage external service providers and suppliers
            </p>
          </div>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Vendor
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#94a3b8]" />
            <Input
              placeholder="Search vendors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Home Health Agency">Home Health Agency</SelectItem>
              <SelectItem value="Hospice">Hospice</SelectItem>
              <SelectItem value="Pharmacy">Pharmacy</SelectItem>
              <SelectItem value="Medical Equipment">Medical Equipment</SelectItem>
              <SelectItem value="Therapy Services">Therapy Services</SelectItem>
              <SelectItem value="Transportation">Transportation</SelectItem>
              <SelectItem value="Lab Services">Lab Services</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-[#f9fafb] sticky top-0">
            <tr>
              <th className="text-left px-6 py-3 text-xs text-[#64748b]">Vendor Name</th>
              <th className="text-left px-6 py-3 text-xs text-[#64748b]">Type</th>
              <th className="text-left px-6 py-3 text-xs text-[#64748b]">
                Contact Person
              </th>
              <th className="text-left px-6 py-3 text-xs text-[#64748b]">
                Contact Info
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
            {filteredVendors.map((vendor) => (
              <tr key={vendor.id} className="hover:bg-[#f9fafb]">
                <td className="px-6 py-4">
                  <div className="text-sm text-[#1e293b]">{vendor.name}</div>
                  <div className="flex items-center gap-1 text-xs text-[#64748b] mt-1">
                    <MapPin className="h-3 w-3" />
                    {vendor.address}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs border bg-[#f8fafc] ${getTypeBadgeColor(
                      vendor.type
                    )}`}
                  >
                    {vendor.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-[#1e293b]">{vendor.contactName}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-xs text-[#64748b]">
                      <Mail className="h-3 w-3" />
                      {vendor.email}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#64748b]">
                      <Phone className="h-3 w-3" />
                      {vendor.phone}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs ${
                      vendor.status === 'Active'
                        ? 'bg-[#dcfce7] text-[#16a34a]'
                        : 'bg-[#f1f5f9] text-[#64748b]'
                    }`}
                  >
                    {vendor.status}
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
                      <DropdownMenuItem onClick={() => openEditDialog(vendor)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteVendor(vendor.id)}
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

        {filteredVendors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#64748b]">No vendors found</p>
          </div>
        )}
      </div>

      {/* Add Vendor Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Vendor</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Vendor Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter vendor name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Vendor Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value as Vendor['type'] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Home Health Agency">Home Health Agency</SelectItem>
                    <SelectItem value="Hospice">Hospice</SelectItem>
                    <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                    <SelectItem value="Medical Equipment">Medical Equipment</SelectItem>
                    <SelectItem value="Therapy Services">Therapy Services</SelectItem>
                    <SelectItem value="Transportation">Transportation</SelectItem>
                    <SelectItem value="Lab Services">Lab Services</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactName">Contact Person</Label>
              <Input
                id="contactName"
                value={formData.contactName}
                onChange={(e) =>
                  setFormData({ ...formData, contactName: e.target.value })
                }
                placeholder="Enter contact person name"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="email@example.com"
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
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Street address, city, state, zip"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value as Vendor['status'] })
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
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Additional information about this vendor..."
                rows={3}
              />
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
              onClick={handleAddVendor}
              className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white"
            >
              Add Vendor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Vendor Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Vendor</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Vendor Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter vendor name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-type">Vendor Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value as Vendor['type'] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Home Health Agency">Home Health Agency</SelectItem>
                    <SelectItem value="Hospice">Hospice</SelectItem>
                    <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                    <SelectItem value="Medical Equipment">Medical Equipment</SelectItem>
                    <SelectItem value="Therapy Services">Therapy Services</SelectItem>
                    <SelectItem value="Transportation">Transportation</SelectItem>
                    <SelectItem value="Lab Services">Lab Services</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-contactName">Contact Person</Label>
              <Input
                id="edit-contactName"
                value={formData.contactName}
                onChange={(e) =>
                  setFormData({ ...formData, contactName: e.target.value })
                }
                placeholder="Enter contact person name"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="email@example.com"
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
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-address">Address</Label>
              <Input
                id="edit-address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Street address, city, state, zip"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value as Vendor['status'] })
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
            <div className="space-y-2">
              <Label htmlFor="edit-notes">Notes (Optional)</Label>
              <Textarea
                id="edit-notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Additional information about this vendor..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setEditingVendor(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditVendor}
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
