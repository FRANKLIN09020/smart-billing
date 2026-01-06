import { useState } from "react";
import { Plus, Minus, Trash2, Search, X, Edit2, Save, ShoppingCart, Receipt, AlertCircle } from "lucide-react";

interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
    category: string;
}

interface BillItem {
    id: number;
    productId: number;
    name: string;
    price: number;
    quantity: number;
}

interface Bill {
    id: number;
    billNumber: string;
    items: BillItem[];
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    date: string;
    customerName: string;
    customerPhone: string;
    paymentMethod: string;
}

const BillingPage = () => {
    // Products database (simulated)
    const [products, setProducts] = useState<Product[]>([
        { id: 1, name: "Product A", price: 100, stock: 50, category: "Electronics" },
        { id: 2, name: "Product B", price: 50, stock: 100, category: "Accessories" },
        { id: 3, name: "Product C", price: 200, stock: 30, category: "Electronics" },
        { id: 4, name: "Product D", price: 75, stock: 80, category: "Accessories" },
        { id: 5, name: "Product E", price: 150, stock: 20, category: "Electronics" },
    ]);

    // Current bill items
    const [items, setItems] = useState<BillItem[]>([]);

    // Bills history
    const [bills, setBills] = useState<Bill[]>([]);

    // UI States
    const [searchTerm, setSearchTerm] = useState("");
    const [showProductModal, setShowProductModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("Cash");
    const [discount, setDiscount] = useState(0);
    const [showBillHistory, setShowBillHistory] = useState(false);
    const [editingItem, setEditingItem] = useState<number | null>(null);
    const [editPrice, setEditPrice] = useState(0);
    const [notification, setNotification] = useState("");

    const categories = ["All", "Electronics", "Accessories"];
    const TAX_RATE = 0.18; // 18% GST

    // Show notification
    const showNotification = (message: string) => {
        setNotification(message);
        setTimeout(() => setNotification(""), 3000);
    };

    // Add product to bill
    const addProductToBill = (product: Product) => {
        if (product.stock <= 0) {
            showNotification("Product out of stock!");
            return;
        }

        const existingItem = items.find(item => item.productId === product.id);

        if (existingItem) {
            if (existingItem.quantity >= product.stock) {
                showNotification("Cannot add more than available stock!");
                return;
            }
            updateQty(existingItem.id, existingItem.quantity + 1);
        } else {
            const newItem: BillItem = {
                id: Date.now(),
                productId: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
            };
            setItems([...items, newItem]);
            showNotification(`${product.name} added to bill`);
        }
        setShowProductModal(false);
    };

    // Update quantity
    const updateQty = (id: number, qty: number) => {
        const item = items.find(i => i.id === id);
        if (!item) return;

        const product = products.find(p => p.productId === item.productId);
        const maxStock = product?.stock || 999;

        if (qty > maxStock) {
            showNotification("Cannot exceed available stock!");
            return;
        }

        if (qty < 1) {
            removeItem(id);
            return;
        }

        setItems(prev =>
            prev.map(item =>
                item.id === id ? { ...item, quantity: qty } : item
            )
        );
    };

    // Update price
    const updatePrice = (id: number, newPrice: number) => {
        if (newPrice < 0) return;
        setItems(prev =>
            prev.map(item =>
                item.id === id ? { ...item, price: newPrice } : item
            )
        );
        setEditingItem(null);
        showNotification("Price updated");
    };

    // Remove item
    const removeItem = (id: number) => {
        setItems(prev => prev.filter(item => item.id !== id));
        showNotification("Item removed from bill");
    };

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const taxAmount = subtotal * TAX_RATE;
    const discountAmount = (subtotal * discount) / 100;
    const totalAmount = subtotal + taxAmount - discountAmount;

    // Generate bill
    const generateBill = () => {
        if (items.length === 0) {
            showNotification("Please add items to the bill!");
            return;
        }

        if (!customerName.trim()) {
            showNotification("Please enter customer name!");
            return;
        }

        // Update stock
        items.forEach(item => {
            setProducts(prev =>
                prev.map(p =>
                    p.id === item.productId
                        ? { ...p, stock: p.stock - item.quantity }
                        : p
                )
            );
        });

        const newBill: Bill = {
            id: Date.now(),
            billNumber: `BILL-${Date.now().toString().slice(-6)}`,
            items: [...items],
            subtotal,
            tax: taxAmount,
            discount: discountAmount,
            total: totalAmount,
            date: new Date().toISOString(),
            customerName,
            customerPhone,
            paymentMethod,
        };

        setBills([newBill, ...bills]);

        // Reset form
        setItems([]);
        setCustomerName("");
        setCustomerPhone("");
        setDiscount(0);
        setPaymentMethod("Cash");

        showNotification(`Bill ${newBill.billNumber} generated successfully!`);
    };

    // Clear bill
    const clearBill = () => {
        if (window.confirm("Clear current bill?")) {
            setItems([]);
            setDiscount(0);
            showNotification("Bill cleared");
        }
    };

    // Filter products
    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Notification */}
            {notification && (
                <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
                    {notification}
                </div>
            )}

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Billing System</h1>
                            <p className="text-gray-600 mt-1">Create and manage customer bills</p>
                        </div>
                        <button
                            onClick={() => setShowBillHistory(!showBillHistory)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            <Receipt size={20} />
                            Bill History ({bills.length})
                        </button>
                    </div>
                </div>

                {showBillHistory ? (
                    // Bill History View
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-semibold">Bill History</h2>
                            <button
                                onClick={() => setShowBillHistory(false)}
                                className="text-gray-600 hover:text-gray-800"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {bills.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <Receipt size={48} className="mx-auto mb-4 opacity-50" />
                                <p>No bills generated yet</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {bills.map(bill => (
                                    <div key={bill.id} className="border rounded-lg p-4 hover:bg-gray-50">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h3 className="font-semibold text-lg">{bill.billNumber}</h3>
                                                <p className="text-sm text-gray-600">{bill.customerName}</p>
                                                <p className="text-sm text-gray-500">{bill.customerPhone}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-green-600">₹{bill.total.toFixed(2)}</p>
                                                <p className="text-sm text-gray-500">{new Date(bill.date).toLocaleString()}</p>
                                                <p className="text-sm text-gray-600">{bill.paymentMethod}</p>
                                            </div>
                                        </div>
                                        <div className="border-t pt-3">
                                            <p className="text-sm font-semibold mb-2">Items ({bill.items.length}):</p>
                                            <div className="space-y-1">
                                                {bill.items.map(item => (
                                                    <div key={item.id} className="text-sm text-gray-700 flex justify-between">
                                                        <span>{item.name} x {item.quantity}</span>
                                                        <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    // Billing View
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left: Billing Items */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Customer Details */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-xl font-semibold mb-4">Customer Details</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Customer Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={customerName}
                                            onChange={(e) => setCustomerName(e.target.value)}
                                            placeholder="Enter customer name"
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            value={customerPhone}
                                            onChange={(e) => setCustomerPhone(e.target.value)}
                                            placeholder="Enter phone number"
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Bill Items */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold">Bill Items</h2>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setShowProductModal(true)}
                                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                        >
                                            <Plus size={20} />
                                            Add Product
                                        </button>
                                        {items.length > 0 && (
                                            <button
                                                onClick={clearBill}
                                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                            >
                                                Clear All
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {items.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500">
                                        <ShoppingCart size={48} className="mx-auto mb-4 opacity-50" />
                                        <p>No items added yet</p>
                                        <p className="text-sm mt-2">Click "Add Product" to start billing</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50">
                                            <tr className="text-left text-gray-600">
                                                <th className="py-3 px-4">Product</th>
                                                <th className="py-3 px-4">Price</th>
                                                <th className="py-3 px-4">Quantity</th>
                                                <th className="py-3 px-4">Total</th>
                                                <th className="py-3 px-4"></th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {items.map((item) => (
                                                <tr key={item.id} className="border-b hover:bg-gray-50">
                                                    <td className="py-4 px-4 font-medium">{item.name}</td>
                                                    <td className="py-4 px-4">
                                                        {editingItem === item.id ? (
                                                            <div className="flex items-center gap-2">
                                                                <input
                                                                    type="number"
                                                                    value={editPrice}
                                                                    onChange={(e) => setEditPrice(parseFloat(e.target.value) || 0)}
                                                                    className="w-20 px-2 py-1 border rounded"
                                                                    autoFocus
                                                                />
                                                                <button
                                                                    onClick={() => updatePrice(item.id, editPrice)}
                                                                    className="text-green-600 hover:text-green-700"
                                                                >
                                                                    <Save size={16} />
                                                                </button>
                                                                <button
                                                                    onClick={() => setEditingItem(null)}
                                                                    className="text-gray-600 hover:text-gray-700"
                                                                >
                                                                    <X size={16} />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-2">
                                                                <span>₹{item.price.toFixed(2)}</span>
                                                                <button
                                                                    onClick={() => {
                                                                        setEditingItem(item.id);
                                                                        setEditPrice(item.price);
                                                                    }}
                                                                    className="text-blue-600 hover:text-blue-700"
                                                                >
                                                                    <Edit2 size={14} />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => updateQty(item.id, item.quantity - 1)}
                                                                className="p-1 rounded hover:bg-gray-200 transition"
                                                            >
                                                                <Minus size={16} />
                                                            </button>
                                                            <input
                                                                type="number"
                                                                value={item.quantity}
                                                                onChange={(e) => updateQty(item.id, parseInt(e.target.value) || 1)}
                                                                className="w-16 text-center border rounded px-2 py-1"
                                                            />
                                                            <button
                                                                onClick={() => updateQty(item.id, item.quantity + 1)}
                                                                className="p-1 rounded hover:bg-gray-200 transition"
                                                            >
                                                                <Plus size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4 font-semibold">
                                                        ₹{(item.price * item.quantity).toFixed(2)}
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <button
                                                            onClick={() => removeItem(item.id)}
                                                            className="text-red-500 hover:text-red-700 transition"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right: Bill Summary */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
                                <h3 className="text-xl font-semibold mb-6">Bill Summary</h3>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-gray-700">
                                        <span>Items</span>
                                        <span className="font-medium">{items.length}</span>
                                    </div>

                                    <div className="flex justify-between text-gray-700">
                                        <span>Subtotal</span>
                                        <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                                    </div>

                                    <div className="flex justify-between text-gray-700">
                                        <span>Tax (18% GST)</span>
                                        <span className="font-medium">₹{taxAmount.toFixed(2)}</span>
                                    </div>

                                    <div className="border-t pt-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-gray-700">Discount (%)</span>
                                            <input
                                                type="number"
                                                value={discount}
                                                onChange={(e) => setDiscount(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                                                className="w-20 px-2 py-1 border rounded text-right"
                                                min="0"
                                                max="100"
                                            />
                                        </div>
                                        <div className="flex justify-between text-red-600">
                                            <span>Discount Amount</span>
                                            <span className="font-medium">-₹{discountAmount.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <div className="border-t pt-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Payment Method
                                        </label>
                                        <select
                                            value={paymentMethod}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option>Cash</option>
                                            <option>Card</option>
                                            <option>UPI</option>
                                            <option>Net Banking</option>
                                        </select>
                                    </div>

                                    <div className="border-t pt-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xl font-semibold">Total Amount</span>
                                            <span className="text-2xl font-bold text-green-600">
                        ₹{totalAmount.toFixed(2)}
                      </span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={generateBill}
                                    disabled={items.length === 0}
                                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold text-lg"
                                >
                                    Generate Bill
                                </button>

                                {items.length > 0 && (
                                    <div className="mt-4 flex items-start gap-2 text-xs text-gray-600 bg-yellow-50 p-3 rounded-lg">
                                        <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                                        <p>Stock will be automatically updated after bill generation</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Product Selection Modal */}
            {showProductModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                        <div className="p-6 border-b">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-semibold">Select Product</h2>
                                <button
                                    onClick={() => setShowProductModal(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        autoFocus
                                    />
                                </div>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    {categories.map(cat => (
                                        <option key={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredProducts.map(product => (
                                    <div
                                        key={product.id}
                                        onClick={() => addProductToBill(product)}
                                        className={`border rounded-lg p-4 cursor-pointer transition ${
                                            product.stock > 0
                                                ? "hover:border-blue-500 hover:shadow-md"
                                                : "opacity-50 cursor-not-allowed"
                                        }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-semibold text-lg">{product.name}</h3>
                                            <span className={`text-xs px-2 py-1 rounded ${
                                                product.stock > 20 ? "bg-green-100 text-green-800" :
                                                    product.stock > 0 ? "bg-yellow-100 text-yellow-800" :
                                                        "bg-red-100 text-red-800"
                                            }`}>
                        {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                      </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-3">{product.category}</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-2xl font-bold text-blue-600">₹{product.price}</span>
                                            <button
                                                disabled={product.stock === 0}
                                                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {filteredProducts.length === 0 && (
                                <div className="text-center py-12 text-gray-500">
                                    <p>No products found</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BillingPage;