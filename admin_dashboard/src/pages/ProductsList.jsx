import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Eye, X, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchProducts, deleteProduct } from '../api/products';

const ProductsList = ({ audience, title }) => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        loadProducts();
    }, [audience]);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const response = await fetchProducts(audience);
            if (response.success) {
                setProducts(response.data);
            } else {
                setError('Failed to load products');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const response = await deleteProduct(id);
                if (response.success) {
                    setProducts(products.filter(p => p.id !== id));
                } else {
                    alert('Failed to delete product');
                }
            } catch (err) {
                console.error(err);
                alert('Error deleting product: ' + err.message);
            }
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.brand && p.brand.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) return <div className="p-4 text-center">Loading products...</div>;
    if (error) return <div className="p-4 text-center text-red-600">Error: {error}</div>;

    return (
        <div className="space-y-6 overflow-x-hidden">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">{title}</h1>
                    <p className="text-sm md:text-base text-gray-600 mt-1 uppercase tracking-tight">Manage products for {audience} audience</p>
                </div>
                <button
                    onClick={() => navigate(`/${audience.toLowerCase()}/products/new`)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md font-medium whitespace-nowrap"
                >
                    <Plus size={20} />
                    Add Product
                </button>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search products by name, SKU, or brand..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {filteredProducts.map((product) => (
                    <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                        {/* Product Image */}
                        <div className="relative h-48 bg-gray-100">
                            {product.thumbnails && JSON.parse(product.thumbnails)[0] ? (
                                <img
                                    src={JSON.parse(product.thumbnails)[0]}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <span className="text-sm">No Image</span>
                                </div>
                            )}
                            <div className="absolute top-2 right-2 flex flex-col gap-1">
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${product.isActive
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                    }`}>
                                    {product.isActive ? 'Active' : 'Inactive'}
                                </span>
                                {product.isBestSeller && (
                                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                        ⭐ Best Seller
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="p-4">
                            <h3 className="font-semibold text-gray-900 mb-1 truncate">{product.name}</h3>
                            <p className="text-sm text-gray-500 mb-1">SKU: {product.sku}</p>
                            <p className="text-xs text-gray-500 mb-2">
                                Stock: <span className="font-semibold text-gray-800">{product.stock ?? 0}</span>
                            </p>
                            <p className="text-lg font-bold text-blue-600 mb-2">${parseFloat(product.price).toFixed(2)}</p>

                            {/* Likes Count */}
                            <div className="flex items-center gap-1 mb-3">
                                <Heart className="text-red-500 fill-red-500" size={18} />
                                <span className="text-sm font-semibold text-gray-700">
                                    {product._count?.favorites || 0} {product._count?.favorites === 1 ? 'Like' : 'Likes'}
                                </span>
                            </div>

                            {product.brand && (
                                <p className="text-xs text-gray-500 mb-3">Brand: {product.brand}</p>
                            )}

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setSelectedProduct(product)}
                                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                                >
                                    <Eye size={16} />
                                    View
                                </button>
                                <button
                                    onClick={() => navigate(`/${audience.toLowerCase()}/products/${product.id}/edit`)}
                                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                                >
                                    <Edit2 size={16} />
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(product.id)}
                                    className="px-3 py-2 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg">
                    <p className="text-gray-500">No products found</p>
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="text-sm text-gray-600">Total Products</div>
                    <div className="text-2xl font-bold text-gray-900 mt-1">{products.length}</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="text-sm text-gray-600">Active Products</div>
                    <div className="text-2xl font-bold text-green-600 mt-1">
                        {products.filter(p => p.isActive).length}
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="text-sm text-gray-600">Inactive Products</div>
                    <div className="text-2xl font-bold text-red-600 mt-1">
                        {products.filter(p => !p.isActive).length}
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="text-sm text-gray-600">Total Value</div>
                    <div className="text-2xl font-bold text-blue-600 mt-1">
                        ${products.reduce((sum, p) => sum + parseFloat(p.price), 0).toFixed(2)}
                    </div>
                </div>
            </div>

            {/* Product Detail Modal */}
            {selectedProduct && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[2000] p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-in-bottom">
                        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold">{selectedProduct.name}</h2>
                            <button
                                onClick={() => setSelectedProduct(null)}
                                className="p-2 hover:bg-gray-100 rounded-full"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            {/* Images */}
                            {selectedProduct.thumbnails && JSON.parse(selectedProduct.thumbnails).length > 0 && (
                                <div>
                                    <p className="text-sm text-gray-600 mb-2 font-semibold">Product Images ({JSON.parse(selectedProduct.thumbnails).length})</p>
                                    <div className="grid grid-cols-3 gap-2">
                                        {JSON.parse(selectedProduct.thumbnails).map((img, idx) => (
                                            <div key={idx} className="relative group">
                                                <img
                                                    src={img}
                                                    alt={`${selectedProduct.name} ${idx + 1}`}
                                                    className="w-full h-32 object-cover rounded border border-gray-200 hover:border-blue-500 transition-all cursor-pointer"
                                                />
                                                <div className="absolute top-1 right-1 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                                                    {idx + 1}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">SKU</p>
                                    <p className="font-semibold">{selectedProduct.sku}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Price</p>
                                    <p className="font-semibold text-blue-600">${parseFloat(selectedProduct.price).toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Likes</p>
                                    <div className="flex items-center gap-1">
                                        <Heart className="text-red-500 fill-red-500" size={16} />
                                        <p className="font-semibold text-gray-900">{selectedProduct._count?.favorites || 0}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Brand</p>
                                    <p className="font-semibold">{selectedProduct.brand || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Status</p>
                                    <p className={`font-semibold ${selectedProduct.isActive ? 'text-green-600' : 'text-red-600'}`}>
                                        {selectedProduct.isActive ? 'Active' : 'Inactive'}
                                    </p>
                                </div>
                            </div>

                            {selectedProduct.description && (
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Description</p>
                                    <p className="text-gray-800">{selectedProduct.description}</p>
                                </div>
                            )}

                            {selectedProduct.colors && JSON.parse(selectedProduct.colors).length > 0 && (
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Available Colors</p>
                                    <div className="flex gap-2 flex-wrap">
                                        {JSON.parse(selectedProduct.colors).map((color, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-gray-100 rounded-full text-sm">{color}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedProduct.sizes && JSON.parse(selectedProduct.sizes).length > 0 && (
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Available Sizes</p>
                                    <div className="flex gap-2 flex-wrap">
                                        {JSON.parse(selectedProduct.sizes).map((size, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-gray-100 rounded-full text-sm">{size}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedProduct.additionalInfo && (
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Additional Information</p>
                                    <p className="text-gray-800 text-sm">{selectedProduct.additionalInfo}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductsList;
