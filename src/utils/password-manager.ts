import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

class PasswordManager {
  static saltRounds = Number(process.env.SALT_ROUNDS);

  hashPassword(password: string) {
    return bcrypt.hashSync(password, PasswordManager.saltRounds);
  }

  comparePassword(password: string, hash: string) {
    return bcrypt.compareSync(password, hash);
  }
}

export default new PasswordManager();
