import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/auth.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService
    ) { }

    async register(dto: RegisterDto): Promise<string> {
        try {

            const existsUser = await this.prisma.auth.findUnique({
                where: {
                    username: dto.username
                }
            })
            const existsEmail = await this.prisma.auth.findUnique({
                where: {
                    email: dto.email,
                }
            })
            if (existsUser || existsEmail) {
                throw new HttpException('User already exists', HttpStatus.CONFLICT);
            }
            const hash = await bcrypt.hash(dto.password, 10);
            const user = await this.prisma.auth.create({
                data: {
                    username: dto.username,
                    password: hash,
                    email: dto.email
                }
            })
            return "OK"

        } catch (error) {
            throw error
        }
    }

    async login(dto: LoginDto): Promise<{ access_token: string }> {
        try {

            const user = await this.prisma.auth.findUnique({
                where: {
                    username: dto.username
                }
            })
            if (!user) {
                throw new HttpException('User already exists', HttpStatus.UNAUTHORIZED);
            }

            const isPassword = await bcrypt.compare(dto.password, user.password);
            if (!isPassword) {
                throw new HttpException('Invidlid password', HttpStatus.UNAUTHORIZED);
            }

            const payload = { sub: user.id, username: user.username };

            const token = {
                access_token: await this.jwtService.signAsync(payload),
            }
            return token

        } catch (error) {
            throw error
        }
    }

    async decode() {
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjgsInVzZXJuYW1lIjoiMTIzNDU2IiwiaWF0IjoxNzA5ODg5ODk5LCJleHAiOjE3MDk4OTM0OTl9.4eznz8q1v_r9h3U4E09hhqJlKzQo3twoUIakh2W97ko";
        const decodedToken = await this.jwtService.decode(token);
        console.log(decodedToken);

    }
}
