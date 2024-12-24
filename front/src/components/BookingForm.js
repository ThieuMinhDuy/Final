import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../config/axiosConfig';
import {
  Box, Paper, Grid, TextField, MenuItem, Button, Typography,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions,
  RadioGroup, FormControlLabel, Radio, IconButton
} from '@mui/material';
import { Remove as RemoveIcon, Add as AddIcon } from '@mui/icons-material';

const BookingForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    guests: '',
    tableType: '',
    note: ''
  });
  
  const [menu, setMenu] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [menuByCategory, setMenuByCategory] = useState({});
  const [selectedItems, setSelectedItems] = useState({});
  const [tablePrice, setTablePrice] = useState(0);
  const [availableTables, setAvailableTables] = useState([]);
  const [step, setStep] = useState(1); // Thêm state để theo dõi bước đặt bàn

  // Thêm danh sách giờ và loại bàn
  const timeSlots = [];
  for (let hour = 10; hour <= 22; hour++) {
    timeSlots.push(`${hour}:00`);
    timeSlots.push(`${hour}:30`);
  }

  const tableTypes = [
   
    { id: 1, type: 'Bàn VIP', capacity: 2, price: 200000 },
    { id: 2, type: 'Bàn VIP', capacity: 4, price: 300000 },
    { id: 3, type: 'Phòng riêng', capacity: 10, price: 500000 },
    { id: 4, type: 'Phòng riêng VIP', capacity: 20, price: 1000000 },
  ];

  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('full'); // 'full' hoặc 'deposit'
  const [bookingData, setBookingData] = useState(null);

  // Fetch menu và xử lý dữ liệu khi component mount
  useEffect(() => {
    fetchMenu();
  }, []);

  // Fetch available tables khi số khách thay đổi
  useEffect(() => {
    if (formData.guests) {
      fetchAvailableTables();
    }
  }, [formData.guests]);

  const fetchMenu = async () => {
    try {
      const response = await api.get('/menu');
      console.log('Menu data:', response.data);
      
      // Tạo danh sách categories từ dữ liệu menu
      const categoriesSet = new Set(response.data.map(item => item.category));
      const uniqueCategories = Array.from(categoriesSet);
      setCategories(uniqueCategories);
      
      // Set category đầu tiên là active
      if (uniqueCategories.length > 0) {
        setActiveCategory(uniqueCategories[0]);
      }

      // Nhóm menu theo category
      const menuGrouped = response.data.reduce((acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
      }, {});
      
      setMenuByCategory(menuGrouped);
      setMenu(response.data);
    } catch (error) {
      console.error('Error fetching menu:', error);
    }
  };

  const fetchAvailableTables = () => {
    try {
      const guestsCount = parseInt(formData.guests);
      // Lọc bàn phù hợp với số lượng khách
      const availableTablesList = tableTypes.filter(table => table.capacity >= guestsCount);
      setAvailableTables(availableTablesList);
    } catch (error) {
      console.error('Error filtering tables:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Cập nhật giá bàn khi chọn loại bàn
    if (name === 'tableType') {
      const selectedTable = tableTypes.find(table => table.type === value);
      if (selectedTable) {
        setTablePrice(selectedTable.price);
      }
    }
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.date || !formData.time || !formData.guests || !formData.tableType) {
        alert('Vui lòng điền đầy đủ thông tin đặt bàn');
        return;
      }
    }
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = () => {
    try {
      if (!user) {
        alert('Vui lòng đăng nhập để đặt bàn');
        navigate('/login');
        return;
      }

      const selectedItemsList = Object.values(selectedItems).filter(item => item.quantity > 0);
      if (selectedItemsList.length === 0) {
        alert('Vui lòng chọn ít nhất một món');
        return;
      }

      // Lưu booking data và mở dialog thanh toán
      const data = {
        date: formData.date,
        time: formData.time,
        guests: Number(formData.guests),
        tableType: formData.tableType,
        note: formData.note,
        items: selectedItemsList.map(item => ({
          menuItemId: item.id,
          quantity: item.quantity,
          price: item.price,
          name: item.name
        })),
        total: calculateTotal()
      };
      
      setBookingData(data);
      setOpenPaymentDialog(true);
    } catch (err) {
      console.error('Error preparing booking:', err);
      alert('Có lỗi xảy ra, vui lòng thử lại');
    }
  };

  const handlePayment = async () => {
    try {
      // Kiểm tra token trước khi gửi request
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Vui lòng đăng nhập để đặt bàn');
        navigate('/login');
        return;
      }

      const selectedTable = tableTypes.find(table => table.type === formData.tableType);
      const tablePrice = selectedTable ? selectedTable.price : 0;

      // Tính tổng tiền món
      const itemsTotal = Object.values(selectedItems)
        .filter(item => item.quantity > 0)
        .reduce((sum, item) => sum + (item.price * item.quantity), 0);

      // Tổng cộng
      const total = tablePrice + itemsTotal;
      
      // Tính tiền cọc (30% nếu chọn đặt cọc)
      const deposit = paymentMethod === 'deposit' ? Math.round(total * 0.3) : total;

      const bookingData = {
        date: formData.date,
        time: formData.time,
        guests: Number(formData.guests),
        tableType: formData.tableType,
        items: Object.values(selectedItems)
          .filter(item => item.quantity > 0)
          .map(item => ({
            menuItemId: item.id,
            quantity: item.quantity,
            price: item.price,
            name: item.name
          })),
        total: total,
        deposit: deposit,
        paymentMethod: paymentMethod,
        note: formData.note || ''
      };

      console.log('Sending booking data:', bookingData);

      const response = await api.post('/bookings/create', bookingData);

      if (response.data.success) {
        alert('Đặt bàn thành công! Vui lòng chờ admin xác nhận.');
        setOpenPaymentDialog(false);
        navigate('/my-bookings');
      }
    } catch (error) {
      console.error('Booking error:', error);
      if (error.response?.status === 401) {
        alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        navigate('/login');
      } else {
        alert(error.response?.data?.message || 'Có lỗi xảy ra khi đặt bàn');
      }
    }
  };

  const calculateTotal = () => {
    return Object.values(selectedItems).reduce((total, item) => {
      return total + (item.price * (item.quantity || 0));
    }, tablePrice);
  };

  // Render bước 1: Chọn thông tin bàn
  const renderStep1 = () => (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Thông tin đặt bàn
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="date"
            name="date"
            label="Ngày"
            value={formData.date}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            inputProps={{
              min: new Date().toISOString().split('T')[0] // Chỉ cho phép chọn từ ngày hiện tại
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            name="time"
            label="Giờ"
            value={formData.time}
            onChange={handleInputChange}
          >
            {timeSlots.map((time) => (
              <MenuItem key={time} value={time}>
                {time}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="number"
            name="guests"
            label="Số khách"
            value={formData.guests}
            onChange={handleInputChange}
            inputProps={{
              min: 1,
              max: 50
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            name="tableType"
            label="Loại bàn"
            value={formData.tableType}
            onChange={handleInputChange}
          >
            {tableTypes
              .filter(table => !formData.guests || table.capacity >= formData.guests)
              .map((table) => (
                <MenuItem key={table.id} value={table.type}>
                  {table.type} - Phù hợp {table.capacity} khách
                  {table.price > 0 && ` - Phụ thu ${table.price.toLocaleString()}đ`}
                </MenuItem>
              ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            name="note"
            label="Ghi chú"
            value={formData.note}
            onChange={handleInputChange}
          />
        </Grid>
      </Grid>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 3 }}
        onClick={handleNextStep}
        disabled={!formData.date || !formData.time || !formData.guests || !formData.tableType}
      >
        Tiếp tục chọn món
      </Button>
    </Paper>
  );

  // Render bước 2: Chọn món ăn
  const renderStep2 = () => (
    <>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Chọn món ăn
        </Typography>

        {/* Danh mục món ăn */}
        <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "contained" : "outlined"}
              onClick={() => setActiveCategory(category)}
              sx={{ mb: 1 }}
            >
              {category}
            </Button>
          ))}
        </Box>

        {/* Bảng menu */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tên món</TableCell>
                <TableCell>Mô tả</TableCell>
                <TableCell align="right">Giá</TableCell>
                <TableCell align="right">Số lượng</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {menuByCategory[activeCategory]?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell align="right">{item.price.toLocaleString()}đ</TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                      <IconButton
                        size="small"
                        onClick={() => {
                          const currentQuantity = selectedItems[item.id]?.quantity || 0;
                          if (currentQuantity > 0) {
                            setSelectedItems({
                              ...selectedItems,
                              [item.id]: {
                                ...item,
                                quantity: currentQuantity - 1
                              }
                            });
                          }
                        }}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <Typography sx={{ mx: 1 }}>
                        {selectedItems[item.id]?.quantity || 0}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => {
                          const currentQuantity = selectedItems[item.id]?.quantity || 0;
                          setSelectedItems({
                            ...selectedItems,
                            [item.id]: {
                              ...item,
                              quantity: currentQuantity + 1
                            }
                          });
                        }}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Hiển thị tổng tiền */}
        <Box sx={{ mt: 3, textAlign: 'right' }}>
          <Typography variant="subtitle1">
            Giá bàn: {tablePrice.toLocaleString()}đ
          </Typography>
          <Typography variant="subtitle1">
            Tổng tiền món: {Object.values(selectedItems)
              .reduce((sum, item) => sum + (item.price * item.quantity), 0)
              .toLocaleString()}đ
          </Typography>
          <Typography variant="h6">
            Tổng cộng: {calculateTotal().toLocaleString()}đ
          </Typography>
        </Box>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button variant="outlined" onClick={handlePrevStep}>
          Quay lại
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          Xác nhận đặt bàn
        </Button>
      </Box>
    </>
  );

  const PaymentDialog = () => (
    <Dialog open={openPaymentDialog} onClose={() => setOpenPaymentDialog(false)}>
      <DialogTitle>Xác nhận đặt bàn</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Thông tin đặt bàn:
          </Typography>
          <Typography>Ngày: {formData.date}</Typography>
          <Typography>Giờ: {formData.time}</Typography>
          <Typography>Số khách: {formData.guests}</Typography>
          <Typography>Loại bàn: {formData.tableType}</Typography>
        </Box>

        <Typography variant="subtitle1" gutterBottom>
          Chọn hình thức thanh toán:
        </Typography>
        <RadioGroup
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <FormControlLabel 
            value="full" 
            control={<Radio />} 
            label={`Thanh toán đầy đủ: ${bookingData?.total.toLocaleString()}đ`}
          />
          <FormControlLabel 
            value="deposit" 
            control={<Radio />} 
            label={`Đặt cọc 30%: ${bookingData ? Math.round(bookingData.total * 0.3).toLocaleString() : 0}đ`}
          />
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenPaymentDialog(false)}>
          Hủy
        </Button>
        <Button variant="contained" onClick={handlePayment}>
          Xác nhận đặt bàn
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box sx={{ p: 3 }}>
      {step === 1 ? renderStep1() : renderStep2()}
      <PaymentDialog />
    </Box>
  );
};

export default BookingForm; 