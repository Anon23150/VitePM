import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '/src/css/AllProduct.css'
// import EditProduct from './EditProduct'; // นำเข้า component EditProduct มาใช้งาน
import Navigation from './Navigation';
import { Link } from 'react-router-dom';

interface Product {
    ProductID: number;
    ProductName: string;
    Price: number;
    Description: string;
    Quantity: number;
    Category: string;
    image_url: string;
}

const AllProduct: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null); // เพิ่ม state เพื่อเก็บ ID ของสินค้าที่ถูกเลือกไว้สำหรับการแก้ไข

    useEffect(() => {
        axios.get<Product[]>('http://localhost:3000/products/select')
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
            });
    }, []);

    const handleEdit = (id: number) => {
        if (selectedProductId === id) {
            setSelectedProductId(null); // ถ้า ID ของสินค้าที่ถูกเลือกเป็น ID เดียวกันกับที่เลือกไว้ก่อนหน้านี้ ให้เซ็ตเป็น null เพื่อปิด EditProduct
        } else {
            setSelectedProductId(id); // เมื่อคลิกที่ปุ่ม "แก้ไข" กำหนดค่า ID ของสินค้าที่ถูกเลือกไว้ใน state
        }
    };

    const handleDelete = (productId: number) => {
        const confirmed = window.confirm('ต้องการลบสินค้าใช่หรือไม่?');
        if (confirmed) {
            axios.delete(`http://localhost:3000/products/delete/${productId}`)
                .then(response => {
                    console.log(response.data);
                    alert('ลบสินค้าสำเร็จ');
                    window.location.reload();
                })
                .catch(error => {
                    console.error('Error deleting product:', error);
                });
        }
    };

    return (
        <div className="body">
            <Navigation />
            <h3 >สินค้าทั้งหมด</h3>

            <div className="product-container">

                {products.map(product => (
                    <div key={product.ProductID} className="card">
                        <img src={product.image_url} alt={product.ProductName} />
                        <div className="card-details">
                            <h2>{product.ProductName}</h2>
                            <p>{product.Description}</p>
                            <p>ราคา: ฿{product.Price}</p>
                            <p>จำนวน: {product.Quantity}</p>
                            <p>ประเภท: {product.Category}</p>
                            <div className="action">
                                <button className="delete" onClick={() => handleDelete(product.ProductID)} data-product-id={product.ProductID}>Delete</button>
                                <button className="edit" onClick={() => handleEdit(product.ProductID)} data-product-id={product.ProductID}>
                                    <Link to={`/editproduct/${product.ProductID}`} >Edit</Link>
                                    {/* <Link to= "/editproduct">Edit</Link> */}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {/* {selectedProductId !== null && <EditProduct/>}  */}
        </div>
    );
}

export default AllProduct;
