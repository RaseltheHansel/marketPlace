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

    const inp = 'w-full border border-gray-300 p-3 rounded-lg outline-none focus:border-blue-500 text-sm';

    return (
      <div className='max-w-2xl mx-auto px-4 py-8'>
        <h1 className='text-2xl font-bold text-gray-900 mb-6'>Post an Item</h1>
        <form onSubmit={handleSubmit}
          className='bg-white border border-gray-200 rounded-2xl p-6 space-y-4'>
          <input type='text' placeholder='Title (e.g. iPhone 14 Pro)' value={title}
            onChange={e => setTitle(e.target.value)} required className={inp} />
          <textarea placeholder='Description — condition, reason for selling, etc.'
            value={description} onChange={e => setDescription(e.target.value)}
            required rows={4} className={inp} />
          <input type='number' placeholder='Price (₱)' value={price}
            onChange={e => setPrice(e.target.value)} required min='1' className={inp} />
          <div className='grid grid-cols-2 gap-4'>
            <select value={category} onChange={e => setCategory(e.target.value)} className={inp}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={condition} onChange={e => setCondition(e.target.value)} className={inp}>
              {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <input type='text' placeholder='Location (e.g. Quezon City)' value={location}
            onChange={e => setLocation(e.target.value)} required className={inp} />
          <div>
            <label className='text-sm text-gray-600 mb-2 block font-medium'>
              Photos (up to 5)
            </label>
            <input type='file' accept='image/*' multiple onChange={handleImages}
              className={inp} />
            {previews.length > 0 && (
              <div className='flex gap-2 mt-3 flex-wrap'>
                {previews.map((p, i) => (
                  <img key={i} src={p} className='w-20 h-20 object-cover rounded-lg border' />
                ))}
              </div>
            )}
          </div>
          <button type='submit' disabled={mutation.isPending}
            className='w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50
              text-white py-3 rounded-lg font-bold text-sm'>
            {mutation.isPending ? 'Posting...' : 'Post Item'}
          </button>
        </form>
      </div>
    );
  }