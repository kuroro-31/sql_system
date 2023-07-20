export enum UserRole {
  SYSTEM = "system",
  SCM = "scm",
  BUSINESS_SUCCESS = "business_success",
  PRODUCT_PROMOTION = "product_promotion",
  MANAGEMENT = "management",
}

export type User = {
  id: string;
  password: string;
  role: UserRole;
};

export const users: User[] = [
  { id: "test-system", password: "UCq5iZUnJmmB", role: UserRole.SYSTEM },
  { id: "test-scm", password: "s9ASsqqJXEkh", role: UserRole.SCM },
  {
    id: "test-success",
    password: "yENTSQEhtK4A",
    role: UserRole.BUSINESS_SUCCESS,
  },
  {
    id: "test-promotion",
    password: "tn3XrWWfXwqn",
    role: UserRole.PRODUCT_PROMOTION,
  },
  {
    id: "test-management",
    password: "2vY783aL5uVb",
    role: UserRole.MANAGEMENT,
  },
];
