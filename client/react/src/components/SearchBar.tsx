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

export default function SearchBar({
  search, category, condition,
  onSearch, onCategory, onCondition, onClear
}: SearchBarProps) {
  const inp = 'border border-gray-300 p-2 rounded-lg text-sm outline-none focus:border-blue-500 bg-white';
  return (
    <div className='flex gap-3 flex-wrap mb-6'>
      <input
        type='text'
        placeholder='Search items...'
        value={search}
        onChange={e => onSearch(e.target.value)}
        className={inp + ' flex-1 min-w-48'}
      />
      <select value={category} onChange={e => onCategory(e.target.value)} className={inp}>
        <option value=''>All Categories</option>
        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <select value={condition} onChange={e => onCondition(e.target.value)} className={inp}>
        <option value=''>Any Condition</option>
        {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <button onClick={onClear}
        className='text-sm text-blue-600 hover:text-blue-800 font-medium px-3'>
        Clear
      </button>
    </div>
  );
}