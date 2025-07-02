import { DataSource, Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export class AccountRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  /**
   * Finds an account by email or phone number.
   * @param email - Email address to search for.
   * @param phone - Optional phone number to search for.
   * @returns The matching user or null.
   */
  async findByEmailOrPhone(
    email: string,
    phone?: string,
  ): Promise<User | null> {
    return this.findOne({
      where: [{ email }, ...(phone ? [{ phoneNumber: phone }] : [])],
    });
  }

  /**
   * Finds a user by email.
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ where: { email } });
  }

  /**
   * Finds a user by ID.
   */
  async findById(id: string): Promise<User | null> {
    return this.findOne({ where: { id } });
  }
}
