import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import CreateListing from "./pages/CreateListing";
import MyListings from "./pages/MyListing";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ListingDetail from "./pages/ListingDetail";
import Bookmarks from "./pages/Bookmark";

const Protected = ({children}: {children: ReactNode}) => {
  const token = localStorage.getItem('token');
  return token? <>{children}</>: <Navigate to = '/login' replace />;
};

const AdminRoute = ({children}: {children: ReactNode}) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.role === 'admin' ? <>{children}</>: <Navigate to = '/' replace />;
};


export default function App() {
  return (
    <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path ='/' element={<Home />}/>
      <Route path ='/login' element={<Login />}/>
      <Route path ='/register' element={<Register />}/>
      <Route path ='/listings/:id' element={<ListingDetail />}/>
      <Route path ='/create' element={<Protected><CreateListing /></Protected> } />
      <Route path ='/my-listings' element={<Protected><MyListings /></Protected> } />
      <Route path ='/bookmarks' element={<Protected><Bookmarks /></Protected> } />
      <Route path ='/admin' element={<Protected><AdminRoute> <Admin /></AdminRoute></Protected> } />

    </Routes>
    </BrowserRouter>
  );
}