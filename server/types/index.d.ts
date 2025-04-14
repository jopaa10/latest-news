// types/express/index.d.ts or src/types.d.ts (just ensure it's included in the project)

import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: string | JwtPayload;
    }
  }
}
