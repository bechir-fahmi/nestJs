import { Controller, Post, Get, Body, Res, UseGuards, Req } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './strategies/jwt.strategy';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupDto: any) {
    return this.authService.signup(signupDto);
  }

  @Post('login')
  async login(
    @Body() loginDto: any,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { token, message } = await this.authService.login(loginDto);
    
    response.cookie('jwt-linkedin', token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    return { message };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt-linkedin');
    return { message: 'Logged out successfully' };
  }

  @Get('current-user')
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@Req() req) {
    return req.user;
  }
}
