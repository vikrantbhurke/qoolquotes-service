export enum UserError {
  Firstname = "Must be 2 - 20 characters. Must not have spaces, digits, and symbols.",
  Lastname = "Must be 2 - 20 characters. Must not have digits and symbols.",
  Username = "Must be 3 - 20 characters. Must not have spaces.",
  Email = "Must be in valid email format.",
  Password = "Must be 8 - 20 characters. Must have an uppercase & a lowercase letter, a number, and a symbol. Must not have spaces.",
  Gender = "Must be valid gender. It should be either Male, Female or Other.",
}
