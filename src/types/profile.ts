// UserProfile/get-user-profile-by-id payload.
export interface UserRole {
  id: string
  name: string
}

export interface UserProfile {
  userName: string
  userId: string
  image: string
  userRoles: UserRole[]
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  dob: string
}

// UserProfile/update-user-profile is multipart/form-data. Field names are
// PascalCase to match the API's form fields; `Image` is an optional file.
export interface UpdateProfilePayload {
  FirstName: string
  LastName: string
  Email: string
  PhoneNumber: string
  Dob: string
  Image: File | null
}
