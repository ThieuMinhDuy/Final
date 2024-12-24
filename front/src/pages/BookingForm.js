import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BookingForm.css';

const BookingForm = () => {
  const [menu, setMenu] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    guests: 0,
    tableType: ''
  });

  // Fetch menu khi component mount
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/menu');
        console.log('Menu data:', response.data);
        if (Array.isArray(response.data)) {
          setMenu(response.data);
        } else {
          console.error('Dữ liệu menu không đúng định dạng:', response.data);
        }
      } catch (error) {
        console.error('Lỗi khi lấy menu:', error);
      }
    };
    fetchMenu();
  }, []);

  const handleSelectItem = (item) => {
    setSelectedItems(prevItems => {
      const isSelected = prevItems.find(selected => selected.id === item.id);
      if (isSelected) {
        return prevItems.filter(selected => selected.id !== item.id);
      } else {
        return [...prevItems, item];
      }
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Nhóm menu theo danh mục
  const menuByCategory = menu.reduce((acc, item) => {
    const category = item.category || 'Khác';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  return (
    <div className="booking-form">
      <h2>Đặt bàn</h2>
      
      {/* Form đặt bàn */}
      <div className="booking-section">
        <div className="form-group">
          <label>Ngày:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="form-group">
          <label>Giờ:</label>
          <select name="time" value={formData.time} onChange={handleInputChange}>
            <option value="">Chọn giờ</option>
            <option value="17:00">17:00</option>
            <option value="18:00">18:00</option>
            <option value="19:00">19:00</option>
            <option value="20:00">20:00</option>
            <option value="21:00">21:00</option>
          </select>
        </div>

        <div className="form-group">
          <label>Số khách:</label>
          <input
            type="number"
            name="guests"
            value={formData.guests}
            onChange={handleInputChange}
            min="1"
            max="20"
          />
        </div>
      </div>

      {/* Menu section */}
      <div className="menu-section">
        <h3>Thực đơn</h3>
        {Object.entries(menuByCategory).map(([category, items]) => (
          <div key={category} className="category-section">
            <h4>{category}</h4>
            <div className="menu-grid">
              {items.map(item => (
                <div key={item.id} className="menu-item">
                  <div className="menu-item-content">
                    <h5>{item.name}</h5>
                    <p>{item.description}</p>
                    <span className="price">{Number(item.price).toLocaleString()}đ</span>
                  </div>
                  <button 
                    onClick={() => handleSelectItem(item)}
                    className={`select-button ${selectedItems.find(selected => selected.id === item.id) ? 'selected' : ''}`}
                  >
                    {selectedItems.find(selected => selected.id === item.id) ? 'Bỏ chọn' : 'Chọn món'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Selected items section */}
      {selectedItems.length > 0 && (
        <div className="selected-items">
          <h3>Món đã chọn</h3>
          <ul>
            {selectedItems.map(item => (
              <li key={item.id}>
                <span>{item.name}</span>
                <span>{Number(item.price).toLocaleString()}đ</span>
                <button onClick={() => handleSelectItem(item)} className="remove-button">×</button>
              </li>
            ))}
          </ul>
          <div className="total">
            <strong>Tổng cộng:</strong> 
            <span>{selectedItems.reduce((sum, item) => sum + Number(item.price), 0).toLocaleString()}đ</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingForm; 