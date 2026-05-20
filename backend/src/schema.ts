export const typeDefs = `#graphql
  type User {
    id: Int!
    email: String!
    role: String!
    createdAt: String!
    listings: [Listing!]!
    applications: [Application!]!
  }

  type Listing {
    id: Int!
    title: String!
    company: String!
    location: String!
    description: String!
    salary: Int
    createdAt: String!
    employer: User!
    applications: [Application!]!
  }

  type Application {
    id: Int!
    createdAt: String!
    applicant: User!
    listing: Listing!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    listings: [Listing!]!
    listing(id: Int!): Listing
    me: User
  }

  type Mutation {
    register(email: String!, password: String!, role: String): AuthPayload!
    login(email: String!, password: String!): AuthPayload!

    createListing(
      title: String!
      company: String!
      location: String!
      description: String!
      salary: Int
    ): Listing!

    applyToListing(listingId: Int!): Application!
  }
`;