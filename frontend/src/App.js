import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [inventory, setInventory] = useState([]);
    const [topRiskProducts, setTopRiskProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({
        ProductID: '',
        ProductName: '',
        StockLevel: '',
        ReorderLevel: '',
    });
    const [stockUpdate, setStockUpdate] = useState({
        ProductID: '',
        StockLevel: '',
    });

    const fetchInventory = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/inventory");
            setInventory(response.data);
        } catch (error) {
            console.error("Error fetching inventory:", error);
        }
    };

    const fetchTopRiskProducts = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/analytics/top-risk-products");
            setTopRiskProducts(response.data);
        } catch (error) {
            console.error("Error fetching top-risk products:", error);
        }
    };

    const addProduct = async () => {
        try {
            const response = await axios.post("http://127.0.0.1:8000/inventory/add", newProduct);
            alert(response.data.message);
            fetchInventory();
            fetchTopRiskProducts();
            setNewProduct({ ProductID: '', ProductName: '', StockLevel: '', ReorderLevel: '' });
        } catch (error) {
            console.error(error);
            if (error.response) {
                alert(error.response.data.detail);
            } else {
                alert("An unexpected error occurred.");
            }
        }
    };

    const updateStock = async () => {
      try {
          const response = await axios.put(`http://127.0.0.1:8000/inventory/update/${stockUpdate.ProductID}`, {
              stock: parseInt(stockUpdate.StockLevel),
          });
          alert(response.data.message);
          fetchInventory();
          fetchTopRiskProducts();
          setStockUpdate({ ProductID: '', StockLevel: '' });
      } catch (error) {
          console.error(error);
          if (error.response) {
              alert(error.response.data.detail);
          } else {
              alert("An unexpected error occurred.");
          }
      }
  };
  

    useEffect(() => {
        fetchInventory();
        fetchTopRiskProducts();
    }, []);

    return (
        <div className="App">
            <h1>Inventory Management</h1>

            <h2>Add Product</h2>
            <input
                type="text"
                placeholder="Product ID"
                value={newProduct.ProductID}
                onChange={(e) => setNewProduct({ ...newProduct, ProductID: e.target.value })}
            />
            <input
                type="text"
                placeholder="Product Name"
                value={newProduct.ProductName}
                onChange={(e) => setNewProduct({ ...newProduct, ProductName: e.target.value })}
            />
            <input
                type="number"
                placeholder="Stock Level"
                value={newProduct.StockLevel}
                onChange={(e) => setNewProduct({ ...newProduct, StockLevel: e.target.value })}
            />
            <input
                type="number"
                placeholder="Reorder Level"
                value={newProduct.ReorderLevel}
                onChange={(e) => setNewProduct({ ...newProduct, ReorderLevel: e.target.value })}
            />
            <button onClick={addProduct}>Add Product</button>

            <h2>Update Stock</h2>
            <input
                type="text"
                placeholder="Product ID"
                value={stockUpdate.ProductID}
                onChange={(e) => setStockUpdate({ ...stockUpdate, ProductID: e.target.value })}
            />
            <input
                type="number"
                placeholder="Stock Level"
                value={stockUpdate.StockLevel}
                onChange={(e) => setStockUpdate({ ...stockUpdate, StockLevel: e.target.value })}
            />
            <button onClick={updateStock}>Update Stock</button>

            <h2>Inventory</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>Product ID</th>
                        <th>Product Name</th>
                        <th>Stock Level</th>
                        <th>Reorder Level</th>
                    </tr>
                </thead>
                <tbody>
                    {inventory.map((item) => (
                        <tr key={item.ProductID}>
                            <td>{item.ProductID}</td>
                            <td>{item.ProductName}</td>
                            <td>{item.StockLevel}</td>
                            <td>{item.ReorderLevel}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2>Top Products at Risk of Stock Out</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>Product ID</th>
                        <th>Product Name</th>
                        <th>Stock Level</th>
                        <th>Reorder Level</th>
                    </tr>
                </thead>
                <tbody>
                    {topRiskProducts.map((item) => (
                        <tr key={item.ProductID}>
                            <td>{item.ProductID}</td>
                            <td>{item.ProductName}</td>
                            <td>{item.StockLevel}</td>
                            <td>{item.ReorderLevel}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default App;
