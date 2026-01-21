| Serviço        | Domínios               |
| -------------- | ---------------------- |
| Auth           | Autenticação           |
| Users          | Usuários + Favoritos   |
| Accommodations | Propriedades + Reviews |
| Bookings       | Reservas               |

o sistema de reservas funciona, mas tem um porem, no fluxo atual podemos criar a reserva, até ai ok mas o problema começa quando cancelamos as reservas e tentamos novamente faze-la pois isso cria uma nova reserva ativa, o problema é que a antiga reserva (fantasma) já cancelada não é removida e fica poluindo o banco de dados:

[
    {
        "id": "c6b28082-667f-4676-b5e4-b58d7a9aa757",
        "accommodationId": "47990a4e-be31-4386-94e8-f4d9ca94e4c8",
        "hostId": "f948a33d-66e9-413c-b12e-98bb9ba65c2d",
        "guestId": "f948a33d-66e9-413c-b12e-98bb9ba65c2d",
        "checkInDate": "2026-01-21",
        "checkOutDate": "2026-01-31",
        "totalDays": 10,
        "pricePerNight": "300.00",
        "cleaningFee": "90.00",
        "serviceFeeMultiplier": "1.15",
        "finalAmount": "3553.50",
        "status": "CANCELED",
        "createdAt": "2026-01-20T18:03:19.320Z",
        "updatedAt": "2026-01-21T07:45:36.295Z"
    },
    {
        "id": "f9341a7f-3416-40e5-bb42-27856495626a",
        "accommodationId": "47990a4e-be31-4386-94e8-f4d9ca94e4c8",
        "hostId": "f948a33d-66e9-413c-b12e-98bb9ba65c2d",
        "guestId": "738896df-bfc4-4307-bc80-45a3b0dbea82",
        "checkInDate": "2026-01-22",
        "checkOutDate": "2026-01-31",
        "totalDays": 9,
        "pricePerNight": "300.00",
        "cleaningFee": "90.00",
        "serviceFeeMultiplier": "1.15",
        "finalAmount": "3208.50",
        "status": "CANCELED",
        "createdAt": "2026-01-21T07:31:36.538Z",
        "updatedAt": "2026-01-21T07:45:39.559Z"
    },
    {
        "id": "1da56071-2421-493f-a31f-d5ec51260390",
        "accommodationId": "47990a4e-be31-4386-94e8-f4d9ca94e4c8",
        "hostId": "f948a33d-66e9-413c-b12e-98bb9ba65c2d",
        "guestId": "738896df-bfc4-4307-bc80-45a3b0dbea82",
        "checkInDate": "2026-01-22",
        "checkOutDate": "2026-01-31",
        "totalDays": 9,
        "pricePerNight": "300.00",
        "cleaningFee": "90.00",
        "serviceFeeMultiplier": "1.15",
        "finalAmount": "3208.50",
        "status": "CANCELED",
        "createdAt": "2026-01-21T07:32:12.925Z",
        "updatedAt": "2026-01-21T07:45:40.255Z"
    },
    {
        "id": "79694727-46cf-49a9-b6d5-4561ff459d29",
        "accommodationId": "47990a4e-be31-4386-94e8-f4d9ca94e4c8",
        "hostId": "f948a33d-66e9-413c-b12e-98bb9ba65c2d",
        "guestId": "f948a33d-66e9-413c-b12e-98bb9ba65c2d",
        "checkInDate": "2026-01-22",
        "checkOutDate": "2026-01-31",
        "totalDays": 9,
        "pricePerNight": "300.00",
        "cleaningFee": "90.00",
        "serviceFeeMultiplier": "1.15",
        "finalAmount": "3208.50",
        "status": "PENDING",
        "createdAt": "2026-01-21T07:46:29.418Z",
        "updatedAt": "2026-01-21T07:46:29.418Z"
    }
]

essas reservas poderiam ser usadas como historico mas o problema é que ainda não temos uma função no backend para remover essas reservas já feitas, poderia rodar automaticamente com o cron e uma manual onde podemos usar por exemplo um botão remover reserva deacordo com o status dela, já que no payload temos o status podemos ativar deacordo como este valor estiver:

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELED = 'CANCELED',
}

nele possuimos essas variações, apenas confirmed, que terei de tratar depois, como uma reserva depende de que duas partes entrem em acordo tenho que criar um editor de reservas, para o anfitrião e o hospede, temos o botão para cancelar a reserva e funciona perfeitamente, mas falta poder editar apenas alguns campos: 

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { BookingStatus } from '../enums/booking-status.enum';

