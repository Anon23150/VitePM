import React from 'react'
import ReactDOM from 'react-dom/client'
// import App from './App.tsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,

} from "react-router-dom";
import AllProduct from './component/AllProduct.tsx';
import AddProduct from './component/AddProduct.tsx';
import EditProduct from './component/EditProduct.tsx';
import App from './App.tsx';





const router = createBrowserRouter([
  {
    path: "/",
    element: <AllProduct/>
  },
  {
    path: "/addproduct",
    element: <AddProduct/>
  },
  {
    path: "/editproduct/:productId",
    // path: "/editproduct",
    element: <EditProduct/>
  }

]);



ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
     <RouterProvider router={router} />
     {/* <App/> */}
  </React.StrictMode>,
)



