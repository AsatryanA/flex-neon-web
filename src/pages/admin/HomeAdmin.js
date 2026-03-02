import React, { useEffect, useState } from 'react';
import DataTable from '../../components/admin/DataTable';
import FormModal from '../../components/admin/FormModal';
import {
  createFeature,
  createShowcaseItem,
  deleteFeature,
  deleteShowcaseItem,
  getAdminFeatures,
  getAdminShowcase,
  updateFeature,
  updateShowcaseItem,
} from '../../api/adminService';
import './AdminPages.css';

const defaultFeature = {
  icon: '',
  title: '',
  description: '',
  displayOrder: 0,
  active: true,
};

const defaultShowcase = {
  title: '',
  color: '#ffaa00',
  displayOrder: 0,
  active: true,
};

function HomeAdmin() {
  const [features, setFeatures] = useState([]);
  const [showcase, setShowcase] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalType, setModalType] = useState('feature');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [featureForm, setFeatureForm] = useState(defaultFeature);
  const [showcaseForm, setShowcaseForm] = useState(defaultShowcase);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [featuresRes, showcaseRes] = await Promise.all([
        getAdminFeatures(),
        getAdminShowcase(),
      ]);
      setFeatures(featuresRes.data || []);
      setShowcase(showcaseRes.data || []);
    } catch (error) {
      console.error('Failed to load home content:', error);
      alert('Failed to load home content');
    } finally {
      setLoading(false);
    }
  };

  const openFeatureModal = (item = null) => {
    setModalType('feature');
    setEditingItem(item);
    setFeatureForm(item
      ? {
        icon: item.icon || '',
        title: item.title || '',
        description: item.description || '',
        displayOrder: item.displayOrder ?? 0,
        active: item.active ?? true,
      }
      : defaultFeature);
    setIsModalOpen(true);
  };

  const openShowcaseModal = (item = null) => {
    setModalType('showcase');
    setEditingItem(item);
    setShowcaseForm(item
      ? {
        title: item.title || '',
        color: item.color || '#ffaa00',
        displayOrder: item.displayOrder ?? 0,
        active: item.active ?? true,
      }
      : defaultShowcase);
    setIsModalOpen(true);
  };

  const handleDeleteFeature = async (id) => {
    if (!window.confirm('Delete this feature?')) return;
    try {
      await deleteFeature(id);
      fetchData();
    } catch (error) {
      console.error('Failed to delete feature:', error);
      alert('Failed to delete feature');
    }
  };

  const handleDeleteShowcase = async (id) => {
    if (!window.confirm('Delete this showcase item?')) return;
    try {
      await deleteShowcaseItem(id);
      fetchData();
    } catch (error) {
      console.error('Failed to delete showcase item:', error);
      alert('Failed to delete showcase item');
    }
  };

  const handleSubmitFeature = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateFeature(editingItem.id, featureForm);
      } else {
        await createFeature(featureForm);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Failed to save feature:', error);
      alert('Failed to save feature');
    }
  };

  const handleSubmitShowcase = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateShowcaseItem(editingItem.id, showcaseForm);
      } else {
        await createShowcaseItem(showcaseForm);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Failed to save showcase item:', error);
      alert('Failed to save showcase item');
    }
  };

  const featureColumns = [
    { key: 'icon', label: 'Icon' },
    { key: 'title', label: 'Title' },
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

  const showcaseColumns = [
    { key: 'title', label: 'Title' },
    {
      key: 'color',
      label: 'Color',
      render: (color) => <span style={{ color, fontWeight: 700 }}>{color}</span>,
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

  if (loading) return <div className="loading">Loading home content...</div>;

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Home Page</h1>
        <button onClick={() => openFeatureModal()} className="btn-add">+ Add Feature</button>
      </div>
      <DataTable columns={featureColumns} data={features} onEdit={openFeatureModal} onDelete={handleDeleteFeature} />

      <div className="page-header" style={{ marginTop: '3rem' }}>
        <h1>Showcase</h1>
        <button onClick={() => openShowcaseModal()} className="btn-add">+ Add Showcase Item</button>
      </div>
      <DataTable columns={showcaseColumns} data={showcase} onEdit={openShowcaseModal} onDelete={handleDeleteShowcase} />

      {modalType === 'feature' && (
        <FormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Feature' : 'Add Feature'}>
          <form onSubmit={handleSubmitFeature}>
            <div className="form-group">
              <label>Icon *</label>
              <input
                type="text"
                value={featureForm.icon}
                onChange={(e) => setFeatureForm({ ...featureForm, icon: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                value={featureForm.title}
                onChange={(e) => setFeatureForm({ ...featureForm, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Description *</label>
              <textarea
                rows="4"
                value={featureForm.description}
                onChange={(e) => setFeatureForm({ ...featureForm, description: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Display Order</label>
              <input
                type="number"
                value={featureForm.displayOrder}
                onChange={(e) => setFeatureForm({ ...featureForm, displayOrder: parseInt(e.target.value, 10) || 0 })}
              />
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={featureForm.active}
                  onChange={(e) => setFeatureForm({ ...featureForm, active: e.target.checked })}
                />{' '}
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

      {modalType === 'showcase' && (
        <FormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Showcase Item' : 'Add Showcase Item'}>
          <form onSubmit={handleSubmitShowcase}>
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                value={showcaseForm.title}
                onChange={(e) => setShowcaseForm({ ...showcaseForm, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Color *</label>
              <input
                type="text"
                value={showcaseForm.color}
                onChange={(e) => setShowcaseForm({ ...showcaseForm, color: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Display Order</label>
              <input
                type="number"
                value={showcaseForm.displayOrder}
                onChange={(e) => setShowcaseForm({ ...showcaseForm, displayOrder: parseInt(e.target.value, 10) || 0 })}
              />
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={showcaseForm.active}
                  onChange={(e) => setShowcaseForm({ ...showcaseForm, active: e.target.checked })}
                />{' '}
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

export default HomeAdmin;
