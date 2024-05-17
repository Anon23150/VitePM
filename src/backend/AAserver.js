import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import bodyParser from 'body-parser';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'test'
});

connection.connect((error) => {
  if (error) {
    console.error('Error connecting to database:', error);
    return;
  }
  console.log('Connected to database!');
});


// select product //////////////////////////////////////////////////////////////////////////
app.get('/products/select', (req, res) => {
  // SQL query เพื่อดึงข้อมูลสินค้าทั้งหมด
  const sql = 'SELECT * FROM Products';
  console.log("product selct")
  // ส่งคำสั่ง SQL ไปยังฐานข้อมูล MySQL
  connection.query(sql, (error, results) => {
    if (error) {
      // หากเกิดข้อผิดพลาดในการดึงข้อมูล
      res.status(500).send('Internal Server Error');
    } else {
      // หากไม่เกิดข้อผิดพลาด ส่งข้อมูลสินค้ากลับไปยังผู้ใช้
      res.json(results);
    }
  });
});






/// insert product//////////////////////////////////////////////////////////////////////////

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../../public/Image/');
  },
  filename: function (req, file, cb) {
    // ใช้ชื่อที่ได้จากฟอร์มเป็นชื่อของไฟล์ และลบนามสกุลไฟล์ออกเพื่อป้องกันการเพิ่มจุดเพิ่มเติม
    const uploadedFileName = req.body.ProductName.replace(/\..+$/, '');
    // นำชื่อภาพมาต่อกับ timestamp เพื่อป้องกันการซ้ำซ้อน
    cb(null, uploadedFileName + '-' + Date.now() + path.extname(file.originalname));
  }
});

// กำหนดตัวกรองสำหรับอนุญาตให้รับไฟล์ภาพเท่านั้น
const imageFilter = function (req, file, cb) {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: imageFilter });

app.post('/products/insert', upload.single('Image'), (req, res) => {

  const { ProductName, Price, Description, Quantity, Category } = req.body;


  const Image = req.file;



  // SQL query เพื่อเพิ่มข้อมูลสินค้าลงในฐานข้อมูล
  const sql = 'INSERT INTO Products (ProductName, Price, Description, Quantity, Category, Image_URL) VALUES (?, ?, ?, ?, ?, ?)';

 
  connection.query(sql, [ProductName, Price, Description, Quantity, Category, Image ? Image.path : null], (error, results) => {
    if (error) {
      console.error('Error adding product:', error);
      res.status(500).send('Internal Server Error');
    } else {
      console.log('Product added successfully');
      res.status(200).send('Product added successfully');
      // res.status(200).json({ message: 'Product added successfully' }); ถ้าอยากตอบเป็น json 
    }
  });
});


//////////////////////////////////////////////////////////////////////////////////////////

// delete product *****************************************************************************

app.delete('/products/delete/:id', (req, res) => {
  const productId = req.params.id;

  // หากลบข้อมูลภาพก่อนลบข้อมูลในฐานข้อมูลสำเร็จ ลบภาพออกจากโฟลเดอร์
  connection.query('SELECT Image_URL FROM Products WHERE ProductID = ?', [productId], (error, results) => {
      if (error) {
          console.error('Error fetching product image:', error);
          res.status(500).send('Internal Server Error');
      } else {
          const imageURL = results[0].Image_URL;
          if (imageURL) {
              fs.unlink(imageURL, (error) => {
                  if (error) {
                      console.error('Error deleting product image:', error);
                      res.status(500).send('Internal Server Error');
                  } else {
                      console.log('Product image deleted successfully');

                      // หากลบภาพสำเร็จ ลบข้อมูลสินค้าออกจากฐานข้อมูล
                      connection.query('DELETE FROM Products WHERE ProductID = ?', [productId], (error, results) => {
                          if (error) {
                              console.error('Error deleting product:', error);
                              res.status(500).send('Internal Server Error');
                          } else {
                              console.log('Product deleted successfully');
                              res.status(200).send('Product deleted successfully');
                          }
                      });
                  }
              });
          } else {
              // หากไม่มีภาพสินค้า
              res.status(200).send('Product deleted successfully');
          }
      }
  });
});


//************************************************************************************************************* */

// edit product 

app.get('/products/:productId', (req, res) => {
  // Extract productId from request parameters
  const productId = req.params.productId;

  // Query to fetch product by ID
  const query = `SELECT * FROM Products WHERE ProductID = ?`;

  // Execute query
  connection.query(query, [productId], (error, results) => {
      if (error) {
          console.error('Error fetching product:', error);
          res.status(500).send('Internal Server Error');
      } else {
          // Check if product exists
          if (results.length > 0) {
              // Product found, send it as response
              res.json(results[0]);
          } else {
              // Product not found, send 404 response
              res.status(404).send('Product not found');
          }
      }
  });
});





// edit product 
app.put('/products/update/:productId', upload.single('Image'), (req, res) => {
  const productId = req.params.productId;
  const { ProductName, Price, Description, Quantity, Category } = req.body;

  // ดึงข้อมูลภาพจาก request file
  const Image = req.file;

  // SQL query เพื่ออัปเดตข้อมูลสินค้า
  const sql = `UPDATE Products 
               SET ProductName = ?, Price = ?, Description = ?, Quantity = ?, Category = ?, Image_URL = ? 
               WHERE ProductID = ?`;

  // ดึงข้อมูลเก่าเพื่อลบภาพเก่า (หากมี)
  connection.query('SELECT Image_URL FROM Products WHERE ProductID = ?', [productId], (error, results) => {
      if (error) {
          console.error('Error fetching product image:', error);
          res.status(500).send('Internal Server Error');
      } else {
          const oldImageURL = results[0].Image_URL;
          // Execute the SQL query with oldImageURL if Image is not provided
          connection.query(sql, [ProductName, Price, Description, Quantity, Category, Image ? Image.path : oldImageURL, productId], (error, results) => {
              if (error) {
                  console.error('Error updating product:', error);
                  res.status(500).send('Internal Server Error');
              } else {
                  console.log('Product updated successfully');
                  res.status(200).send('Product updated successfully');
              }
          });
      }
  });
});



//********************************************************************************************************** */


// เริ่มต้นการทำงานของเซิร์ฟเวอร์
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
