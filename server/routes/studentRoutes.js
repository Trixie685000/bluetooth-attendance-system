const express = require("express");
const router = express.Router();
const prisma = require("../prismaClient");

// P2002 is the Prisma code for a unique field that already exists
function isDuplicate(error) {
    return error.code === "P2002";
}

// CREATE: Register a student
router.post("/", async (req, res) => {
    try {
        const { fullName, email, matricule } = req.body;

        if (!fullName || !email || !matricule) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const student = await prisma.student.create({
            data: { fullName, email, matricule }
        });

        res.status(201).json({
            message: "Student registered successfully",
            student
        });
    } catch (error) {
        if (isDuplicate(error)) {
            return res.status(400).json({
                message: "A student with this email or matricule already exists"
            });
        }

        res.status(500).json({
            message: "Error registering student",
            error: error.message
        });
    }
});

// READ: Get all students
router.get("/", async (req, res) => {
    try {
        const students = await prisma.student.findMany({
            include: { attendances: true }
        });

        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// READ: Get one student
router.get("/:id", async (req, res) => {
    try {
        const student = await prisma.student.findUnique({
            where: { id: Number(req.params.id) },
            include: { attendances: true }
        });

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// UPDATE: Edit student details
router.put("/:id", async (req, res) => {
    try {
        const { fullName, email, matricule } = req.body;

        const student = await prisma.student.update({
            where: { id: Number(req.params.id) },
            data: { fullName, email, matricule }
        });

        res.json({
            message: "Student updated successfully",
            student
        });
    } catch (error) {
        if (isDuplicate(error)) {
            return res.status(400).json({
                message: "A student with this email or matricule already exists"
            });
        }

        res.status(500).json({ message: error.message });
    }
});

// DELETE: Remove a student
router.delete("/:id", async (req, res) => {
    try {
        await prisma.student.delete({
            where: { id: Number(req.params.id) }
        });

        res.json({ message: "Student deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;