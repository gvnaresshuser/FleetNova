import bcrypt from 'bcryptjs';

import prisma from '../config/prisma.js';

import jwt from 'jsonwebtoken';


export const registerUser = async (req, res) => {

    try {

        const { name, email, password, role } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (existingUser) {

            return res.status(400).json({
                success: false,
                message: 'User already exists',
            });

        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
            },
        });

        /* res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user,
        }); */
        //--------------------------------
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
            },
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};
//------------------------------------------
export const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {

            return res.status(404).json({
                success: false,
                message: 'User not found',
            });

        }

        const isPasswordMatched = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordMatched) {

            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });

        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '7d',
            }
        );

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,

            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};