import React, { useState, useEffect } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Typography, Chip, Collapse, IconButton
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import api from '../../config/axiosConfig';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [openRows, setOpenRows] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      console.log('Fetching bookings...');
      
      const response = await api.get('/bookings/admin');
      console.log('Response:', response.data);
      
      if (response.data.success) {
        setBookings(response.data.bookings);
        console.log('Bookings set:', response.data.bookings);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Lỗi khi tải danh sách đặt bàn');
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (bookingId) => {
    setOpenRows(prev => ({
      ...prev,
      [bookingId]: !prev[bookingId]
    }));
  };

  const handleConfirm = async (id) => {
    try {
      await api.put(`/bookings/admin/${id}`, { status: 'confirmed' });
      fetchBookings();
      alert('Đã xác nhận đặt bàn');
    } catch (error) {
      alert('Lỗi khi xác nhận');
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/bookings/admin/${id}`, { status: 'rejected' });
      fetchBookings();
      alert('Đã từ chối đặt bàn');
    } catch (error) {
      alert('Lỗi khi từ chối');
    }
  };

  if (loading) return <Box sx={{ p: 3 }}>Đang tải...</Box>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Quản lý đặt bàn
      </Typography>
      
      {bookings.length === 0 ? (
        <Typography>Chưa có đơn đặt bàn nào</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mã đơn</TableCell>
                <TableCell>Khách hàng</TableCell>
                <TableCell>Liên hệ</TableCell>
                <TableCell>Ngày</TableCell>
                <TableCell>Giờ</TableCell>
                <TableCell>Số khách</TableCell>
                <TableCell>Loại bàn</TableCell>
                <TableCell>Tổng tiền</TableCell>
                <TableCell>Đã thanh toán</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking) => (
                <React.Fragment key={booking.id}>
                  <TableRow>
                    <TableCell>#{booking.id}</TableCell>
                    <TableCell>{booking.User?.fullName}</TableCell>
                    <TableCell>
                      <Typography variant="body2">Email: {booking.User?.email}</Typography>
                      <Typography variant="body2">SĐT: {booking.User?.phone}</Typography>
                    </TableCell>
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
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {booking.status === 'pending' && (
                          <>
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              onClick={() => handleConfirm(booking.id)}
                            >
                              Xác nhận
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              onClick={() => handleReject(booking.id)}
                            >
                              Từ chối
                            </Button>
                          </>
                        )}
                        <IconButton
                          size="small"
                          onClick={() => handleRowClick(booking.id)}
                        >
                          {openRows[booking.id] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={11}>
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

export default BookingManagement; 