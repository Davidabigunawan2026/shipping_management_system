
const express = require('express');
const router = express.Router();

const database = require('../config/database');
const db = database.db || database;

// GET: tampilkan semua routes
router.get('/', (req, res) => {
  try {
    const data = db.prepare(`
      SELECT
        r.*,
        o.operator_name
      FROM ferry_routes r
      LEFT JOIN ferry_operators o
        ON r.operator_id = o.operator_id
      ORDER BY r.route_id DESC
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

// POST: tambah route
router.post('/', (req, res) => {
  try {
    const {
      route_code,
      operator_id,
      origin_port,
      destination_port,
      origin_country,
      destination_country,
      duration_minutes,
      status
    } = req.body;

    if (
      !route_code ||
      !operator_id ||
      !origin_port ||
      !destination_port ||
      !origin_country ||
      !destination_country
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please complete all required fields'
      });
    }

    const result = db.prepare(`
      INSERT INTO ferry_routes (
        route_code,
        operator_id,
        origin_port,
        destination_port,
        origin_country,
        destination_country,
        duration_minutes,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      route_code.trim(),
      Number(operator_id),
      origin_port.trim(),
      destination_port.trim(),
      origin_country.trim(),
      destination_country.trim(),
      Number(duration_minutes) || 0,
      status || 'ACTIVE'
    );

    const newRoute = db.prepare(`
      SELECT
        r.*,
        o.operator_name
      FROM ferry_routes r
      LEFT JOIN ferry_operators o
        ON r.operator_id = o.operator_id
      WHERE r.route_id = ?
    `).get(result.lastInsertRowid);

    res.status(201).json({
      success: true,
      message: 'Route created successfully',
      data: newRoute
    });

  } catch (error) {
    const duplicate = error.message.includes('UNIQUE');

    res.status(duplicate ? 409 : 500).json({
      success: false,
      message: duplicate
        ? 'Route code already exists'
        : error.message
    });
  }
});

// PUT: edit route
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;

    const {
      route_code,
      operator_id,
      origin_port,
      destination_port,
      origin_country,
      destination_country,
      duration_minutes,
      status
    } = req.body;

    if (
      !route_code ||
      !operator_id ||
      !origin_port ||
      !destination_port ||
      !origin_country ||
      !destination_country
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please complete all required fields'
      });
    }

    const result = db.prepare(`
      UPDATE ferry_routes
      SET
        route_code = ?,
        operator_id = ?,
        origin_port = ?,
        destination_port = ?,
        origin_country = ?,
        destination_country = ?,
        duration_minutes = ?,
        status = ?
      WHERE route_id = ?
    `).run(
      route_code.trim(),
      Number(operator_id),
      origin_port.trim(),
      destination_port.trim(),
      origin_country.trim(),
      destination_country.trim(),
      Number(duration_minutes) || 0,
      status || 'ACTIVE',
      id
    );

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    const updatedRoute = db.prepare(`
      SELECT
        r.*,
        o.operator_name
      FROM ferry_routes r
      LEFT JOIN ferry_operators o
        ON r.operator_id = o.operator_id
      WHERE r.route_id = ?
    `).get(id);

    res.json({
      success: true,
      message: 'Route updated successfully',
      data: updatedRoute
    });

  } catch (error) {
    const duplicate = error.message.includes('UNIQUE');

    res.status(duplicate ? 409 : 500).json({
      success: false,
      message: duplicate
        ? 'Route code already exists'
        : error.message
    });
  }
});

// DELETE: hapus route
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;

    const result = db.prepare(`
      DELETE FROM ferry_routes
      WHERE route_id = ?
    `).run(id);

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    res.json({
      success: true,
      message: 'Route deleted successfully'
    });

  } catch (error) {
    res.status(409).json({
      success: false,
      message: 'Cannot delete this route. It may be referenced by ferry schedules.',
      detail: error.message
    });
  }
});

module.exports = router;
