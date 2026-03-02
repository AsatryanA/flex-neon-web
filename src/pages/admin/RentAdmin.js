import React, { useEffect, useState } from 'react';
import DataTable from '../../components/admin/DataTable';
import FormModal from '../../components/admin/FormModal';
import {
  createOccasion,
  createRentalPackage,
  deleteOccasion,
  deleteRentalPackage,
  getAdminOccasions,
  getAdminRentalPackages,
  updateOccasion,
  updateRentalPackage,
} from '../../api/adminService';
import './AdminPages.css';

const defaultPackage = {
  name: '',
  price: '',
  duration: 'per day',
  features: [],
  color: '#ffaa00',
  popular: false,
  displayOrder: 0,
  active: true,
};

const defaultOccasion = {
  icon: '',
  name: '',
  description: '',
  displayOrder: 0,
  active: true,
};

const parseFeatures = (value) => value.split('\n').map((item) => item.trim()).filter(Boolean);

function RentAdmin() {
  const [packages, setPackages] = useState([]);
  const [occasions, setOccasions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalType, setModalType] = useState('package');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [packageForm, setPackageForm] = useState(defaultPackage);
  const [occasionForm, setOccasionForm] = useState(defaultOccasion);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [packagesRes, occasionsRes] = await Promise.all([
        getAdminRentalPackages(),
        getAdminOccasions(),
      ]);
      setPackages(packagesRes.data || []);
      setOccasions(occasionsRes.data || []);
    } catch (error) {
      console.error('Failed to load rent content:', error);
      alert('Failed to load rent content');
    } finally {
      setLoading(false);
    }
  };

  const openPackageModal = (item = null) => {
    setModalType('package');
    setEditingItem(item);
    setPackageForm(item
      ? {
        name: item.name || '',
        price: item.price || '',
        duration: item.duration || 'per day',
        features: Array.isArray(item.features) ? item.features : [],
        color: item.color || '#ffaa00',
        popular: item.popular ?? false,
        displayOrder: item.displayOrder ?? 0,
        active: item.active ?? true,
      }
      : defaultPackage);
    setIsModalOpen(true);
  };

  const openOccasionModal = (item = null) => {
    setModalType('occasion');
    setEditingItem(item);
    setOccasionForm(item
      ? {
        icon: item.icon || '',
        name: item.name || '',
        description: item.description || '',
        displayOrder: item.displayOrder ?? 0,
        active: item.active ?? true,
      }
      : defaultOccasion);
    setIsModalOpen(true);
  };

  const handleDeletePackage = async (id) => {
    if (!window.confirm('Delete this rental package?')) return;
    try {
      await deleteRentalPackage(id);
      fetchData();
    } catch (error) {
      console.error('Failed to delete package:', error);
      alert('Failed to delete package');
    }
  };

  const handleDeleteOccasion = async (id) => {
    if (!window.confirm('Delete this occasion?')) return;
    try {
      await deleteOccasion(id);
      fetchData();
    } catch (error) {
      console.error('Failed to delete occasion:', error);
      alert('Failed to delete occasion');
    }
  };

  const handleSubmitPackage = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateRentalPackage(editingItem.id, packageForm);
      } else {
        await createRentalPackage(packageForm);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Failed to save package:', error);
      alert('Failed to save package');
    }
  };

  const handleSubmitOccasion = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateOccasion(editingItem.id, occasionForm);
      } else {
        await createOccasion(occasionForm);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Failed to save occasion:', error);
      alert('Failed to save occasion');
    }
  };

  const packageColumns = [
    { key: 'name', label: 'Name' },
    { key: 'price', label: 'Price' },
    { key: 'duration', label: 'Duration' },
    {
      key: 'features',
      label: 'Features',
      render: (features) => {
        const list = Array.isArray(features) ? features : [];
        return `${list.length} items`;
      },
    },
    {
      key: 'popular',
      label: 'Popular',
      render: (popular) => (popular ? 'Yes' : 'No'),
    },
    { key: 'displayOrder', label: 'Order' },
    {
      key: 'active',
      label: 'Status',
      render: (active) => (
        <span className={active ? 'status-active' : 'status-inactive'}>
          {active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  const occasionColumns = [
    { key: 'icon', label: 'Icon' },
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    { key: 'displayOrder', label: 'Order' },
    {
      key: 'active',
      label: 'Status',
      render: (active) => (
        <span className={active ? 'status-active' : 'status-inactive'}>
          {active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  if (loading) return <div className="loading">Loading rent content...</div>;

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Rent: Packages</h1>
        <button onClick={() => openPackageModal()} className="btn-add">+ Add Package</button>
      </div>
      <DataTable columns={packageColumns} data={packages} onEdit={openPackageModal} onDelete={handleDeletePackage} />

      <div className="page-header" style={{ marginTop: '3rem' }}>
        <h1>Rent: Occasions</h1>
        <button onClick={() => openOccasionModal()} className="btn-add">+ Add Occasion</button>
      </div>
      <DataTable columns={occasionColumns} data={occasions} onEdit={openOccasionModal} onDelete={handleDeleteOccasion} />

      {modalType === 'package' && (
        <FormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Package' : 'Add Package'}>
          <form onSubmit={handleSubmitPackage}>
            <div className="form-group">
              <label>Name *</label>
              <input type="text" value={packageForm.name} onChange={(e) => setPackageForm({ ...packageForm, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Price *</label>
              <input type="text" value={packageForm.price} onChange={(e) => setPackageForm({ ...packageForm, price: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Duration *</label>
              <input type="text" value={packageForm.duration} onChange={(e) => setPackageForm({ ...packageForm, duration: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Features (one per line)</label>
              <textarea
                rows="5"
                value={Array.isArray(packageForm.features) ? packageForm.features.join('\n') : ''}
                onChange={(e) => setPackageForm({ ...packageForm, features: parseFeatures(e.target.value) })}
              />
            </div>
            <div className="form-group">
              <label>Color</label>
              <input type="text" value={packageForm.color} onChange={(e) => setPackageForm({ ...packageForm, color: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Display Order</label>
              <input type="number" value={packageForm.displayOrder} onChange={(e) => setPackageForm({ ...packageForm, displayOrder: parseInt(e.target.value, 10) || 0 })} />
            </div>
            <div className="form-group">
              <label>
                <input type="checkbox" checked={packageForm.popular} onChange={(e) => setPackageForm({ ...packageForm, popular: e.target.checked })} />{' '}
                Popular Package
              </label>
            </div>
            <div className="form-group">
              <label>
                <input type="checkbox" checked={packageForm.active} onChange={(e) => setPackageForm({ ...packageForm, active: e.target.checked })} />{' '}
                Active
              </label>
            </div>
            <div className="form-actions">
              <button type="button" onClick={() => setIsModalOpen(false)} className="btn-cancel">Cancel</button>
              <button type="submit" className="btn-submit">{editingItem ? 'Update' : 'Create'}</button>
            </div>
          </form>
        </FormModal>
      )}

      {modalType === 'occasion' && (
        <FormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Occasion' : 'Add Occasion'}>
          <form onSubmit={handleSubmitOccasion}>
            <div className="form-group">
              <label>Icon *</label>
              <input type="text" value={occasionForm.icon} onChange={(e) => setOccasionForm({ ...occasionForm, icon: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Name *</label>
              <input type="text" value={occasionForm.name} onChange={(e) => setOccasionForm({ ...occasionForm, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Description *</label>
              <textarea rows="4" value={occasionForm.description} onChange={(e) => setOccasionForm({ ...occasionForm, description: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Display Order</label>
              <input type="number" value={occasionForm.displayOrder} onChange={(e) => setOccasionForm({ ...occasionForm, displayOrder: parseInt(e.target.value, 10) || 0 })} />
            </div>
            <div className="form-group">
              <label>
                <input type="checkbox" checked={occasionForm.active} onChange={(e) => setOccasionForm({ ...occasionForm, active: e.target.checked })} />{' '}
                Active
              </label>
            </div>
            <div className="form-actions">
              <button type="button" onClick={() => setIsModalOpen(false)} className="btn-cancel">Cancel</button>
              <button type="submit" className="btn-submit">{editingItem ? 'Update' : 'Create'}</button>
            </div>
          </form>
        </FormModal>
      )}
    </div>
  );
}

export default RentAdmin;
