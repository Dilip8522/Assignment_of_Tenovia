from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (update this for production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock database
inventory = []

class Product(BaseModel):
    ProductID: int
    ProductName: str
    StockLevel: int
    ReorderLevel: int

@app.post("/inventory/add")
def add_product(product: Product):
    for item in inventory:
        if item["ProductID"] == product.ProductID:
            raise HTTPException(status_code=400, detail="Product already exists")
    inventory.append(product.dict())
    return {"message": "Product added successfully!"}

# @app.put("/inventory/update/{product_id}")
# def update_stock(product_id: int, stock: int):
#     for item in inventory:
#         if item["ProductID"] == product_id:
#             item["StockLevel"] = stock
#             return {"message": "Stock updated!"}
#     raise HTTPException(status_code=404, detail="Product not found")

@app.put("/inventory/update/{product_id}")
def update_stock(product_id: int, stock: int):
    for item in inventory:
        if item["ProductID"] == product_id:
            item["StockLevel"] = stock
            return {"message": "Stock updated successfully!"}
    raise HTTPException(status_code=404, detail="Product not found")

@app.get("/inventory", response_model=List[Product])
def get_all_products():
    return inventory

@app.get("/analytics/top-risk-products")
def top_risk_products():
    return [item for item in inventory if item["StockLevel"] <= item["ReorderLevel"]]
