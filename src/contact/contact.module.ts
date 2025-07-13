import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactService } from './contact.service';
import { Contact } from './entities/contact.entity';
import { ContactController } from './contact.controller';
import { ContactRepository } from './repositories/contact.repository';
import { EmailModule } from 'src/common/email/email.module';

@Module({
  imports: [TypeOrmModule.forFeature([Contact]), EmailModule],
  controllers: [ContactController],
  providers: [ContactService, ContactRepository],
})
export class ContactModule {}
