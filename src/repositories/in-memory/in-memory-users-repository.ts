import { Prisma, User } from "@prisma/client";
import { UsersRepository } from "../users-repository";

export class InMemoryRepositories implements UsersRepository {
  async findById(id: string) {
    const user = this.users.find(user => user.id === id);

    if (!user) {
      return null;
    }

    return user;
  }

  private users: User[] = [];

  async create(data: Prisma.UserCreateInput) {
    const user: User = {
      id: data.id || Math.random().toString(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date,
    }

    this.users.push(user);
    return user;
  }
  async findByEmail(email: string) {
    const user = this.users.find(user => user.email === email);

    if (!user) {
      return null;
    }

    return user;
  }


}