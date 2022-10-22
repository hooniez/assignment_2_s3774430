const { buildSchema } = require("graphql");
const db = require("../database");
const { PubSub } = require("graphql-subscriptions");

// Create and track a GraphQL PubSub.
const pubsub = new PubSub();

const THUMBDOWN_ADDED_TRIGGER = "THUMBDOWN_ADDED";

const graphql = {};

const { GraphQLScalarType } = require("graphql");
const { Kind } = require("graphql/language");

const moment = require("moment");
const { gql } = require("apollo-server-express");

const resolverMap = {
  Date: new GraphQLScalarType({
    name: "Date",
    description: "Date custom type",
    parseValue(value) {
      return new Date(value);
    },
    serialize(value) {
      return value.getItem();
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10);
      }
      return null;
    },
  }),
};

// GraphQL.
// Construct a schema, using GraphQL schema language
graphql.typeDefs = gql`
  scalar Date

  type User {
    id: Int
    email: String
    firstName: String
    lastName: String
    isBlocked: Boolean
    posts: [Post]
  }

  type Post {
    id: Int
    isDeletedByAdmin: Boolean
    text: String
  }

  type React {
    userId: Int
    postId: Int
    reaction: Int
    dateReacted: Date
  }

  type Login {
    userId: Int
    dateLoggedIn: Date
  }

  type Follow {
    userId: Int
    followedId: Int
  }

  type Visit {
    id: Int
    userId: Int
    visitedId: Int
    dateVisited: Date
  }

  # Queries (read-only operations).
  type Query {
    all_users: [User]
    all_posts: [Post]
    all_reactions(postId: Int): [React]
    all_recent_logins: [Login]
    all_follow_metrics(userId: Int): [Follow]
    all_profile_visits(userId: Int): [Visit]
    all_thumbdowns(postId: Int): [React]
  }

  # Mutations (modify data in the underlying data-source, i.e., the database).
  type Mutation {
    block_user(id: Int): Boolean
    delete_post(id: Int): Boolean
  }

  type Subscription {
    thumbdowns: [React]
  }
`;

// The root provides a resolver function for each API endpoint.
graphql.resolvers = {
  Query: {
    all_users: async () => {
      return await db.user.findAll({
        where: {
          isDeleted: false,
        },
        include: { model: db.post, as: "posts" },
      });
    },
    all_posts: async () => {
      return await db.post.findAll({
        where: {
          isDeleted: false,
        },
      });
    },
    all_reactions: async (_, { postId }) => {
      return await db.react.findAll({
        where: {
          postId: postId,
        },
      });
    },

    all_recent_logins: async () => {
      return await db.login.findAll({
        where: {
          dateLoggedIn: {
            [db.Op.gte]: moment().subtract(7, "days").toDate(),
          },
        },
      });
    },

    all_follow_metrics: async (_, { userId }) => {
      return await db.follow.findAll({
        where: {
          [db.Op.or]: [
            {
              userId: userId,
            },
            {
              followedId: userId,
            },
          ],
        },
      });
    },

    all_profile_visits: async (_, { userId }) => {
      return await db.visit.findAll({
        where: {
          visitedId: userId,
        },
      });
    },

    all_thumbdowns: async (_, { postId }) => {
      console.log(postId);
      const thumbdowns = await db.react.findAll({
        where: {
          postId: postId,
          reaction: -1,
        },
      });

      console.log(thumbdowns.length);

      // Publish event to all subscribers
      pubsub.publish(THUMBDOWN_ADDED_TRIGGER, { thumbdowns: thumbdowns });

      return thumbdowns;
    },
  },
  Mutation: {
    block_user: async (_, { id }) => {
      const user = await db.user.findByPk(id);

      if (user === null) return false;

      // If user is already blocked, unblock user
      user.isBlocked = !user.isBlocked;

      await user.save();

      return true;
    },

    delete_post: async (_, { id }) => {
      const post = await db.post.findByPk(id);

      if (post === null) return false;

      // If post is already deleted, unDelete post
      post.isDeletedByAdmin = !post.isDeletedByAdmin;

      await post.save();

      return true;
    },
  },
  Subscription: {
    thumbdowns: {
      subscribe: () => pubsub.asyncIterator(THUMBDOWN_ADDED_TRIGGER),
    },
  },
};

module.exports = graphql;
