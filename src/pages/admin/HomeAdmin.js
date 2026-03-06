import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
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
  const { t } = useLanguage();
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
    { key: 'icon', label: t('admin.common.icon') },
    { key: 'title', label: t('admin.common.title') },
    { key: 'description', label: t('admin.common.description') },
    { key: 'displayOrder', label: t('admin.common.order') },
    {
      key: 'active',
      label: t('admin.common.status'),
      render: (active) => (
        <span className={active ? 'status-active' : 'status-inactive'}>
          {active ? t('admin.common.active') : t('admin.common.inactive')}
        </span>
      ),
    },
  ];

  const showcaseColumns = [
    { key: 'title', label: t('admin.common.title') },
    {
      key: 'color',
      label: t('admin.common.color'),
      render: (color) => <span style={{ color, fontWeight: 700 }}>{color}</span>,
    },
    { key: 'displayOrder', label: t('admin.common.order') },
    {
      key: 'active',
      label: t('admin.common.status'),
      render: (active) => (
        <span className={active ? 'status-active' : 'status-inactive'}>
          {active ? t('admin.common.active') : t('admin.common.inactive')}
        </span>
      ),
    },
  ];

  if (loading) return <div className="loading">{t('auth.loading')}</div>;

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>{t('admin.home.pageTitle')}</h1>
        <button onClick={() => openFeatureModal()} className="btn-add">+ {t('admin.home.addFeature')}</button>
      </div>
      <DataTable columns={featureColumns} data={features} onEdit={openFeatureModal} onDelete={handleDeleteFeature} />

      <div className="page-header" style={{ marginTop: '3rem' }}>
        <h1>{t('admin.home.showcase')}</h1>
        <button onClick={() => openShowcaseModal()} className="btn-add">+ {t('admin.home.addShowcaseItem')}</button>
      </div>
      <DataTable columns={showcaseColumns} data={showcase} onEdit={openShowcaseModal} onDelete={handleDeleteShowcase} />

      {modalType === 'feature' && (
        <FormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? `${t('admin.table.edit')} ${t('admin.dashboard.features')}` : `${t('admin.common.create')} ${t('admin.dashboard.features')}`}>
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
                {t('admin.common.active')}
              </label>
            </div>
            <div className="form-actions">
              <button type="button" onClick={() => setIsModalOpen(false)} className="btn-cancel">{t('admin.common.cancel')}</button>
              <button type="submit" className="btn-submit">{editingItem ? t('admin.common.update') : t('admin.common.create')}</button>
            </div>
          </form>
        </FormModal>
      )}

      {modalType === 'showcase' && (
        <FormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? `${t('admin.table.edit')} ${t('admin.home.showcase')}` : `${t('admin.common.create')} ${t('admin.home.showcase')}`}>
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
                {t('admin.common.active')}
              </label>
            </div>
            <div className="form-actions">
              <button type="button" onClick={() => setIsModalOpen(false)} className="btn-cancel">{t('admin.common.cancel')}</button>
              <button type="submit" className="btn-submit">{editingItem ? t('admin.common.update') : t('admin.common.create')}</button>
            </div>
          </form>
        </FormModal>
      )}
    </div>
  );
}

export default HomeAdmin;
