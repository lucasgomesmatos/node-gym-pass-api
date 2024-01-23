import { InMemoryRepositories } from '@/repositories/in-memory/in-memory-users-repository';
import { AuthenticateUseCase } from '@/use-cases/authenticate';
import { InvalidCredentialsError } from '@/use-cases/erros/invalid-credentials-error';
import { hash } from 'bcryptjs';

import { beforeEach, describe, expect, it } from "vitest";


let usersRepository: InMemoryRepositories;
let authenticateUseCase: AuthenticateUseCase;

describe("Authenticate Use Case", () => {

  beforeEach(() => {
    usersRepository = new InMemoryRepositories();
    authenticateUseCase = new AuthenticateUseCase(usersRepository);
  })

  it("should be able to authenticate", async () => {

    await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    })

    const { user } = await authenticateUseCase.execute({
      email: "johndoe@example.com",
      password: "123456",
    })

    expect(user.id).toEqual(expect.any(String));
  })

  it("should not be able to authenticate with wrong email", async () => {

    await expect(() => authenticateUseCase.execute({
      email: "johndoe@example.com",
      password: "123456",
    })).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it("should not be able to authenticate with wrong password", async () => {

    await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    })

    await expect(() => authenticateUseCase.execute({
      email: "johndoe@example.com",
      password: "123123",
    })).rejects.toBeInstanceOf(InvalidCredentialsError)
  })



})