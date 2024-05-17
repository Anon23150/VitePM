import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';
import '/src/css/EditProduct.css';
import { useParams } from 'react-router-dom';
import Navigation from './Navigation';


function EditProduct() {
    // const params = useParams();
    // const productpr = params.ProductID ;

    const { productId } = useParams();

    console.log(productId)

    // const productId  = 3 ;



    const [editedProduct, setEditedProduct] = useState({
        ProductName: '',
        Price: 0,
        Description: '',
        Quantity: 0,
        Category: '',
        image_url: '',
        Image: null as File | null // เพิ่มฟิลด์ Image และกำหนดให้มีชนิดเป็น File หรือ null
    });

    useEffect(() => {
        axios.get(`http://localhost:3000/products/${productId}`)
            .then(response => {
                const productData = response.data;
                setEditedProduct(prevState => ({
                    ...prevState,
                    ProductName: productData.ProductName,
                    Price: productData.Price,
                    Description: productData.Description,
                    Quantity: productData.Quantity,
                    Category: productData.Category,
                    image_url: productData.image_url || ''
                }));
            })
            .catch(error => console.error('Error fetching product:', error));
    }, [productId]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditedProduct(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const imageFile = e.target.files[0];
            const imageURL = URL.createObjectURL(imageFile); // สร้าง URL Object จากไฟล์ภาพ
            setEditedProduct(prevState => ({
                ...prevState,
                Image: imageFile, // อัปเดตฟิลด์ Image ใน editedProduct
                image_url: imageURL // อัปเดต URL ของภาพที่แสดงใน UI
            }));
        }
    };


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData();

        // ทำความสะอาดข้อมูลเพื่อป้องกัน XSS
        const sanitizedProductName = DOMPurify.sanitize(editedProduct.ProductName);
        const sanitizedDescription = DOMPurify.sanitize(editedProduct.Description);
        const sanitizedCategory = DOMPurify.sanitize(editedProduct.Category);
        formData.append('ProductName', sanitizedProductName);
        formData.append('Price', editedProduct.Price.toString());
        formData.append('Description', sanitizedDescription);
        formData.append('Quantity', editedProduct.Quantity.toString());
        formData.append('Category', sanitizedCategory);

        // เพิ่มภาพใหม่ลงใน FormData หากมีการเลือกไฟล์ภาพ
        if (editedProduct.Image) {
            formData.append('Image', editedProduct.Image);
        }

        axios.put(`http://localhost:3000/products/update/${productId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                console.log(response);
                alert('แก้ไขสินค้าสำเร็จ');
                window.location.reload();
            })
            .catch(error => console.error('Error updating product:', error));
    };


    return (
        <div className="body">
            <Navigation/>
            <div className="add-product-container">
                <form onSubmit={handleSubmit} className="add-product-form">
                    <h3>แก้ไขสินค้า</h3>
                    {editedProduct.image_url && <img src={editedProduct.image_url} alt={editedProduct.ProductName} className="product-image" />}
                    <div className="form-group">
                        <label htmlFor="Image" className="image-label">ภาพ:</label>
                        <input type="file" id="Image" name="Image" accept="image/*" onChange={handleImageChange} className="image-input" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="ProductName">ชื่อสินค้า:</label>
                        <input type="text" id="ProductName" name="ProductName" value={editedProduct.ProductName} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="Price">ราคา:</label>
                        <input type="number" id="Price" name="Price" value={editedProduct.Price} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="Description">รายละเอียด:</label>
                        <textarea id="Description" name="Description" value={editedProduct.Description} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="Quantity">จำนวน:</label>
                        <input type="number" id="Quantity" name="Quantity" value={editedProduct.Quantity} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="Category">ประเภท:</label>
                        <input type="text" id="Category" name="Category" value={editedProduct.Category} onChange={handleChange} />
                    </div>
                    <div className="button-group">
                        <button type="submit" className="submit-button">บันทึก</button>
                    </div>

                </form>
            </div>



        </div>

    );
}

export default EditProduct;
