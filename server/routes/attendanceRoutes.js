const express = require("express");
const router = express.Router();
const prisma = require("../prismaClient");

// CREATE: Record attendance
router.post("/", async (req, res) => {
    try {
        const { studentId, course, status } = req.body;

        if (!studentId || !course) {
            return res.status(400).json({
                message: "Student ID and course are required"
            });
        }

        const attendance = await prisma.attendance.create({
            data: {
                studentId: Number(studentId),
                course,
                status: status || "Present"
            }
        });

        res.status(201).json({
            message: "Attendance recorded successfully",
            attendance
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// READ: Get all attendance records
router.get("/", async (req, res) => {
    try {
        const records = await prisma.attendance.findMany({
            include: { student: true },
            orderBy: { date: "desc" }
        });

        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// READ: Get one attendance record
router.get("/:id", async (req, res) => {
    try {
        const record = await prisma.attendance.findUnique({
            where: { id: Number(req.params.id) },
            include: { student: true }
        });

        if (!record) {
            return res.status(404).json({
                message: "Attendance record not found"
            });
        }

        res.json(record);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// UPDATE: Update attendance
router.put("/:id", async (req, res) => {
    try {
        const { course, status } = req.body;

        const record = await prisma.attendance.update({
            where: { id: Number(req.params.id) },
            data: { course, status }
        });

        res.json({
            message: "Attendance updated successfully",
            record
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE: Delete attendance
router.delete("/:id", async (req, res) => {
    try {
        await prisma.attendance.delete({
            where: { id: Number(req.params.id) }
        });

        res.json({
            message: "Attendance record deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;