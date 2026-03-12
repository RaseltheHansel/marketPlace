import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const token    = localStorage.getItem('token');
  const user     = JSON.parse(localStorage.getItem('user') || '{}');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className='bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-50'>
      <div className='max-w-6xl mx-auto flex items-center justify-between'>
        <Link to='/' className='font-bold text-xl text-blue-600'>
          🛍️ Marketplace
        </Link>
        <div className='flex items-center gap-3'>
          {token ? (
            <>
              <Link to='/create'
                className='bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700'>
                + Post Item
              </Link>
              <Link to='/bookmarks' className='text-sm text-gray-600 hover:text-gray-900'>
                ★ Saved
              </Link>
              <Link to='/my-listings' className='text-sm text-gray-600 hover:text-gray-900'>
                My Listings
              </Link>
              {user.role === 'admin' && (
                <Link to='/admin' className='text-sm text-red-600 hover:text-red-800 font-medium'>
                  Admin
                </Link>
              )}
              <button onClick={logout} className='text-sm text-gray-500 hover:text-gray-700'>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to='/login' className='text-sm text-gray-600 hover:text-gray-900'>Login</Link>
              <Link to='/register'
                className='bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700'>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}