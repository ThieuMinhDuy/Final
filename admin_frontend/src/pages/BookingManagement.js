import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Chip,
  Collapse,
  IconButton
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import api from '../utils/api';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openRows, setOpenRows] = useState({});

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings/admin');
      if (response.data.success) {
        setBookings(response.data.bookings);
      }
    } catch (error) {
      setError('Không thể tải danh sách đặt bàn');
      console.error('Lỗi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const response = await api.put(`/bookings/admin/${id}`, { status });
      if (response.data.success) {
        await fetchBookings();
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
    }
  };

  const toggleRow = (bookingId) => {
    setOpenRows(prev => ({
      ...prev,
      [bookingId]: !prev[bookingId]
    }));
  };

  if (loading) return <Typography>Đang tải...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Quản lý đặt bàn
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Mã đơn</TableCell>
              <TableCell>Khách hàng</TableCell>
              <TableCell>Liên hệ</TableCell>
              <TableCell>Ngày</TableCell>
              <TableCell>Giờ</TableCell>
              <TableCell>Số khách</TableCell>
              <TableCell>Loại bàn</TableCell>
              <TableCell>Tổng tiền</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <React.Fragment key={booking.id}>
                <TableRow>
                  <TableCell>
                    <IconButton size="small" onClick={() => toggleRow(booking.id)}>
                      {openRows[booking.id] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                  </TableCell>
                  <TableCell>{booking.id}</TableCell>
                  <TableCell>{booking.customerName}</TableCell>
                  <TableCell>
                    <div>{booking.customerEmail}</div>
                    <div>{booking.customerPhone}</div>
                  </TableCell>
                  <TableCell>{new Date(booking.date).toLocaleDateString('vi-VN')}</TableCell>
                  <TableCell>{booking.time}</TableCell>
                  <TableCell>{booking.guests}</TableCell>
                  <TableCell>{booking.tableType}</TableCell>
                  <TableCell>{booking.total.toLocaleString()}đ</TableCell>
                  <TableCell>
                    <Chip
                      label={
                        booking.status === 'pending' ? 'Chờ xác nhận' :
                        booking.status === 'confirmed' ? 'Đã xác nhận' : 'Đã hủy'
                      }
                      color={
                        booking.status === 'pending' ? 'warning' :
                        booking.status === 'confirmed' ? 'success' : 'error'
                      }
                    />
                  </TableCell>
                  <TableCell>
                    {booking.status === 'pending' && (
                      <>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                          sx={{ mr: 1 }}
                        >
                          Xác nhận
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                        >
                          Từ chối
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={11}>
                    <Collapse in={openRows[booking.id]} timeout="auto" unmountOnExit>
                      <Box sx={{ margin: 2 }}>
                        <Typography variant="h6" gutterBottom>Chi tiết món ăn</Typography>
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
                            {booking.items?.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell align="right">{item.quantity}</TableCell>
                                <TableCell align="right">{item.price.toLocaleString()}đ</TableCell>
                                <TableCell align="right">
                                  {(item.quantity * item.price).toLocaleString()}đ
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
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

export default BookingManagement; 