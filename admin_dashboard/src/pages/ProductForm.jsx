import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchProduct, createProduct, updateProduct } from '../api/products';
import { fetchCategories } from '../api/categories';
import brandsApi from '../api/brands';
import { uploadImage } from '../api/upload';
import { ArrowLeft, Save, Loader, Upload, X, Plus } from 'lucide-react';

const ProductForm = ({ audience }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        sku: '',
        brand: '',
        audience: audience,
        thumbnails: [],
        colors: [],
        sizes: [],
        additionalInfo: '',
        isActive: true,
        isBestSeller: false,
        categoryId: '',
        stock: ''
    });

    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(isEditMode);
    const [error, setError] = useState(null);
    const [colorInput, setColorInput] = useState('');
    const [sizeInput, setSizeInput] = useState('');

    useEffect(() => {
        const loadInitialData = async () => {
            await Promise.all([loadCategories(), loadBrands()]);
            if (isEditMode) {
                await loadProduct();
            } else {
                setInitialLoading(false); // Make sure to stop loading if not edit mode
            }
        };
        loadInitialData();
    }, [id]);

    const loadCategories = async () => {
        try {
            const response = await fetchCategories(audience);
            if (response.success) {
                setCategories(response.data);
            }
        } catch (err) {
            console.error('Failed to load categories:', err);
        }
    };

    const loadBrands = async () => {
        try {
            const response = await brandsApi.getAll();
            const brandsData = Array.isArray(response) ? response : (response.data || []);
            setBrands(brandsData);
        } catch (err) {
            console.error('Failed to load brands:', err);
        }
    };

    const loadProduct = async () => {
        try {
            setInitialLoading(true);
            const response = await fetchProduct(id);
            if (response.success) {
                const product = response.data;

                const parseJsonField = (field) => {
                    if (!field) return [];
                    if (Array.isArray(field)) return field;
                    if (typeof field === 'string') {
                        try {
                            return JSON.parse(field);
                        } catch (e) {
                            return [];
                        }
                    }
                    return [];
                };

                setFormData({
                    name: product.name,
                    description: product.description || '',
                    price: product.price,
                    sku: product.sku,
                    brand: product.brand || '',
                    audience: product.audience,
                    thumbnails: parseJsonField(product.thumbnails),
                    colors: parseJsonField(product.colors),
                    sizes: parseJsonField(product.sizes),
                    additionalInfo: product.additionalInfo || '',
                    isActive: product.isActive,
                    isBestSeller: product.isBestSeller ?? false,
                    categoryId: product.categoryId || '',
                    stock: product.stock ?? 0
                });
            } else {
                setError('Failed to load product details');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setInitialLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploading(true);
            setError(null);
            const result = await uploadImage(file);
            setFormData(prev => ({
                ...prev,
                thumbnails: [...prev.thumbnails, result.url]
            }));
        } catch (err) {
            setError('Failed to upload image: ' + err.message);
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            thumbnails: prev.thumbnails.filter((_, i) => i !== index)
        }));
    };

    const addColor = () => {
        if (colorInput.trim()) {
            setFormData(prev => ({
                ...prev,
                colors: [...prev.colors, colorInput.trim()]
            }));
            setColorInput('');
        }
    };

    const removeColor = (index) => {
        setFormData(prev => ({
            ...prev,
            colors: prev.colors.filter((_, i) => i !== index)
        }));
    };

    const addSize = () => {
        if (sizeInput.trim()) {
            setFormData(prev => ({
                ...prev,
                sizes: [...prev.sizes, sizeInput.trim()]
            }));
            setSizeInput('');
        }
    };

    const removeSize = (index) => {
        setFormData(prev => ({
            ...prev,
            sizes: prev.sizes.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const submitData = {
                ...formData,
                price: parseFloat(formData.price),
                stock: formData.stock === '' ? 0 : parseInt(formData.stock, 10),
                categoryId: parseInt(formData.categoryId),
                // Send arrays directly, let standard JSON body handle it
                thumbnails: formData.thumbnails,
                colors: formData.colors,
                sizes: formData.sizes
            };

            if (isEditMode) {
                await updateProduct(id, submitData);
            } else {
                await createProduct(submitData);
            }
            navigate(`/${audience.toLowerCase()}/products`);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader className="animate-spin text-blue-600" size={32} />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate(`/${audience.toLowerCase()}/products`)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">
                    {isEditMode ? 'Edit Product' : 'Add New Product'} - {audience}
                </h1>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                {/* Basic Information */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Product Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                placeholder="e.g. Kids T-Shirt"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                SKU *
                            </label>
                            <input
                                type="text"
                                name="sku"
                                value={formData.sku}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                placeholder="e.g. KID-TSH-001"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Price *
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                step="0.01"
                                min="0"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                placeholder="0.00"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Stock (Available Quantity)
                            </label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                min="0"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                placeholder="e.g. 50"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Brand
                            </label>
                            <select
                                name="brand"
                                value={formData.brand}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            >
                                <option value="">Select a brand</option>
                                {brands.map(brand => (
                                    <option key={brand.id} value={brand.name}>
                                        {brand.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category *
                            </label>
                            <select
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            >
                                <option value="">Select a category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                placeholder="Product description..."
                            />
                        </div>
                    </div>
                </div>

                {/* Product Images */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Product Images</h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        {formData.thumbnails.map((img, index) => (
                            <div key={index} className="relative group">
                                <img
                                    src={img}
                                    alt={`Product ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute -top-2 -right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                        {uploading ? (
                            <Loader className="mx-auto h-12 w-12 text-gray-400 animate-spin" />
                        ) : (
                            <>
                                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                                <label className="cursor-pointer">
                                    <span className="text-blue-600 hover:text-blue-500 font-medium">
                                        {uploading ? 'Uploading...' : 'Upload Image'}
                                    </span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={uploading}
                                    />
                                </label>
                                <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                            </>
                        )}
                    </div>
                </div>

                {/* Colors */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Available Colors</h3>
                    <div className="flex gap-2 flex-wrap mb-3">
                        {formData.colors.map((color, index) => (
                            <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                {color}
                                <button type="button" onClick={() => removeColor(index)} className="hover:text-blue-900">
                                    <X size={14} />
                                </button>
                            </span>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={colorInput}
                            onChange={(e) => setColorInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            placeholder="Enter color (e.g. Red, Blue)"
                        />
                        <button
                            type="button"
                            onClick={addColor}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus size={20} />
                        </button>
                    </div>
                </div>

                {/* Sizes */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Available Sizes</h3>
                    <div className="flex gap-2 flex-wrap mb-3">
                        {formData.sizes.map((size, index) => (
                            <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                {size}
                                <button type="button" onClick={() => removeSize(index)} className="hover:text-green-900">
                                    <X size={14} />
                                </button>
                            </span>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={sizeInput}
                            onChange={(e) => setSizeInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            placeholder="Enter size (e.g. S, M, L, XL)"
                        />
                        <button
                            type="button"
                            onClick={addSize}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus size={20} />
                        </button>
                    </div>
                </div>

                {/* Additional Info */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Additional Information
                    </label>
                    <textarea
                        name="additionalInfo"
                        value={formData.additionalInfo}
                        onChange={handleChange}
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="Any additional product information..."
                    />
                </div>

                {/* Product Status Checkboxes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="isActive"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleChange}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="isActive" className="text-sm font-medium text-gray-700 select-none">
                            Product is Active
                        </label>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="isBestSeller"
                            name="isBestSeller"
                            checked={formData.isBestSeller}
                            onChange={handleChange}
                            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <label htmlFor="isBestSeller" className="text-sm font-medium text-gray-700 select-none">
                            Mark as Best Seller ⭐
                        </label>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={() => navigate(`/${audience.toLowerCase()}/products`)}
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading || uploading}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader className="animate-spin" size={20} /> : <Save size={20} />}
                        {isEditMode ? 'Update' : 'Create'} Product
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;
