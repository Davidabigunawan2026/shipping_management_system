
const express = require('express');
const router = express.Router();

const database = require('../config/database');
const db = database.db || database;

// GET: tampilkan semua operator
router.get('/', (req, res) => {
  try {
    const data = db.prepare(`
      SELECT *
      FROM ferry_operators
      ORDER BY operator_id DESC
    `).all();

    res.json({
      success: true,
      total: data.length,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// POST: tambah operator
router.post('/', (req, res) => {
  try {
    const {
      operator_code,
      operator_name,
      country,
      contact_email,
      contact_phone,
      website,
      status
    } = req.body;

    if (!operator_code || !operator_name) {
      return res.status(400).json({
        success: false,
        message: 'Operator code and name are required'
      });
    }

    const result = db.prepare(`
      INSERT INTO ferry_operators (
        operator_code,
        operator_name,
        country,
        contact_email,
        contact_phone,
        website,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      operator_code.trim(),
      operator_name.trim(),
      country || '',
      contact_email || '',
      contact_phone || '',
      website || '',
      status || 'ACTIVE'
    );

    const newOperator = db.prepare(`
      SELECT * FROM ferry_operators
      WHERE operator_id = ?
    `).get(result.lastInsertRowid);

    res.status(201).json({
      success: true,
      message: 'Operator created successfully',
      data: newOperator
    });
  } catch (error) {
    const duplicate = error.message.includes('UNIQUE');

    res.status(duplicate ? 409 : 500).json({
      success: false,
      message: duplicate
        ? 'Operator code already exists'
        : error.message
    });
  }
});

// PUT: edit operator
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;

    const {
      operator_code,
      operator_name,
      country,
      contact_email,
      contact_phone,
      website,
      status
    } = req.body;

    if (!operator_code || !operator_name) {
      return res.status(400).json({
        success: false,
        message: 'Operator code and name are required'
      });
    }

    const result = db.prepare(`
      UPDATE ferry_operators
      SET
        operator_code = ?,
        operator_name = ?,
        country = ?,
        contact_email = ?,
        contact_phone = ?,
        website = ?,
        status = ?
      WHERE operator_id = ?
    `).run(
      operator_code.trim(),
      operator_name.trim(),
      country || '',
      contact_email || '',
      contact_phone || '',
      website || '',
      status || 'ACTIVE',
      id
    );

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'Operator not found'
      });
    }

    const updatedOperator = db.prepare(`
      SELECT * FROM ferry_operators
      WHERE operator_id = ?
    `).get(id);

    res.json({
      success: true,
      message: 'Operator updated successfully',
      data: updatedOperator
    });
  } catch (error) {
    const duplicate = error.message.includes('UNIQUE');

    res.status(duplicate ? 409 : 500).json({
      success: false,
      message: duplicate
        ? 'Operator code already exists'
        : error.message
    });
  }
});

// DELETE: hapus operator
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;

    const result = db.prepare(`
      DELETE FROM ferry_operators
      WHERE operator_id = ?
    `).run(id);

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'Operator not found'
      });
    }

    res.json({
      success: true,
      message: 'Operator deleted successfully'
    });
  } catch (error) {
    res.status(409).json({
      success: false,
      message: 'Cannot delete this operator. It may be referenced by other records.',
      detail: error.message
    });
  }
});

module.exports = router;
