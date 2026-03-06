# Project Guide - Flex Neon Web

**Last Updated:** March 6, 2026
**Version:** 1.0.0

This guide documents the project structure, conventions, and patterns to help you make changes efficiently.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture & Key Concepts](#architecture--key-concepts)
3. [Project Structure](#project-structure)
4. [How to Add New Features](#how-to-add-new-features)
5. [Multilingual System](#multilingual-system)
6. [Admin Panel Guide](#admin-panel-guide)
7. [API Integration](#api-integration)
8. [Authentication Flow](#authentication-flow)
9. [Styling Conventions](#styling-conventions)
10. [Common Patterns](#common-patterns)
11. [Troubleshooting](#troubleshooting)

---

## Project Overview

**Flex Neon Web** is a React 18 single-page application for a neon sign business. It provides:

- **Public Pages**: Home, Portfolio, About, Contact, Custom Sign Order, Rental
- **Admin Panel**: Full content management system for all public pages
- **Multilingual Support**: English, Russian, Armenian (EN/RU/HY)
- **Authentication**: JWT-based auth with Google OAuth integration
- **Custom Sign Designer**: Interactive neon sign builder with drag/resize/rotate

### Tech Stack

- React 18.2.0
- React Router v6.20.0
- Axios 1.13.5
- Google OAuth (`@react-oauth/google`)
- Create React App (react-scripts 5.0.1)

---

## Architecture & Key Concepts

### Core Principles

1. **Component-Based**: Shared components in `/components`, page components in `/pages`
2. **Context API**: Auth state and language state managed via React Context
3. **Service Layer**: API calls abstracted in `/api` services
4. **CSS Modules Pattern**: Each component/page has its own CSS file
5. **Protected Routes**: Admin routes require authentication

### State Management

- **Global State**: AuthContext (user, token), LanguageContext (language, translations)
- **Local State**: Component-level useState for UI interactions
- **Persistence**: Auth token in localStorage, language preference in localStorage

---

## Project Structure

```
neon-sign-business/
├── public/                  # Static assets
├── src/
│   ├── api/                 # API services and Axios configuration
│   │   ├── axios.js         # Axios instance with base URL and auth interceptor
│   │   ├── authService.js   # Authentication API calls
│   │   ├── adminService.js  # Admin panel API calls
│   │   └── contentService.js # Public content API calls
│   │
│   ├── components/          # Shared components
│   │   ├── Header.js        # Main navigation header
│   │   ├── Header.css
│   │   ├── Footer.js        # Footer with links
│   │   ├── Footer.css
│   │   ├── LanguageSwitcher.js  # Language selector dropdown
│   │   ├── LanguageSwitcher.css
│   │   ├── ProtectedRoute.js    # HOC for auth-protected routes
│   │   └── admin/           # Admin-specific components
│   │       ├── AdminLayout.js   # Admin panel wrapper layout
│   │       ├── AdminNav.js      # Admin sidebar navigation
│   │       ├── DataTable.js     # Reusable data table
│   │       ├── FormModal.js     # Modal for create/edit forms
│   │       ├── ImageUpload.js   # Image upload component
│   │       └── *.css            # Component styles
│   │
│   ├── context/             # React Context providers
│   │   └── AuthContext.js   # User authentication state
│   │
│   ├── i18n/                # Internationalization
│   │   ├── LanguageContext.js   # Language state provider
│   │   └── translations.js      # Translation key-value map
│   │
│   ├── pages/               # Route pages (public)
│   │   ├── Home.js
│   │   ├── Portfolio.js
│   │   ├── About.js
│   │   ├── Contact.js
│   │   ├── Order.js         # Custom sign designer
│   │   ├── Rent.js          # Rental packages
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── *.css            # Page-specific styles
│   │   └── admin/           # Admin panel pages
│   │       ├── AdminDashboard.js
│   │       ├── HomeAdmin.js
│   │       ├── PortfolioAdmin.js
│   │       ├── AboutAdmin.js
│   │       ├── ContactAdmin.js
│   │       ├── FeaturesAdmin.js
│   │       ├── TeamAdmin.js
│   │       ├── ShowcaseAdmin.js
│   │       ├── SettingsAdmin.js
│   │       ├── RentAdmin.js
│   │       ├── *.css
│   │       └── AdminPages.css   # Shared admin styles
│   │
│   ├── App.js               # Main app with routing
│   ├── App.css
│   ├── index.js             # React entry point
│   └── index.css            # Global styles
│
├── .env                     # Environment variables (not in repo)
├── package.json
├── README.md
├── CONTRIBUTING.md
└── PROJECT_GUIDE.md         # This file
```

---

## How to Add New Features

### Adding a New Public Page

1. **Create page component**:
   ```bash
   src/pages/NewPage.js
   src/pages/NewPage.css
   ```

2. **Implement the component**:
   ```jsx
   // src/pages/NewPage.js
   import React from 'react';
   import { useLanguage } from '../i18n/LanguageContext';
   import Header from '../components/Header';
   import Footer from '../components/Footer';
   import './NewPage.css';

   function NewPage() {
     const { t } = useLanguage();

     return (
       <div className="new-page">
         <Header />
         <main className="new-page-content">
           <h1>{t('newPage.title')}</h1>
           {/* Your content */}
         </main>
         <Footer />
       </div>
     );
   }

   export default NewPage;
   ```

3. **Add route in App.js**:
   ```jsx
   import NewPage from './pages/NewPage';

   // In the Routes component:
   <Route path="/new-page" element={<NewPage />} />
   ```

4. **Add translations** (see [Multilingual System](#multilingual-system))

5. **Add navigation link** in `Header.js` if needed

### Adding a New Admin Page

1. **Create admin page**:
   ```bash
   src/pages/admin/NewFeatureAdmin.js
   ```

2. **Use AdminLayout wrapper**:
   ```jsx
   import React, { useState, useEffect } from 'react';
   import AdminLayout from '../../components/admin/AdminLayout';
   import DataTable from '../../components/admin/DataTable';
   import FormModal from '../../components/admin/FormModal';
   import './AdminPages.css';

   function NewFeatureAdmin() {
     const [items, setItems] = useState([]);
     const [showModal, setShowModal] = useState(false);
     const [editingItem, setEditingItem] = useState(null);

     // Your CRUD logic here

     return (
       <AdminLayout title="Manage New Feature">
         <button onClick={() => setShowModal(true)}>Add New</button>
         <DataTable
           columns={columns}
           data={items}
           onEdit={handleEdit}
           onDelete={handleDelete}
         />
         {showModal && (
           <FormModal
             title={editingItem ? 'Edit Item' : 'Add Item'}
             fields={formFields}
             initialData={editingItem}
             onSubmit={handleSubmit}
             onClose={() => setShowModal(false)}
           />
         )}
       </AdminLayout>
     );
   }

   export default NewFeatureAdmin;
   ```

3. **Add route** in `App.js` with `ProtectedRoute`:
   ```jsx
   <Route path="/admin/new-feature" element={
     <ProtectedRoute>
       <NewFeatureAdmin />
     </ProtectedRoute>
   } />
   ```

4. **Add navigation link** in `AdminNav.js`:
   ```jsx
   <Link to="/admin/new-feature" className="admin-nav-link">
     <span className="admin-nav-icon">⚙️</span>
     New Feature
   </Link>
   ```

### Adding a New Component

1. **Create component files**:
   ```bash
   src/components/MyComponent.js
   src/components/MyComponent.css
   ```

2. **Follow naming conventions**:
   - PascalCase for component files (`MyComponent.js`)
   - Matching CSS file name (`MyComponent.css`)
   - Use `.js` extension (not `.jsx`)

3. **Export pattern**:
   ```jsx
   import React from 'react';
   import './MyComponent.css';

   function MyComponent({ prop1, prop2 }) {
     return (
       <div className="my-component">
         {/* Component content */}
       </div>
     );
   }

   export default MyComponent;
   ```

---

## Multilingual System

### How It Works

The app uses a custom i18n system with React Context:

- **LanguageContext**: Provides `language` (current lang) and `t()` function
- **translations.js**: Nested object with all translation keys
- **LanguageSwitcher**: Component to switch between EN/RU/HY

### Adding New Translations

**Edit `src/i18n/translations.js`**:

```javascript
export const translations = {
  en: {
    // Existing keys...
    newFeature: {
      title: 'New Feature Title',
      description: 'Description text',
      button: 'Click Me'
    }
  },
  ru: {
    // Russian translations...
    newFeature: {
      title: 'Заголовок новой функции',
      description: 'Текст описания',
      button: 'Нажми меня'
    }
  },
  hy: {
    // Armenian translations...
    newFeature: {
      title: 'Նոր հատկության վերնագիր',
      description: 'Նկարագրության տեքստ',
      button: 'Սեղմիր ինձ'
    }
  }
};
```

### Using Translations in Components

```jsx
import { useLanguage } from '../i18n/LanguageContext';

function MyComponent() {
  const { t, language } = useLanguage();

  return (
    <div>
      <h1>{t('newFeature.title')}</h1>
      <p>{t('newFeature.description')}</p>
      <button>{t('newFeature.button')}</button>
      {/* Current language: {language} */}
    </div>
  );
}
```

### Best Practices

- Always provide translations for all three languages (EN/RU/HY)
- Use nested objects for grouping related keys
- Keep translation keys descriptive: `page.section.element`
- Test with all language settings before committing

---

## Admin Panel Guide

### Admin Panel Structure

The admin panel follows a consistent pattern:

1. **AdminLayout**: Wraps all admin pages with sidebar navigation
2. **DataTable**: Displays data in tabular format with actions
3. **FormModal**: Handles create/edit forms in modal dialogs
4. **ImageUpload**: Reusable image upload component

### Admin Panel Pages

| Page | Route | Purpose |
|------|-------|---------|
| Dashboard | `/admin` | Overview and quick stats |
| Home Admin | `/admin/home` | Manage home page content |
| Portfolio Admin | `/admin/portfolio` | Manage portfolio items |
| About Admin | `/admin/about` | Manage about page content |
| Contact Admin | `/admin/contact` | View contact form submissions |
| Features Admin | `/admin/features` | Manage feature highlights |
| Team Admin | `/admin/team` | Manage team members |
| Showcase Admin | `/admin/showcase` | Manage showcase gallery |
| Rent Admin | `/admin/rent` | Manage rental packages |
| Settings Admin | `/admin/settings` | App-wide settings |

### Creating CRUD Operations

**Standard pattern for admin pages**:

```jsx
function ItemAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Fetch items on mount
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await adminService.getItems();
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
      alert('Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;

    try {
      await adminService.deleteItem(id);
      setItems(items.filter(item => item.id !== id));
      alert('Item deleted successfully');
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item');
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingItem) {
        await adminService.updateItem(editingItem.id, formData);
        alert('Item updated successfully');
      } else {
        await adminService.createItem(formData);
        alert('Item created successfully');
      }
      setShowModal(false);
      fetchItems();
    } catch (error) {
      console.error('Error saving item:', error);
      alert('Failed to save item');
    }
  };

  return (
    <AdminLayout title="Manage Items">
      <button onClick={handleAdd}>Add New Item</button>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <DataTable
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'name', label: 'Name' },
            { key: 'status', label: 'Status' }
          ]}
          data={items}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
      {showModal && (
        <FormModal
          title={editingItem ? 'Edit Item' : 'Add Item'}
          fields={[
            { name: 'name', label: 'Name', type: 'text', required: true },
            { name: 'description', label: 'Description', type: 'textarea' },
            { name: 'status', label: 'Status', type: 'select', options: [
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' }
            ]}
          ]}
          initialData={editingItem}
          onSubmit={handleSubmit}
          onClose={() => setShowModal(false)}
        />
      )}
    </AdminLayout>
  );
}
```

### DataTable Component Usage

```jsx
<DataTable
  columns={[
    { key: 'id', label: 'ID', width: '60px' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'createdAt', label: 'Date', render: (value) => new Date(value).toLocaleDateString() }
  ]}
  data={items}
  onEdit={handleEdit}
  onDelete={handleDelete}
  actions={true}  // Show edit/delete buttons
/>
```

### FormModal Component Usage

```jsx
<FormModal
  title="Add New Item"
  fields={[
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
      placeholder: 'Enter title'
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      rows: 5
    },
    {
      name: 'category',
      label: 'Category',
      type: 'select',
      options: [
        { value: 'design', label: 'Design' },
        { value: 'rental', label: 'Rental' }
      ]
    },
    {
      name: 'featured',
      label: 'Featured',
      type: 'checkbox'
    },
    {
      name: 'image',
      label: 'Image',
      type: 'file',
      accept: 'image/*'
    }
  ]}
  initialData={editingItem}
  onSubmit={handleSubmit}
  onClose={() => setShowModal(false)}
/>
```

---

## API Integration

### API Configuration

**Base URL** set in `.env`:
```env
REACT_APP_API_URL=http://localhost:8080
```

**Axios instance** (`src/api/axios.js`):
- Automatically adds JWT token to requests
- Base URL from environment variable
- Content-Type: application/json

### Service Layer Pattern

All API calls go through service files in `src/api/`:

**authService.js** - Authentication
```javascript
import apiClient from './axios';

export const authService = {
  register: (data) => apiClient.post('/api/auth/register', data),
  login: (data) => apiClient.post('/api/auth/login', data),
  googleAuth: (token) => apiClient.post('/api/auth/google', { token }),
  getCurrentUser: () => apiClient.get('/api/auth/me')
};
```

**adminService.js** - Admin operations
```javascript
export const adminService = {
  // Portfolio
  getPortfolioItems: () => apiClient.get('/api/admin/portfolio'),
  createPortfolioItem: (data) => apiClient.post('/api/admin/portfolio', data),
  updatePortfolioItem: (id, data) => apiClient.put(`/api/admin/portfolio/${id}`, data),
  deletePortfolioItem: (id) => apiClient.delete(`/api/admin/portfolio/${id}`),

  // Add similar patterns for other resources
};
```

**contentService.js** - Public content
```javascript
export const contentService = {
  getHomeContent: () => apiClient.get('/api/content/home'),
  getPortfolio: () => apiClient.get('/api/content/portfolio'),
  getAbout: () => apiClient.get('/api/content/about'),
  submitContact: (data) => apiClient.post('/api/contact', data)
};
```

### Expected API Response Format

**Authentication Response**:
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 123,
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "admin"
  }
}
```

**Standard Success Response**:
```json
{
  "success": true,
  "data": { /* resource data */ },
  "message": "Operation successful"
}
```

**Standard Error Response**:
```json
{
  "success": false,
  "error": "Error message",
  "details": {}
}
```

### Adding New API Endpoints

1. **Add method to appropriate service**:
   ```javascript
   // In adminService.js
   export const adminService = {
     // ... existing methods

     getNewFeature: () => apiClient.get('/api/admin/new-feature'),
     createNewFeature: (data) => apiClient.post('/api/admin/new-feature', data),
     updateNewFeature: (id, data) => apiClient.put(`/api/admin/new-feature/${id}`, data),
     deleteNewFeature: (id) => apiClient.delete(`/api/admin/new-feature/${id}`)
   };
   ```

2. **Use in component**:
   ```javascript
   import { adminService } from '../../api/adminService';

   async function fetchData() {
     try {
       const response = await adminService.getNewFeature();
       setData(response.data);
     } catch (error) {
       console.error('API Error:', error);
       alert('Failed to fetch data');
     }
   }
   ```

---

## Authentication Flow

### How It Works

1. **Context Provider**: `AuthContext` wraps the entire app in `App.js`
2. **Token Storage**: JWT stored in `localStorage` as `token`
3. **Auto-Attach**: Axios interceptor adds token to all requests
4. **Protected Routes**: `ProtectedRoute` component checks auth status

### Login Flow

```
User submits credentials
  ↓
authService.login() called
  ↓
API returns { token, user }
  ↓
AuthContext.login() stores token & user
  ↓
Token saved to localStorage
  ↓
User redirected to /admin
```

### Using Authentication in Components

```jsx
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <p>Please log in</p>;
  }

  return (
    <div>
      <p>Welcome, {user.name}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Protected Routes Pattern

```jsx
import ProtectedRoute from './components/ProtectedRoute';

// In App.js:
<Route path="/admin/*" element={
  <ProtectedRoute>
    <AdminDashboard />
  </ProtectedRoute>
} />
```

### Logout Flow

```javascript
const { logout } = useAuth();

const handleLogout = () => {
  logout();  // Clears token and user from state and localStorage
  navigate('/login');
};
```

---

## Styling Conventions

### CSS Organization

1. **Global Styles**: `src/index.css` - CSS reset, typography, utility classes
2. **App Styles**: `src/App.css` - App-level layout
3. **Component Styles**: Each component has its own CSS file
4. **Page Styles**: Each page has its own CSS file

### Naming Conventions

- **BEM-inspired**: `.component-name`, `.component-name__element`, `.component-name--modifier`
- **Prefix page classes**: `.home-page`, `.about-page`, `.contact-page`
- **Prefix component classes**: `.header`, `.footer`, `.data-table`
- **Admin prefix**: `.admin-layout`, `.admin-nav`, `.admin-form`

### Example Structure

```css
/* Component: Header.css */
.header {
  /* Container styles */
}

.header__logo {
  /* Element styles */
}

.header__nav {
  /* Element styles */
}

.header__nav-link {
  /* Sub-element styles */
}

.header__nav-link--active {
  /* Modifier styles */
}
```

### Responsive Design

Use mobile-first approach with breakpoints:

```css
/* Mobile (default) */
.container {
  padding: 1rem;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    padding: 2rem;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    padding: 3rem;
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

### Color Variables

Define consistent colors in `:root`:

```css
:root {
  --primary-color: #6366f1;
  --secondary-color: #8b5cf6;
  --accent-color: #ec4899;
  --text-color: #1f2937;
  --bg-color: #ffffff;
  --border-color: #e5e7eb;
}
```

---

## Common Patterns

### Fetching Data on Mount

```jsx
function MyComponent() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await apiService.getData();
      setData(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {/* Render data */}
    </div>
  );
}
```

### Form Handling

```jsx
function MyForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await apiService.submitForm(formData);
      alert('Form submitted successfully!');
      setFormData({ name: '', email: '', message: '' }); // Reset
    } catch (error) {
      alert('Failed to submit form');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <textarea
        name="message"
        value={formData.message}
        onChange={handleChange}
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Modal Pattern

```jsx
function MyComponent() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Open Modal
      </button>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowModal(false)}>×</button>
            {/* Modal content */}
          </div>
        </div>
      )}
    </>
  );
}
```

### Image Upload Pattern

```jsx
function ImageUploadExample() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('image', image);

    try {
      await apiService.uploadImage(formData);
      alert('Image uploaded successfully!');
    } catch (error) {
      alert('Failed to upload image');
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {preview && <img src={preview} alt="Preview" />}
      {image && <button onClick={handleUpload}>Upload</button>}
    </div>
  );
}
```

---

## Troubleshooting

### Common Issues

#### 1. "Token not found" error

**Symptom**: API returns 401 Unauthorized

**Solution**:
- Check if user is logged in: `localStorage.getItem('token')`
- Verify token is being attached in Axios interceptor
- Check token expiration on backend
- Try logging out and back in

#### 2. CORS errors

**Symptom**: "Access-Control-Allow-Origin" error in console

**Solution**:
- Verify `REACT_APP_API_URL` in `.env` matches backend URL
- Check backend CORS configuration
- In development, ensure backend allows `http://localhost:3000`

#### 3. Translations not showing

**Symptom**: Translation keys appear instead of text

**Solution**:
- Verify translation key exists in `translations.js` for all languages
- Check spelling of translation key: `t('section.key')`
- Ensure `LanguageProvider` wraps the component in `App.js`

#### 4. Routes not working after deployment

**Symptom**: 404 on page refresh or direct URL access

**Solution**:
- Add redirect rules for SPA routing (depends on hosting platform)
- For Netlify: create `public/_redirects`:
  ```
  /*    /index.html   200
  ```
- For Apache: configure `.htaccess`

#### 5. Image uploads failing

**Symptom**: Image upload returns error

**Solution**:
- Check file size limits (backend and frontend)
- Verify `Content-Type: multipart/form-data` header
- Ensure backend accepts the field name (e.g., `image`)
- Check file type restrictions

#### 6. Admin routes redirect to login

**Symptom**: Can't access admin pages even when logged in

**Solution**:
- Check if `token` exists in localStorage
- Verify token format and validity
- Check `AuthContext` state: `console.log(user, isAuthenticated)`
- Clear localStorage and log in again

### Debug Mode

Enable debug logs by adding this to components:

```javascript
useEffect(() => {
  console.log('Component State:', { data, loading, error });
}, [data, loading, error]);
```

### Network Debugging

Check API calls in browser DevTools:
1. Open DevTools (F12)
2. Go to Network tab
3. Filter by "XHR" or "Fetch"
4. Click on request to see:
   - Request URL
   - Request headers (check Authorization token)
   - Request payload
   - Response status and data

---

## Quick Reference

### Environment Variables

```env
REACT_APP_API_URL=http://localhost:8080
REACT_APP_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

### Important File Locations

- **Routes**: `src/App.js`
- **Auth Logic**: `src/context/AuthContext.js`
- **Translations**: `src/i18n/translations.js`
- **API Services**: `src/api/`
- **Admin Components**: `src/components/admin/`
- **Admin Pages**: `src/pages/admin/`

### Key npm Scripts

```bash
npm start          # Start development server (http://localhost:3000)
npm run build      # Create production build
npm test           # Run tests
npm run eject      # Eject from CRA (irreversible)
```

### Useful VS Code Extensions

- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
- Auto Rename Tag
- CSS Peek

---

## Additional Resources

- **React Docs**: https://react.dev
- **React Router Docs**: https://reactrouter.com
- **Axios Docs**: https://axios-http.com
- **Google OAuth**: https://developers.google.com/identity/protocols/oauth2

---

## Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2026-03-06 | 1.0.0 | Initial project guide created |

---

**For questions or suggestions about this guide, please update this file and commit your changes.**