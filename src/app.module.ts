import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EventModule } from './events/event.module';
import { ParticipantsModule } from './Participant/participant.module';
// import { ParticipantModule } from './Participant/participant.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    UsersModule,
    AuthModule,
    EventModule,
    ParticipantsModule,
  ],
})
export class AppModule {}
