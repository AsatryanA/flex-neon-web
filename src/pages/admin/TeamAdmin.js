import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import DataTable from '../../components/admin/DataTable';
import FormModal from '../../components/admin/FormModal';
import {
  getAdminTeam,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from '../../api/adminService';
import './AdminPages.css';

function TeamAdmin() {
  const { t } = useLanguage();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    emoji: '',
    displayOrder: 0,
    active: true,
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await getAdminTeam();
      setItems(response.data);
    } catch (error) {
      console.error('Failed to fetch team members:', error);
      alert('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({ name: '', role: '', emoji: '', displayOrder: 0, active: true });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      role: item.role,
      emoji: item.emoji,
      displayOrder: item.displayOrder,
      active: item.active,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this team member?')) return;
    try {
      await deleteTeamMember(id);
      fetchItems();
    } catch (error) {
      console.error('Failed to delete team member:', error);
      alert('Failed to delete team member');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateTeamMember(editingItem.id, formData);
      } else {
        await createTeamMember(formData);
      }
      setIsModalOpen(false);
      fetchItems();
    } catch (error) {
      console.error('Failed to save team member:', error);
      alert('Failed to save team member');
    }
  };

  const columns = [
    { key: 'emoji', label: 'Avatar' },
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role' },
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

  if (loading) return <div className="loading">{t('auth.loading')}</div>;

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Team Management</h1>
        <button onClick={handleAdd} className="btn-add">
          + Add Team Member
        </button>
      </div>

      <DataTable columns={columns} data={items} onEdit={handleEdit} onDelete={handleDelete} />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Team Member' : 'Add Team Member'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Role *</label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              placeholder="e.g., Lead Designer"
              required
            />
          </div>

          <div className="form-group">
            <label>Emoji *</label>
            <input
              type="text"
              value={formData.emoji}
              onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
              placeholder="👩‍🎨"
              required
            />
          </div>

          <div className="form-group">
            <label>Display Order</label>
            <input
              type="number"
              value={formData.displayOrder}
              onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
            />
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              />
              {' '}Active
            </label>
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              {editingItem ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </FormModal>
    </div>
  );
}

export default TeamAdmin;
