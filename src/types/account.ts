// Account/login + Account/register DTOs (from components.schemas in Swagger).
// login response `data` is the JWT token string; register response `data` is a
// human-readable message string.

export interface LoginDto {
  userName: string
  password: string
}

export interface RegisterDto {
  userName: string
  phoneNumber: string
  email: string
  password: string
  confirmPassword: string
}
