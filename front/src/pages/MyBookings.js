import React, { useState, useEffect } from 'react';
import api from '../config/axiosConfig';
import '../styles/MyBookings.css';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  TableContainer, 
  Table, 
  TableHead, 
  TableRow, 
  TableBody, 
  TableCell, 
  Chip, 
  IconButton, 
  Collapse,
  Paper
} from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const MyBookings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openRows, setOpenRows] = useState({});

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get('/bookings/history');
        if (response.data.success) {
          setBookings(response.data.bookings);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
        if (error.response?.status === 401) {
          navigate('/login');
        } else {
          setError('Không thể tải danh sách đặt bàn');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;
  if (!user) return null;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Lịch sử đặt bàn
      </Typography>
      
      {bookings.length === 0 ? (
        <Typography>Bạn chưa có đơn đặt bàn nào</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mã đơn</TableCell>
                <TableCell>Ngày</TableCell>
                <TableCell>Giờ</TableCell>
                <TableCell>Số khách</TableCell>
                <TableCell>Loại bàn</TableCell>
                <TableCell>Tổng tiền</TableCell>
                <TableCell>Đã thanh toán</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Chi tiết</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking) => (
                <React.Fragment key={booking.id}>
                  <TableRow>
                    <TableCell>#{booking.id}</TableCell>
                    <TableCell>{new Date(booking.date).toLocaleDateString('vi-VN')}</TableCell>
                    <TableCell>{booking.time}</TableCell>
                    <TableCell>{booking.guests}</TableCell>
                    <TableCell>{booking.tableType}</TableCell>
                    <TableCell>{booking.total?.toLocaleString()}đ</TableCell>
                    <TableCell>{booking.deposit?.toLocaleString()}đ</TableCell>
                    <TableCell>
                      <Chip
                        label={
                          booking.status === 'pending' ? 'Chờ xác nhận' :
                          booking.status === 'confirmed' ? 'Đã xác nhận' :
                          booking.status === 'rejected' ? 'Đã từ chối' :
                          booking.status === 'cancelled' ? 'Đã hủy' : booking.status
                        }
                        color={
                          booking.status === 'confirmed' ? 'success' :
                          booking.status === 'pending' ? 'warning' : 'error'
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => setOpenRows(prev => ({
                          ...prev,
                          [booking.id]: !prev[booking.id]
                        }))}
                      >
                        {openRows[booking.id] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
                      <Collapse in={openRows[booking.id]} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 2 }}>
                          <Typography variant="h6" gutterBottom component="div">
                            Chi tiết món ăn
                          </Typography>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Tên món</TableCell>
                                <TableCell align="right">Số lượng</TableCell>
                                <TableCell align="right">Đơn giá</TableCell>
                                <TableCell align="right">Thành tiền</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {booking.bookingItems?.map((item) => (
                                <TableRow key={item.id}>
                                  <TableCell>{item.name}</TableCell>
                                  <TableCell align="right">{item.quantity}</TableCell>
                                  <TableCell align="right">{item.price?.toLocaleString()}đ</TableCell>
                                  <TableCell align="right">
                                    {(item.quantity * item.price)?.toLocaleString()}đ
                                  </TableCell>
                                </TableRow>
                              ))}
                              <TableRow>
                                <TableCell colSpan={3}>Phụ thu bàn ({booking.tableType})</TableCell>
                                <TableCell align="right">
                                  {(booking.total - booking.bookingItems?.reduce((sum, item) => 
                                    sum + item.quantity * item.price, 0))?.toLocaleString()}đ
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                          
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2">
                              Phương thức thanh toán: {
                                booking.paymentMethod === 'full' ? 'Thanh toán đầy đủ' : 'Đặt cọc 30%'
                              }
                            </Typography>
                            <Typography variant="subtitle2">
                              Ghi chú: {booking.note || 'Không có'}
                            </Typography>
                          </Box>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default MyBookings; 