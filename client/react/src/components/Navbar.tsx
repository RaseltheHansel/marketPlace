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
    <nav style={{ background: '#251a0e', borderBottom: '1px solid #3d2d18' }}
      className='px-6 py-3 sticky top-0 z-50'>
      <div className='max-w-6xl mx-auto flex items-center justify-between'>

        {/* Logo */}
        <Link to='/' className='text-xl' style={{ fontFamily: 'Fraunces, serif' }}>
          <span style={{ color: '#f5ede0' }}>Market</span>
          <em style={{ color: '#e85d26', fontStyle: 'italic' }}>Place</em>
        </Link>

        {/* Links */}
        <div className='flex items-center gap-5'>
          {token ? (
            <>
              <Link to='/create'
                style={{ background: '#e85d26', color: '#fff', fontFamily: 'Outfit, sans-serif' }}
                className='px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity'>
                + Post Item
              </Link>
              <Link to='/bookmarks'
                style={{ color: '#8c7055' }}
                className='text-sm hover:text-[#f5ede0] transition-colors'>
                ★ Saved
              </Link>
              <Link to='/my-listings'
                style={{ color: '#8c7055' }}
                className='text-sm hover:text-[#f5ede0] transition-colors'>
                My Listings
              </Link>
              {user.role === 'admin' && (
                <Link to='/admin'
                  style={{ color: '#d4a843' }}
                  className='text-sm font-medium hover:opacity-80 transition-opacity'>
                  Admin
                </Link>
              )}
              <button onClick={logout}
                style={{ color: '#8c7055' }}
                className='text-sm hover:text-[#f5ede0] transition-colors'>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to='/login'
                style={{ color: '#8c7055' }}
                className='text-sm hover:text-[#f5ede0] transition-colors'>
                Login
              </Link>
              <Link to='/register'
                style={{ background: '#e85d26', color: '#fff' }}
                className='px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity'>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}