import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  Delete,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { BookingService } from './booking.service';
import { ConfirmBookingDto, CreateBookingDto } from '../dtos';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import type { JwtUser } from 'src/types';
import { JwtAuthGuard } from 'src/guards/jwt.guard';

@ApiTags('Bookings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova reserva' })
  @ApiBody({ type: CreateBookingDto })
  @ApiResponse({
    status: 201,
    description: 'Reserva criada com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  async create(@CurrentUser() user: JwtUser, @Body() dto: CreateBookingDto) {
    return this.bookingService.createBooking({
      accommodationId: dto.accommodationId,
      hostId: dto.hostId,
      checkInDate: dto.checkInDate,
      checkOutDate: dto.checkOutDate,
      guestId: user.userId,
    });
  }

  @Post('confirm')
  @ApiOperation({ summary: 'Confirmar uma reserva (ação do anfitrião)' })
  @ApiBody({ type: ConfirmBookingDto })
  @ApiResponse({
    status: 200,
    description: 'Reserva confirmada com sucesso',
  })
  @ApiResponse({
    status: 403,
    description: 'Usuário não autorizado a confirmar a reserva',
  })
  async confirmBooking(
    @Body() dto: ConfirmBookingDto,
    @CurrentUser() user: JwtUser,
  ) {
    return this.bookingService.confirmBooking({
      bookingId: dto.bookingId,
      hostId: user.userId,
    });
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancelar uma reserva' })
  @ApiParam({
    name: 'id',
    description: 'ID da reserva',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Reserva cancelada com sucesso',
  })
  @ApiResponse({
    status: 403,
    description: 'Usuário não autorizado a cancelar a reserva',
  })
  async cancel(@Param('id') bookingId: string, @CurrentUser() user: JwtUser) {
    return this.bookingService.cancelBooking(bookingId, user.userId);
  }

  @Get('accommodation/:accommodationId')
  @ApiOperation({
    summary: 'Listar reservas de uma acomodação',
  })
  @ApiParam({
    name: 'accommodationId',
    description: 'ID da acomodação',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de reservas da acomodação',
  })
  async findByAccommodation(@Param('accommodationId') accommodationId: string) {
    return this.bookingService.getBookingsByAccommodation(accommodationId);
  }

  @Get('user')
  @ApiOperation({
    summary: 'Listar reservas do usuário autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de reservas do usuário',
  })
  async findByUser(@CurrentUser() user: JwtUser) {
    return this.bookingService.getBookingsByUser(user.userId);
  }

  @Delete('dev/clear-all')
  @ApiOperation({
    summary: '[DEV] Remover todas as reservas',
    description: 'Endpoint exclusivo para ambiente de desenvolvimento',
  })
  @ApiResponse({
    status: 200,
    description: 'Todas as reservas foram removidas',
  })
  async clearAllBookings() {
    return this.bookingService.clearAllBookings();
  }
}
