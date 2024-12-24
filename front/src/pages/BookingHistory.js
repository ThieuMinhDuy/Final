import React, { useState, useEffect } from 'react';
import api from '../config/axiosConfig';
import {
  Box, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Collapse, IconButton
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openRows, setOpenRows] = useState({});

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings/history');
      if (response.data.success) {
        setBookings(response.data.bookings);
      }
    } catch (error) {
      setError('Không thể tải lịch sử đặt bàn');
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'confirmed': return 'success';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Chờ xác nhận';
      case 'confirmed': return 'Đã xác nhận';
      case 'rejected': return 'Đã từ chối';
      default: return status;
    }
  };

  if (loading) return <Typography>Đang tải...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Lịch sử đặt bàn
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Ngày</TableCell>
              <TableCell>Giờ</TableCell>
              <TableCell>Loại bàn</TableCell>
              <TableCell>Số khách</TableCell>
              <TableCell>Tổng tiền</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Phương thức thanh toán</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <React.Fragment key={booking.id}>
                <TableRow>
                  <TableCell>
                    <IconButton size="small" onClick={() => handleRowClick(booking.id)}>
                      {openRows[booking.id] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                  </TableCell>
                  <TableCell>{new Date(booking.date).toLocaleDateString('vi-VN')}</TableCell>
                  <TableCell>{booking.time}</TableCell>
                  <TableCell>{booking.tableType}</TableCell>
                  <TableCell>{booking.guests}</TableCell>
                  <TableCell>{booking.total?.toLocaleString()}đ</TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusText(booking.status)}
                      color={getStatusColor(booking.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{booking.paymentMethod === 'full' ? 'Thanh toán đầy đủ' : 'Đặt cọc 30%'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                    <Collapse in={openRows[booking.id]} timeout="auto" unmountOnExit>
                      <Box sx={{ margin: 1 }}>
                        <Typography variant="h6" gutterBottom component="div">
                          Chi tiết đặt món
                        </Typography>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Tên món</TableCell>
                              <TableCell>Số lượng</TableCell>
                              <TableCell>Đơn giá</TableCell>
                              <TableCell>Thành tiền</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {booking.bookingItems?.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell>{item.menuItem?.name}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>{item.price?.toLocaleString()}đ</TableCell>
                                <TableCell>{(item.quantity * item.price)?.toLocaleString()}đ</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle2">Ghi chú: {booking.note || 'Không có'}</Typography>
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
    </Box>
  );
};

export default BookingHistory; 