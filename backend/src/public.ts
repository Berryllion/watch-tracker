import { SetMetadata } from "@nestjs/common";

export const JWT_PUBLIC = "JWT_PUBLIC";
export const Public = () => SetMetadata(JWT_PUBLIC, true);
