import { describe, it, expect, beforeAll, afterAll } from "vitest"
import request from 'supertest'
import { PrismaClient } from "@prisma/client"
import app from '../app.js'

const prisma = new PrismaClient()

describe('API Routes', () => {
    beforeAll(async () => {
        //setup test database
        await prisma.$connect()
    })

    afterAll(async () => {
        //cleanup
        await prisma.$disconnect()
    })

    it('should respond to health check', async () => {
        const response = await request(app)
        .get('/api/health')
        .expect(200)

        expect(response.body).toHaveProperty('message')
    })

    it('should get users list', async () => {
        const response = await request(app)
        .get('/api/users')
        .expect(200)

        expect(Array.isArray(response.body)).toBe(true)
    })
})