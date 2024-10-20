import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

class AuthManager {
  private token_key = String(process.env.TOKEN_KEY);

  async generateToken(email: string, name: string) {
    const token = jwt.sign({ email, name }, this.token_key);
    return token;
  }

  async verifyToken(token: string) {
    try {
      const decoded = jwt.verify(token, this.token_key);
      return decoded;
    } catch (e) {
      throw new Error("Token is invalid or expired.");
    }
  }
}

export default new AuthManager();
