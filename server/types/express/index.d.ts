import { User } from '../../storage';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
