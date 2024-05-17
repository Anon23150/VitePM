import React, { useState } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';
import '/src/css/AddProduct.css';
import Navigation from './Navigation';

interface Product {
    ProductName: string;
    Price: number;
    Description: string;
    Quantity: number;
    Category: string;
    Image: File | null;
    ImageURL: string | null;
}

function AddProduct() {
    const [newProduct, setNewProduct] = useState<Product>({
        ProductName: '',
        Price: 0,
        Description: '',
        Quantity: 0,
        Category: '',
        Image: null,
        ImageURL: null // เริ่มต้นโดยไม่มี URL ของภาพ
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewProduct(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const imageFile = e.target.files[0];
            const imageURL = URL.createObjectURL(imageFile);
            setNewProduct(prevState => ({
                ...prevState,
                Image: imageFile,
                ImageURL: imageURL
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData();

        //clean data xss sqlinject
        const sanitizedProductName = DOMPurify.sanitize(newProduct.ProductName);
        const sanitizedDescription = DOMPurify.sanitize(newProduct.Description);
        const sanitizedCategory = DOMPurify.sanitize(newProduct.Category);
        formData.append('ProductName', sanitizedProductName);
        formData.append('Price', newProduct.Price.toString());
        formData.append('Description', sanitizedDescription);
        formData.append('Quantity', newProduct.Quantity.toString());
        formData.append('Category', sanitizedCategory);

        // ตรวจสอบว่ามีรูปภาพที่ถูกอัปโหลดแล้วหรือไม่
        if (newProduct.Image) {
            formData.append('Image', newProduct.Image);
        }

        if (!newProduct.ProductName || !newProduct.Price || !newProduct.Description || !newProduct.Quantity || !newProduct.Category || !newProduct.Image) {
            alert('กรุณากรอกข้อมูลสินค้าให้ครบทุกช่อง');
            return; // ยกเลิกการทำงานถ้าข้อมูลไม่ครบ
        }

        axios.post<Product>('http://localhost:3000/products/insert', formData)
            .then(response => {
                console.log(response);
                alert('เพิ่มสินค้าสำเร็จ');
                window.location.reload();
                setNewProduct({
                    ProductName: '',
                    Price: 0,
                    Description: '',
                    Quantity: 0,
                    Category: '',
                    Image: null,
                    ImageURL: null
                });
            })
            .catch(error => console.error('Error adding product:', error));
    };

    return (
        <div className='body'>
            <Navigation />
            <div className="add-product-container">

                <form onSubmit={handleSubmit} className="add-product-form">
                    <h3>เพิ่มสินค้า</h3>
                    <div className="form-group">
                        {newProduct.ImageURL && <img src={newProduct.ImageURL} alt="Product" className="product-image" />}
                        <br></br><br></br>
                        <label htmlFor="Image" className="image-label">เลือกรูปภาพ:</label>
                        <input type="file" id="Image" name="Image" onChange={handleImageChange} className="image-input" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="ProductName">ชื่อสินค้า:</label>
                        <input type="text" id="ProductName" name="ProductName" value={newProduct.ProductName} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="Price">ราคา:</label>
                        <input type="number" id="Price" name="Price" value={newProduct.Price} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="Description">รายละเอียด:</label>
                        <textarea id="Description" name="Description" value={newProduct.Description} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="Quantity">จำนวน:</label>
                        <input type="number" id="Quantity" name="Quantity" value={newProduct.Quantity} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="Category">ประเภท:</label>
                        <input type="text" id="Category" name="Category" value={newProduct.Category} onChange={handleChange} />
                    </div>
                    <div className="button-group">
                        <button type="submit" className="submit-button">เพิ่ม</button>
                    </div>
                </form>
            </div>

        </div>


    );
}

export default AddProduct;
