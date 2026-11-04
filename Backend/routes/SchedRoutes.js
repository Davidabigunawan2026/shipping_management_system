
const express = require('express');
const router = express.Router();

const database = require('../config/database');
const db = database.db || database;

// GET: tampilkan semua schedules
router.get('/', (req, res) => {
  try {
    const data = db.prepare(`
      SELECT
        s.*,
        r.route_code,
        r.origin_port,
        r.destination_port
      FROM ferry_schedules s
      LEFT JOIN ferry_routes r
        ON s.route_id = r.route_id
      ORDER BY s.schedule_id DESC
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

// POST: tambah schedule
router.post('/', (req, res) => {
  try {
    const {
      schedule_code,
      route_id,
      vessel_name,
      departure_datetime,
      arrival_datetime,
      total_seats,
      available_seats,
      ticket_price,
      status
    } = req.body;

    if (
      !schedule_code ||
      !route_id ||
      !vessel_name ||
      !departure_datetime ||
      !arrival_datetime ||
      total_seats == null ||
      ticket_price == null
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please complete all required fields'
      });
    }

    const total = Number(total_seats);
    const available = available_seats == null
      ? total
      : Number(available_seats);
    const price = Number(ticket_price);

    if (
      !Number.isInteger(total) ||
      total <= 0 ||
      !Number.isInteger(available) ||
      available < 0 ||
      available > total ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid seat quantity or ticket price'
      });
    }

    if (
      new Date(arrival_datetime) <=
      new Date(departure_datetime)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Arrival must be later than departure'
      });
    }

    const result = db.prepare(`
      INSERT INTO ferry_schedules (
        schedule_code,
        route_id,
        vessel_name,
        departure_datetime,
        arrival_datetime,
        total_seats,
        available_seats,
        ticket_price,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      schedule_code.trim(),
      Number(route_id),
      vessel_name.trim(),
      departure_datetime,
      arrival_datetime,
      total,
      available,
      price,
      status || 'SCHEDULED'
    );

    const newSchedule = db.prepare(`
      SELECT
        s.*,
        r.route_code,
        r.origin_port,
        r.destination_port
      FROM ferry_schedules s
      LEFT JOIN ferry_routes r
        ON s.route_id = r.route_id
      WHERE s.schedule_id = ?
    `).get(result.lastInsertRowid);

    res.status(201).json({
      success: true,
      message: 'Schedule created successfully',
      data: newSchedule
    });

  } catch (error) {
    const duplicate = error.message.includes('UNIQUE');

    res.status(duplicate ? 409 : 500).json({
      success: false,
      message: duplicate
        ? 'Schedule code already exists'
        : error.message
    });
  }
});

// PUT: edit schedule
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;

    const {
      schedule_code,
      route_id,
      vessel_name,
      departure_datetime,
      arrival_datetime,
      total_seats,
      available_seats,
      ticket_price,
      status
    } = req.body;

    if (
      !schedule_code ||
      !route_id ||
      !vessel_name ||
      !departure_datetime ||
      !arrival_datetime ||
      total_seats == null ||
      ticket_price == null
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please complete all required fields'
      });
    }

    const total = Number(total_seats);
    const available = available_seats == null
      ? total
      : Number(available_seats);
    const price = Number(ticket_price);

    if (
      !Number.isInteger(total) ||
      total <= 0 ||
      !Number.isInteger(available) ||
      available < 0 ||
      available > total ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid seat quantity or ticket price'
      });
    }

    if (
      new Date(arrival_datetime) <=
      new Date(departure_datetime)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Arrival must be later than departure'
      });
    }

    const result = db.prepare(`
      UPDATE ferry_schedules
      SET
        schedule_code = ?,
        route_id = ?,
        vessel_name = ?,
        departure_datetime = ?,
        arrival_datetime = ?,
        total_seats = ?,
        available_seats = ?,
        ticket_price = ?,
        status = ?
      WHERE schedule_id = ?
    `).run(
      schedule_code.trim(),
      Number(route_id),
      vessel_name.trim(),
      departure_datetime,
      arrival_datetime,
      total,
      available,
      price,
      status || 'SCHEDULED',
      id
    );

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }

    const updatedSchedule = db.prepare(`
      SELECT
        s.*,
        r.route_code,
        r.origin_port,
        r.destination_port
      FROM ferry_schedules s
      LEFT JOIN ferry_routes r
        ON s.route_id = r.route_id
      WHERE s.schedule_id = ?
    `).get(id);

    res.json({
      success: true,
      message: 'Schedule updated successfully',
      data: updatedSchedule
    });

  } catch (error) {
    const duplicate = error.message.includes('UNIQUE');

    res.status(duplicate ? 409 : 500).json({
      success: false,
      message: duplicate
        ? 'Schedule code already exists'
        : error.message
    });
  }
});

// DELETE: hapus schedule
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;

    const result = db.prepare(`
      DELETE FROM ferry_schedules
      WHERE schedule_id = ?
    `).run(id);

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }

    res.json({
      success: true,
      message: 'Schedule deleted successfully'
    });

  } catch (error) {
    res.status(409).json({
      success: false,
      message: 'Cannot delete this schedule. It may be referenced by bookings.',
      detail: error.message
    });
  }
});

module.exports = router;
