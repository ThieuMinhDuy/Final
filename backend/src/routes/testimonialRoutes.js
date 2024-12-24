const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const testimonialController = require('../controllers/testimonialController');

// Public routes
router.get('/', testimonialController.getTestimonials);

// User routes
router.post('/', auth, testimonialController.createTestimonial);
router.delete('/:id', auth, testimonialController.deleteTestimonial);

// Admin routes
router.get('/all', auth, admin, testimonialController.getAllTestimonials);
router.put('/:id/approve', auth, admin, testimonialController.approveTestimonial);

module.exports = router; 