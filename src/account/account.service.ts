import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
  ) {}

  async findByEmailOrPhone(
    email: string,
    phone?: string,
  ): Promise<Account | null> {
    return this.accountRepo.findOne({
      where: [{ email }, ...(phone ? [{ phoneNumber: phone }] : [])],
    });
  }

  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    const account = this.accountRepo.create(createAccountDto);
    return this.accountRepo.save(account);
  }
}
