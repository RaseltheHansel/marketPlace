import { useState } from 'react';
import type { FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const CATEGORIES = ['Electronics','Clothing','Furniture','Books','Vehicles','Sports','Toys','Food','Other'];
const CONDITIONS  = ['new','like-new','good','fair','poor'];

export default function CreateListing() {
  const [title,       setTitle]       = useState('');
  const [description, setDescription] = useState('');
  const [price,       setPrice]       = useState('');
  const [category,    setCategory]    = useState('Electronics');
  const [condition,   setCondition]   = useState('good');
  const [location,    setLocation]    = useState('');
  const [images,      setImages]      = useState<FileList | null>(null);
  const [previews,    setPreviews]    = useState<string[]>([]);
  const navigate = useNavigate();

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setImages(files);
    if (files) {
      const urls = Array.from(files).map(f => URL.createObjectURL(f));
      setPreviews(urls);
    }
  };

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await api.post('/listings', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: () => navigate('/my-listings'),
    onError:   () => alert('Failed to create listing. Check all fields.'),
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title',       title);
    formData.append('description', description);
    formData.append('price',       price);
    formData.append('category',    category);
    formData.append('condition',   condition);
    formData.append('location',    location);
    if (images) Array.from(images).forEach(img => formData.append('images', img));
    mutation.mutate(formData);
  };

  const inputStyle = {
    width: '100%',
    background: '#251a0e',
    border: '1px solid #3d2d18',
    color: '#f5ede0',
    padding: '12px 14px',
    borderRadius: '10px',
    fontSize: '14px',
    fontFamily: 'Outfit, sans-serif',
    outline: 'none',
  };

  const labelStyle = {
    fontSize: '11px',
    color: '#c9a87a',
    display: 'block',
    marginBottom: '7px',
    letterSpacing: '1px',
    textTransform: 'uppercase' as const,
  };

  const focusOn  = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.target.style.borderColor = '#e85d26');
  const focusOff = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.target.style.borderColor = '#3d2d18');

  return (
    <div style={{ background: '#1c1209', minHeight: '100vh', padding: '32px 24px' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <p style={{ fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: '#e85d26', fontWeight: 500, marginBottom: '8px' }}>
            New listing
          </p>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '30px', color: '#f5ede0' }}>
            Post an item
          </h1>
          <p style={{ fontSize: '13px', color: '#8c7055', marginTop: '4px' }}>
            Fill in the details below — your listing will be reviewed before going live.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ background: '#2e2010', border: '1px solid #3d2d18', borderRadius: '20px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Title */}
            <div>
              <label style={labelStyle}>Title</label>
              <input type='text' placeholder='e.g. iPhone 14 Pro 256GB' value={title}
                onChange={e => setTitle(e.target.value)} required style={inputStyle}
                onFocus={focusOn} onBlur={focusOff} />
            </div>

            {/* Description */}
            <div>
              <label style={labelStyle}>Description</label>
              <textarea placeholder='Describe your item — condition, reason for selling, what is included...'
                value={description} onChange={e => setDescription(e.target.value)}
                required rows={4}
                style={{ ...inputStyle, resize: 'vertical' as const, lineHeight: 1.7 }}
                onFocus={focusOn} onBlur={focusOff} />
              <p style={{ fontSize: '11px', color: '#8c7055', marginTop: '4px' }}>
                {description.length} / 1000 characters
              </p>
            </div>

            {/* Price */}
            <div>
              <label style={labelStyle}>Price (₱)</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#8c7055', fontSize: '14px' }}>₱</span>
                <input type='number' placeholder='0' value={price}
                  onChange={e => setPrice(e.target.value)} required min='1'
                  style={{ ...inputStyle, paddingLeft: '28px' }}
                  onFocus={focusOn} onBlur={focusOff} />
              </div>
            </div>

            {/* Category + Condition */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)}
                  style={inputStyle} onFocus={focusOn} onBlur={focusOff}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Condition</label>
                <select value={condition} onChange={e => setCondition(e.target.value)}
                  style={inputStyle} onFocus={focusOn} onBlur={focusOff}>
                  {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Location */}
            <div>
              <label style={labelStyle}>Location</label>
              <input type='text' placeholder='e.g. Quezon City, Metro Manila' value={location}
                onChange={e => setLocation(e.target.value)} required style={inputStyle}
                onFocus={focusOn} onBlur={focusOff} />
            </div>

            {/* Photos */}
            <div>
              <label style={labelStyle}>Photos (up to 5)</label>
              <div style={{ ...inputStyle, padding: '0', overflow: 'hidden', cursor: 'pointer', position: 'relative' }}>
                <input type='file' accept='image/*' multiple onChange={handleImages}
                  style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%' }} />
                <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '20px' }}>📷</span>
                  <span style={{ fontSize: '13px', color: '#8c7055' }}>
                    {images ? `${images.length} file(s) selected` : 'Click to choose photos'}
                  </span>
                </div>
              </div>

              {/* Previews */}
              {previews.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                  {previews.map((p, i) => (
                    <div key={i} style={{ position: 'relative' }}>
                      <img src={p} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #3d2d18' }} />
                      {i === 0 && (
                        <span style={{ position: 'absolute', bottom: '4px', left: '4px', background: '#e85d26', color: '#fff', fontSize: '9px', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                          MAIN
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: '#3d2d18' }} />

            {/* Submit */}
            <button type='submit' disabled={mutation.isPending}
              style={{
                background: mutation.isPending ? '#7a3010' : '#e85d26',
                color: '#fff', border: 'none', padding: '14px',
                borderRadius: '10px', fontSize: '15px', fontWeight: 600,
                cursor: mutation.isPending ? 'not-allowed' : 'pointer',
                fontFamily: 'Outfit, sans-serif',
                transition: 'background 0.2s', letterSpacing: '0.3px',
              }}>
              {mutation.isPending ? 'Posting...' : '🚀 Post Item'}
            </button>

            <p style={{ fontSize: '12px', color: '#8c7055', textAlign: 'center' }}>
              Your listing will be reviewed by our admin before going live.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}