import { useState } from 'react';
import api from '../utils/api';
import './styles.css';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    spec: '',
    image: null,
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.image && !['image/jpeg', 'image/png'].includes(formData.image.type)) {
      setError('Only JPEG or PNG images are allowed');
      return;
    }

    const data = new FormData();
    data.append('product', JSON.stringify({
      name: formData.name,
      model: formData.model,
      spec: formData.spec,
    }));
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      await api.post('/products', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFormData({ name: '', model: '', spec: '', image: null });
    } catch (err) {
      setError(err.message || 'Failed to add product');
    }
  };

  return (
    <form className="add-product-form" onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Product Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="model"
        placeholder="Model"
        value={formData.model}
        onChange={handleChange}
        required
      />
      <textarea
        name="spec"
        placeholder="Specifications"
        value={formData.spec}
        onChange={handleChange}
        required
      />
      <input
        type="file"
        name="image"
        accept="image/jpeg,image/png"
        onChange={handleChange}
        data-testid="image-upload"
      />
      <button type="submit">Add Product</button>
      {error && <p className="error">{error}</p>}
    </form>
  );
};

export default AddProduct;