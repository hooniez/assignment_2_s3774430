const { buildSchema } = require("graphql");
const db = require("../database");

const graphql = {};

// GraphQL.
// Construct a schema, using GraphQL schema language
graphql.schema = buildSchema(`
  # The GraphQL types are declared first.

  # NOTE: The owner and pet are pseudo-joined; whilst they are related, how they are related is an implementation detail
  # that is NOT exposed in the GraphQL schema. This can be seen with the Pet type which has no field linking it to
  # an owner. That said an owner has many pets and this is exposed within the GraphQL schema by association.
  # Behind the scenes the database pet table has an additional field called email which is a FK to owner.
  type User {
    id: Int,
    email: String,
    firstName: String,
    lastName: String,
    posts: [Post]
  }

  type Post {
    id: Int,
    text: String
  }

  # Queries (read-only operations).
  type Query {
    all_users: [User],
  }

`);

// The root provides a resolver function for each API endpoint.
graphql.root = {
  // Queries.
  all_users: async () => {
    return await db.user.findAll({ include: { model: db.post, as: "posts" } });
  },
  //   user: async (args) => {
  //     return await db.user.findByPk(args.id);
  //   },
  //   user_exists: async (args) => {
  //     const count = await db.user.count({ where: { email: args.email } });

  //     return count === 1;
  //   },

  //   // Mutations.
  //   create_user: async (args) => {
  //     const user = await db.user.create(args.input);

  //     return user;
  //   },
  //   update_user: async (args) => {
  //     const user = await db.user.findByPk(args.input.id);

  //     // Update owner fields.
  //     user.firstName = args.input.firstName;
  //     user.lastName = args.input.lastName;

  //     await user.save();

  //     return user;
  //   },
  //   delete_user: async (args) => {
  //     const user = await db.user.findByPk(args.id);

  //     if(user === null)
  //       return false;

  //     // First remove all pets owned by the owner.
  //     await db.pet.destroy({ where: { email: owner.email } });
  //     await owner.destroy();

  //     return true;
  //   }
};

module.exports = graphql;

// # The input type can be used for incoming data.
//   input UserInput {
//     id: Int,
//     email: String,
//     firstName: String,
//     lastName: String,
//   }

//   # Queries (read-only operations).
//   type Query {
//     all_users: [User],
//     user(email: String): User,
//     user_exists(email: String): Boolean
//   }

//   # Mutations (modify data in the underlying data-source, i.e., the database).
//   type Mutation {
//     create_user(input: UserInput): User,
//     update_user(input: UserInput): User,
//     delete_user(email: String): Boolean
//   }

// Below are some sample queries that can be used to test GraphQL in GraphiQL.
// Access the GraphiQL web-interface when the server is running here: http://localhost:4000/graphql
/*

{
  all_owners {
    email,
    first_name,
    last_name,
    pets {
      pet_id,
    	name
    }
  }
}

{
  owner(email: "matthew@rmit.edu.au") {
    email,
    first_name,
    last_name
  }
}

{
  owner_exists(email: "matthew@rmit.edu.au")
}

mutation {
  create_owner(input: {
    email: "newuser@rmit.edu.au",
    first_name: "New",
    last_name: "User"
  }) {
    email,
    first_name,
    last_name
  }
}

mutation {
  update_owner(input: {
    email: "matthew@rmit.edu.au",
    first_name: "Matthew",
    last_name: "Bolger"
  }) {
    email,
    first_name,
    last_name
  }
}

mutation {
  delete_owner(email: "newuser@rmit.edu.au")
}

*/