@Entity('bookings')
@Index(['accommodationId', 'checkInDate', 'checkOutDate'])
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  accommodationId: string;

  @Column({ type: 'uuid' })
  hostId: string;

  @Column({ type: 'uuid' })
  guestId: string;

  @Column({ type: 'date' })
  checkInDate: string;

  @Column({ type: 'date' })
  checkOutDate: string;

  @Column({ type: 'int' })
  totalDays: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  pricePerNight: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cleaningFee: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  serviceFeeMultiplier: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  finalAmount: number;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { Comment } from './comment.entity';

import { Category, SpaceType } from '../enums';

@Entity('accommodations')
export class Accommodation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'uuid' })
  creator_id: string;

  @Column({ nullable: true })
  main_cover_image?: string;

  @Column({ type: 'jsonb', default: [] })
  internal_images?: string[];

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price_per_night: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  cleaning_fee: number;

  @Column({ default: false })
  discount: boolean;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  average_rating: number;

  @Column({ type: 'int', default: 1 })
  room_count: number;

  @Column({ type: 'int', default: 1 })
  bed_count: number;

  @Column({ type: 'int', default: 1 })
  bathroom_count: number;

  @Column({ type: 'int', default: 1 })
  guest_capacity: number;

  @Column({ type: 'enum', enum: Category, default: Category.INN })
  category: Category;

  @Column({ type: 'enum', enum: SpaceType, default: SpaceType.FULL_SPACE })
  space_type: SpaceType;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  neighborhood?: string;

  @Column({ nullable: true })
  postal_code?: string;

  @Column({ nullable: true })
  uf?: string;

  @Column({ default: false })
  wifi: boolean;

  @Column({ default: false })
  tv: boolean;

  @Column({ default: false })
  kitchen: boolean;

  @Column({ default: false })
  washing_machine: boolean;

  @Column({ default: false })
  parking_included: boolean;

  @Column({ default: false })
  air_conditioning: boolean;

  @Column({ default: false })
  pool: boolean;

  @Column({ default: false })
  jacuzzi: boolean;

  @Column({ default: false })
  grill: boolean;

  @Column({ default: false })
  private_gym: boolean;

  @Column({ default: false })
  beach_access: boolean;

  @Column({ default: false })
  smoke_detector: boolean;

  @Column({ default: false })
  fire_extinguisher: boolean;

  @Column({ default: false })
  first_aid_kit: boolean;

  @Column({ default: false })
  outdoor_camera: boolean;

  @OneToMany(() => Comment, (comment) => comment.accommodation)
  comments!: Comment[];

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'date', nullable: true })
  next_available_date: string | null;

  @UpdateDateColumn()
  updated_at: Date;
}

Campo - status: BookingStatus (PENDING, CANCELED, CONFIRMED)
Cancelar pode ser feito pelo anfitrião e hóspede. Enquanto o anfitrião não aprovar a reserva, ficará como PENDING. Para reservas não aprovadas no intervalo de 24 horas, o sistema deve remover automaticamente dos registros (cron). Caso o anfitrião altere a data de reserva, alguns critérios devem ser observados. Primeiro, a reserva não pode estar em CONFIRMED ou CANCELED e deve limitar-se no máximo a 3 dias após a data da reserva proposta pelo cliente, um erro do sistema atual permite que as datas das reservas pendentes determinem a proxima data de disponibilidade, deveria ser aplicado em reservas já confirmadas, para limitar a quantidade de reservas confirmadas as datas podem ser salvas (inicio, saida) com esses dados, podemos permitir com que as novas reservas sejam encaixadas dentro do cronograma da acomodação apos a data de termino, e com novas datas o preço deve ser recalculado. Como o hóspede e anfitrião possuem o poder de cancelar o serviço, a negociação pode ser feita via chat, apenas devemos notificar o hóspede.

Campo - checkInDate: string
Deve estar um dia antecipado da edição. Hoje não vale como escolha para check-in, apenas o dia seguinte ou até 3 dias após amanhã.

Campo - checkOutDate: string
Não pode estar antes do check-in nem no mesmo dia (mínimo de 1 e máximo de 30 dias após check-in). Caso haja mudanças nas datas, usar a quantidade de dias entre check-in/check-out, incrementar em cima da nova data de check-in para obter a nova data de check-out e atualizar a data de disponibilidade da acomodação quando confirmado.

Campo - totalDays: number
Sofre mudanças em qualquer alteração de check-in e check-out.

Campos - pricePerNight, cleaningFee, serviceFeeMultiplier e finalAmount (numbers)
Apenas se algum valor da acomodação for alterado.
Campo - updatedAt: Date 
Automático após qualquer modificação na reserva.

O sistema de disponibilidade deve permitir no máximo 3 reservas pré programadas, exemplo: inicio 12 e termino 14 já confirmada, temos uma data de disponibilidade, inicio 14 e termino 16 já confirmada, inicio em 16 e termino em 18, apartir deste ponto não permitir mais reservas, até que a fila seja liberada. 