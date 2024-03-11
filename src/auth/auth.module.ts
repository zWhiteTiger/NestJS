import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[JwtModule.register({
    global: true,
    secret: "123",
    signOptions: { expiresIn: '1h' },
  }),],
  providers: [AuthService, PrismaService],
  controllers: [AuthController]
})
export class AuthModule {}
