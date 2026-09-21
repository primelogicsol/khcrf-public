export const typeDefs = `#graphql
  type CanonicalEntity {
    id: ID!
    slug: String!
    type: String!
    name: String!
    status: String!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    canonicalEntities(limit: Int, offset: Int): [CanonicalEntity!]!
    canonicalEntity(id: ID!): CanonicalEntity
    canonicalEntityBySlug(slug: String!): CanonicalEntity
  }
`;
