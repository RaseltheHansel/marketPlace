const CATEGORIES = ['Electronics','Clothing','Furniture','Books','Vehicles','Sports','Toys','Food','Other'];
const CONDITIONS  = ['new','like-new','good','fair','poor'];

interface SearchBarProps {
  search:      string;
  category:    string;
  condition:   string;
  onSearch:    (v: string) => void;
  onCategory:  (v: string) => void;
  onCondition: (v: string) => void;
  onClear:     () => void;
}

const inputStyle = {
  background: '#2e2010',
  border: '1px solid #3d2d18',
  color: '#f5ede0',
  padding: '10px 14px',
  borderRadius: '10px',
  fontSize: '14px',
  fontFamily: 'Outfit, sans-serif',
  outline: 'none',
};

export default function SearchBar({
  search, category, condition,
  onSearch, onCategory, onCondition, onClear
}: SearchBarProps) {
  return (
    <div className='flex gap-3 flex-wrap'>
      <input
        type='text'
        placeholder='What are you looking for?'
        value={search}
        onChange={e => onSearch(e.target.value)}
        style={{ ...inputStyle, flex: 1, minWidth: '200px' }}
      />
      <select value={category} onChange={e => onCategory(e.target.value)} style={inputStyle}>
        <option value=''>All Categories</option>
        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <select value={condition} onChange={e => onCondition(e.target.value)} style={inputStyle}>
        <option value=''>Any Condition</option>
        {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <button onClick={onClear}
        style={{ ...inputStyle, color: '#e85d26', cursor: 'pointer', border: '1px solid #3d2d18' }}>
        Clear
      </button>
    </div>
  );
}