import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import './DataTable.css';

function DataTable({ columns, data, onEdit, onDelete }) {
  const { t } = useLanguage();
  return (
    <div className="data-table-container">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            <th>{t('admin.table.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((row) => (
              <tr key={row.id}>
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
                <td className="actions-cell">
                  <button
                    onClick={() => onEdit(row)}
                    className="btn-action btn-edit"
                  >
                    {t('admin.table.edit')}
                  </button>
                  <button
                    onClick={() => onDelete(row.id)}
                    className="btn-action btn-delete"
                  >
                    {t('admin.table.delete')}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + 1} className="no-data">
                {t('admin.table.noData')}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
