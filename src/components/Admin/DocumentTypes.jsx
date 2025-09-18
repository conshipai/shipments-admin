// src/components/Admin/DocumentTypes.jsx
import React, { useState, useEffect } from 'react';
import { FileText, Plus, Edit, Trash, Save, X } from 'lucide-react';
import api from '../../services/api';

const DocumentTypes = ({ isDarkMode }) => {
  const [documentTypes, setDocumentTypes] = useState([
    { id: 'bol', name: 'Bill of Lading', code: 'BOL', required: true },
    { id: 'pod', name: 'Proof of Delivery', code: 'POD', required: true },
    { id: 'invoice', name: 'Invoice', code: 'INV', required: false },
    { id: 'rate_confirmation', name: 'Rate Confirmation', code: 'RC', required: false },
    { id: 'packing_list', name: 'Packing List', code: 'PL', required: false }
  ]);
  
  const [newType, setNewType] = useState({ name: '', code: '', required: false });
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const handleAdd = () => {
    if (!newType.name || !newType.code) {
      alert('Name and code are required');
      return;
    }
    
    const type = {
      id: Date.now().toString(),
      ...newType
    };
    
    setDocumentTypes([...documentTypes, type]);
    setNewType({ name: '', code: '', required: false });
    setShowAddForm(false);
  };
  
  const handleDelete = (id) => {
    if (window.confirm('Delete this document type?')) {
      setDocumentTypes(documentTypes.filter(t => t.id !== id));
    }
  };
  
  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold">Document Type Management</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          <Plus className="w-4 h-4" />
          Add Type
        </button>
      </div>
      
      {showAddForm && (
        <div className={`mb-4 p-4 rounded border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="grid grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Document Name"
              value={newType.name}
              onChange={(e) => setNewType({...newType, name: e.target.value})}
              className={`px-3 py-2 rounded border ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              }`}
            />
            <input
              type="text"
              placeholder="Code (e.g., BOL)"
              value={newType.code}
              onChange={(e) => setNewType({...newType, code: e.target.value.toUpperCase()})}
              className={`px-3 py-2 rounded border ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              }`}
            />
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newType.required}
                  onChange={(e) => setNewType({...newType, required: e.target.checked})}
                />
                <span>Required</span>
              </label>
              <button
                onClick={handleAdd}
                className="ml-auto px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                <Save className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewType({ name: '', code: '', required: false });
                }}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        {documentTypes.map(type => (
          <div 
            key={type.id}
            className={`p-4 rounded border flex items-center justify-between ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-center gap-4">
              <FileText className="w-5 h-5 text-purple-500" />
              <div>
                <span className="font-medium">{type.name}</span>
                <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  ({type.code})
                </span>
                {type.required && (
                  <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                    Required
                  </span>
                )}
              </div>
            </div>
            {!['bol', 'pod'].includes(type.id) && (
              <button
                onClick={() => handleDelete(type.id)}
                className="p-1 text-red-600 hover:bg-red-50 rounded"
              >
                <Trash className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentTypes;
