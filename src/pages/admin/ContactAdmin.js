import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import DataTable from '../../components/admin/DataTable';
import FormModal from '../../components/admin/FormModal';
import {
  getAdminContact,
  createContactInfo,
  updateContactInfo,
  deleteContactInfo,
  getAdminFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
} from '../../api/adminService';
import './AdminPages.css';

function ContactAdmin() {
  const { t } = useLanguage();
  const [contactItems, setContactItems] = useState([]);
  const [faqItems, setFaqItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('contact'); // 'contact' or 'faq'
  const [editingItem, setEditingItem] = useState(null);
  const [contactFormData, setContactFormData] = useState({
    icon: '',
    title: '',
    info: '',
    link: '',
    displayOrder: 0,
    active: true,
  });
  const [faqFormData, setFaqFormData] = useState({
    question: '',
    answer: '',
    displayOrder: 0,
    active: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [contactRes, faqRes] = await Promise.all([
        getAdminContact(),
        getAdminFAQs(),
      ]);
      const contactData = Array.isArray(contactRes.data) ? contactRes.data : [];
      const hasWorkingHours = contactData.some((item) => {
        const title = (item.title || '').toLowerCase();
        return title.includes('working') || title.includes('hours');
      });

      if (!hasWorkingHours) {
        await createContactInfo({
          icon: '⏰',
          title: 'Working Hours',
          info: 'Mon-Fri: 10AM - 7PM',
          link: '',
          displayOrder: 999,
          active: true,
        });

        const refreshedContactRes = await getAdminContact();
        setContactItems(Array.isArray(refreshedContactRes.data) ? refreshedContactRes.data : []);
      } else {
        setContactItems(contactData);
      }

      setFaqItems(faqRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      alert('Failed to load contact data');
    } finally {
      setLoading(false);
    }
  };

  // Contact Info Handlers
  const handleAddContact = () => {
    setModalType('contact');
    setEditingItem(null);
    setContactFormData({
      icon: '',
      title: '',
      info: '',
      link: '',
      displayOrder: 0,
      active: true,
    });
    setIsModalOpen(true);
  };

  const handleEditContact = (item) => {
    setModalType('contact');
    setEditingItem(item);
    setContactFormData({
      icon: item.icon,
      title: item.title,
      info: item.info,
      link: item.link || '',
      displayOrder: item.displayOrder,
      active: item.active,
    });
    setIsModalOpen(true);
  };

  const handleDeleteContact = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await deleteContactInfo(id);
      fetchData();
    } catch (error) {
      console.error('Failed to delete:', error);
      alert('Failed to delete contact info');
    }
  };

  const handleSubmitContact = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateContactInfo(editingItem.id, contactFormData);
      } else {
        await createContactInfo(contactFormData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Failed to save:', error);
      alert('Failed to save contact info');
    }
  };

  // FAQ Handlers
  const handleAddFAQ = () => {
    setModalType('faq');
    setEditingItem(null);
    setFaqFormData({
      question: '',
      answer: '',
      displayOrder: 0,
      active: true,
    });
    setIsModalOpen(true);
  };

  const handleEditFAQ = (item) => {
    setModalType('faq');
    setEditingItem(item);
    setFaqFormData({
      question: item.question,
      answer: item.answer,
      displayOrder: item.displayOrder,
      active: item.active,
    });
    setIsModalOpen(true);
  };

  const handleDeleteFAQ = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await deleteFAQ(id);
      fetchData();
    } catch (error) {
      console.error('Failed to delete:', error);
      alert('Failed to delete FAQ');
    }
  };

  const handleSubmitFAQ = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateFAQ(editingItem.id, faqFormData);
      } else {
        await createFAQ(faqFormData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Failed to save:', error);
      alert('Failed to save FAQ');
    }
  };

  const contactColumns = [
    { key: 'icon', label: t('admin.common.icon') },
    { key: 'title', label: t('admin.common.title') },
    { key: 'info', label: 'Info' },
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

  const faqColumns = [
    { key: 'question', label: 'Question' },
    {
      key: 'answer',
      label: 'Answer',
      render: (answer) => answer.substring(0, 100) + (answer.length > 100 ? '...' : '')
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
      {/* Contact Info Section */}
      <div className="page-header">
        <h1>{t('admin.contact.info')}</h1>
        <button onClick={handleAddContact} className="btn-add">
          + {t('admin.contact.addInfo')}
        </button>
      </div>
      <DataTable
        columns={contactColumns}
        data={contactItems}
        onEdit={handleEditContact}
        onDelete={handleDeleteContact}
      />

      {/* FAQ Section */}
      <div className="page-header" style={{ marginTop: '3rem' }}>
        <h1>FAQs</h1>
        <button onClick={handleAddFAQ} className="btn-add">
          + {t('admin.contact.addFaq')}
        </button>
      </div>
      <DataTable
        columns={faqColumns}
        data={faqItems}
        onEdit={handleEditFAQ}
        onDelete={handleDeleteFAQ}
      />

      {/* Modal for Contact Info */}
      {modalType === 'contact' && (
        <FormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingItem ? 'Edit Contact Info' : 'Add Contact Info'}
        >
          <form onSubmit={handleSubmitContact}>
            <div className="form-group">
              <label>Icon *</label>
              <input
                type="text"
                value={contactFormData.icon}
                onChange={(e) => setContactFormData({ ...contactFormData, icon: e.target.value })}
                placeholder="📧"
                required
              />
            </div>
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                value={contactFormData.title}
                onChange={(e) => setContactFormData({ ...contactFormData, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Info *</label>
              <input
                type="text"
                value={contactFormData.info}
                onChange={(e) => setContactFormData({ ...contactFormData, info: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Link (Optional)</label>
              <input
                type="text"
                value={contactFormData.link}
                onChange={(e) => setContactFormData({ ...contactFormData, link: e.target.value })}
                placeholder="mailto:email@example.com or tel:+1234567890"
              />
            </div>
            <div className="form-group">
              <label>Display Order</label>
              <input
                type="number"
                value={contactFormData.displayOrder}
                onChange={(e) => setContactFormData({ ...contactFormData, displayOrder: parseInt(e.target.value) })}
              />
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={contactFormData.active}
                  onChange={(e) => setContactFormData({ ...contactFormData, active: e.target.checked })}
                />
                {' '}{t('admin.common.active')}
              </label>
            </div>
            <div className="form-actions">
              <button type="button" onClick={() => setIsModalOpen(false)} className="btn-cancel">
                {t('admin.common.cancel')}
              </button>
              <button type="submit" className="btn-submit">
                {editingItem ? t('admin.common.update') : t('admin.common.create')}
              </button>
            </div>
          </form>
        </FormModal>
      )}

      {/* Modal for FAQ */}
      {modalType === 'faq' && (
        <FormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingItem ? 'Edit FAQ' : 'Add FAQ'}
        >
          <form onSubmit={handleSubmitFAQ}>
            <div className="form-group">
              <label>Question *</label>
              <input
                type="text"
                value={faqFormData.question}
                onChange={(e) => setFaqFormData({ ...faqFormData, question: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Answer *</label>
              <textarea
                value={faqFormData.answer}
                onChange={(e) => setFaqFormData({ ...faqFormData, answer: e.target.value })}
                rows="4"
                required
              />
            </div>
            <div className="form-group">
              <label>Display Order</label>
              <input
                type="number"
                value={faqFormData.displayOrder}
                onChange={(e) => setFaqFormData({ ...faqFormData, displayOrder: parseInt(e.target.value) })}
              />
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={faqFormData.active}
                  onChange={(e) => setFaqFormData({ ...faqFormData, active: e.target.checked })}
                />
                {' '}{t('admin.common.active')}
              </label>
            </div>
            <div className="form-actions">
              <button type="button" onClick={() => setIsModalOpen(false)} className="btn-cancel">
                {t('admin.common.cancel')}
              </button>
              <button type="submit" className="btn-submit">
                {editingItem ? t('admin.common.update') : t('admin.common.create')}
              </button>
            </div>
          </form>
        </FormModal>
      )}
    </div>
  );
}

export default ContactAdmin;
