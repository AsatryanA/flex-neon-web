import React, { useEffect, useState } from 'react';
import DataTable from '../../components/admin/DataTable';
import FormModal from '../../components/admin/FormModal';
import {
  createCompanyValue,
  createStat,
  createStorySection,
  createTeamMember,
  deleteCompanyValue,
  deleteStat,
  deleteStorySection,
  deleteTeamMember,
  getAdminStats,
  getAdminStory,
  getAdminTeam,
  getAdminValues,
  updateCompanyValue,
  updateStat,
  updateStorySection,
  updateTeamMember,
} from '../../api/adminService';
import './AdminPages.css';

const defaults = {
  team: { name: '', role: '', emoji: '', displayOrder: 0, active: true },
  values: { icon: '', title: '', description: '', displayOrder: 0, active: true },
  story: { title: '', content: '', displayOrder: 0, active: true },
  stats: { label: '', number: '', displayOrder: 0, active: true },
};

function AboutAdmin() {
  const [team, setTeam] = useState([]);
  const [values, setValues] = useState([]);
  const [story, setStory] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalType, setModalType] = useState('team');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(defaults.team);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [teamRes, valuesRes, storyRes, statsRes] = await Promise.all([
        getAdminTeam(),
        getAdminValues(),
        getAdminStory(),
        getAdminStats(),
      ]);
      setTeam(teamRes.data || []);
      setValues(valuesRes.data || []);
      setStory(storyRes.data || []);
      setStats(statsRes.data || []);
    } catch (error) {
      console.error('Failed to load about content:', error);
      alert('Failed to load about content');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);

    if (!item) {
      setFormData(defaults[type]);
      setIsModalOpen(true);
      return;
    }

    if (type === 'team') {
      setFormData({
        name: item.name || '',
        role: item.role || '',
        emoji: item.emoji || '',
        displayOrder: item.displayOrder ?? 0,
        active: item.active ?? true,
      });
    }

    if (type === 'values') {
      setFormData({
        icon: item.icon || '',
        title: item.title || '',
        description: item.description || '',
        displayOrder: item.displayOrder ?? 0,
        active: item.active ?? true,
      });
    }

    if (type === 'story') {
      setFormData({
        title: item.title || '',
        content: item.content || item.description || item.text || '',
        displayOrder: item.displayOrder ?? 0,
        active: item.active ?? true,
      });
    }

    if (type === 'stats') {
      setFormData({
        label: item.label || item.title || '',
        number: item.number || item.value || '',
        displayOrder: item.displayOrder ?? 0,
        active: item.active ?? true,
      });
    }

    setIsModalOpen(true);
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Delete this item?')) return;

    try {
      if (type === 'team') await deleteTeamMember(id);
      if (type === 'values') await deleteCompanyValue(id);
      if (type === 'story') await deleteStorySection(id);
      if (type === 'stats') await deleteStat(id);
      fetchData();
    } catch (error) {
      console.error('Failed to delete item:', error);
      alert('Failed to delete item');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (modalType === 'team') {
        if (editingItem) await updateTeamMember(editingItem.id, formData);
        else await createTeamMember(formData);
      }

      if (modalType === 'values') {
        if (editingItem) await updateCompanyValue(editingItem.id, formData);
        else await createCompanyValue(formData);
      }

      if (modalType === 'story') {
        if (editingItem) await updateStorySection(editingItem.id, formData);
        else await createStorySection(formData);
      }

      if (modalType === 'stats') {
        if (editingItem) await updateStat(editingItem.id, formData);
        else await createStat(formData);
      }

      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Failed to save item:', error);
      alert('Failed to save item');
    }
  };

  const statusColumn = {
    key: 'active',
    label: 'Status',
    render: (active) => (
      <span className={active ? 'status-active' : 'status-inactive'}>
        {active ? 'Active' : 'Inactive'}
      </span>
    ),
  };

  const teamColumns = [
    { key: 'emoji', label: 'Avatar' },
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role' },
    { key: 'displayOrder', label: 'Order' },
    statusColumn,
  ];

  const valuesColumns = [
    { key: 'icon', label: 'Icon' },
    { key: 'title', label: 'Title' },
    { key: 'description', label: 'Description' },
    { key: 'displayOrder', label: 'Order' },
    statusColumn,
  ];

  const storyColumns = [
    { key: 'title', label: 'Title' },
    {
      key: 'content',
      label: 'Content',
      render: (value, row) => {
        const text = value || row.description || row.text || '';
        return text.length > 120 ? `${text.slice(0, 120)}...` : text;
      },
    },
    { key: 'displayOrder', label: 'Order' },
    statusColumn,
  ];

  const statsColumns = [
    { key: 'label', label: 'Label' },
    {
      key: 'number',
      label: 'Number',
      render: (value, row) => value || row.value,
    },
    { key: 'displayOrder', label: 'Order' },
    statusColumn,
  ];

  if (loading) return <div className="loading">Loading about content...</div>;

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>About: Team</h1>
        <button onClick={() => openModal('team')} className="btn-add">+ Add Team Member</button>
      </div>
      <DataTable columns={teamColumns} data={team} onEdit={(item) => openModal('team', item)} onDelete={(id) => handleDelete('team', id)} />

      <div className="page-header" style={{ marginTop: '3rem' }}>
        <h1>About: Values</h1>
        <button onClick={() => openModal('values')} className="btn-add">+ Add Value</button>
      </div>
      <DataTable columns={valuesColumns} data={values} onEdit={(item) => openModal('values', item)} onDelete={(id) => handleDelete('values', id)} />

      <div className="page-header" style={{ marginTop: '3rem' }}>
        <h1>About: Story</h1>
        <button onClick={() => openModal('story')} className="btn-add">+ Add Story Block</button>
      </div>
      <DataTable columns={storyColumns} data={story} onEdit={(item) => openModal('story', item)} onDelete={(id) => handleDelete('story', id)} />

      <div className="page-header" style={{ marginTop: '3rem' }}>
        <h1>About: Stats</h1>
        <button onClick={() => openModal('stats')} className="btn-add">+ Add Stat</button>
      </div>
      <DataTable columns={statsColumns} data={stats} onEdit={(item) => openModal('stats', item)} onDelete={(id) => handleDelete('stats', id)} />

      <FormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? `Edit ${modalType}` : `Add ${modalType}`}>
        <form onSubmit={handleSubmit}>
          {modalType === 'team' && (
            <>
              <div className="form-group">
                <label>Name *</label>
                <input type="text" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Role *</label>
                <input type="text" value={formData.role || ''} onChange={(e) => setFormData({ ...formData, role: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Emoji *</label>
                <input type="text" value={formData.emoji || ''} onChange={(e) => setFormData({ ...formData, emoji: e.target.value })} required />
              </div>
            </>
          )}

          {modalType === 'values' && (
            <>
              <div className="form-group">
                <label>Icon *</label>
                <input type="text" value={formData.icon || ''} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Title *</label>
                <input type="text" value={formData.title || ''} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea rows="4" value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
              </div>
            </>
          )}

          {modalType === 'story' && (
            <>
              <div className="form-group">
                <label>Title (Optional)</label>
                <input type="text" value={formData.title || ''} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Content *</label>
                <textarea rows="6" value={formData.content || ''} onChange={(e) => setFormData({ ...formData, content: e.target.value })} required />
              </div>
            </>
          )}

          {modalType === 'stats' && (
            <>
              <div className="form-group">
                <label>Label *</label>
                <input type="text" value={formData.label || ''} onChange={(e) => setFormData({ ...formData, label: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Number *</label>
                <input type="text" value={formData.number || ''} onChange={(e) => setFormData({ ...formData, number: e.target.value })} required />
              </div>
            </>
          )}

          <div className="form-group">
            <label>Display Order</label>
            <input
              type="number"
              value={formData.displayOrder ?? 0}
              onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value, 10) || 0 })}
            />
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={formData.active ?? true}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
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
    </div>
  );
}

export default AboutAdmin;
