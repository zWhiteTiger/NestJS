import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from 'src/common/public/public';

@Controller('auth')
export class AuthController {

    constructor(private authService:AuthService){ }

    @Public()
    @Post('register')
    register(@Body() dto:RegisterDto){
        return this.authService.register(dto)
    }

    @Public()
    @Post('login')
    login(@Body() dto:LoginDto){
        return this.authService.login(dto)
    }

    @Public()
    @Post('decode')
    decode(){
        return this.authService.decode()
    }

}
