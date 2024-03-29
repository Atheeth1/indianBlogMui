"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const schema_1 = require("../schema/schema");
const Blog_1 = __importDefault(require("../models/Blog"));
const Comment_1 = __importDefault(require("../models/Comment"));
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = require("bcryptjs");
const RootQuery = new graphql_1.GraphQLObjectType({
    name: "RootQuery",
    fields: {
        //get all user from
        users: {
            type: new graphql_1.GraphQLList(schema_1.UserType),
            async resolve() {
                return await User_1.default.find();
            },
        },
        // get all blog
        blogs: {
            type: new graphql_1.GraphQLList(schema_1.BlogType),
            async resolve() {
                return await Blog_1.default.find();
            },
        },
        // get all comments
        comments: {
            type: new graphql_1.GraphQLList(schema_1.CommentType),
            async resolve() {
                return await Comment_1.default.find();
            },
        },
    },
});
const mutations = new graphql_1.GraphQLObjectType({
    name: "mutations",
    fields: {
        //user sign up
        signup: {
            type: schema_1.UserType,
            args: {
                name: {
                    type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString),
                },
                email: {
                    type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString),
                },
                password: {
                    type: graphql_1.GraphQLString,
                },
            },
            async resolve(parent, { name, email, password }) {
                let existingUser;
                try {
                    existingUser = await User_1.default.findOne({ email });
                    if (existingUser)
                        return new Error(`User ${email} already exists`);
                    const encryptedPassword = (0, bcryptjs_1.hashSync)(password);
                    const user = new User_1.default({
                        name,
                        email,
                        password: encryptedPassword,
                    });
                    return await user.save();
                }
                catch (e) {
                    return new Error(`User ${email} signup failed. Try Again`);
                }
            },
        },
        // user login
        login: {
            type: schema_1.UserType,
            args: {
                email: {
                    type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString),
                },
                password: {
                    type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString),
                },
            },
            async resolve(parent, { email, password }) {
                let existingUser;
                try {
                    existingUser = await User_1.default.findOne({ email });
                    if (!existingUser)
                        return new Error(`User ${email} does not exist`);
                    const decryptedPassword = (0, bcryptjs_1.compareSync)(password, 
                    //@ts-ignore
                    existingUser?.password);
                    if (!decryptedPassword)
                        return new Error(`Password does not match`);
                    return existingUser;
                }
                catch (e) {
                    return new Error(`User ${email} login failed. Try Again`);
                }
            },
        },
        //create Blog
        addBlog: {
            type: schema_1.BlogType,
            args: {
                title: {
                    type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString),
                },
                content: {
                    type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString),
                },
                date: {
                    type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString),
                },
            },
            async resolve(parent, { title, content, date }) {
                let blog;
                try {
                    blog = new Blog_1.default({
                        title, content, date
                    });
                    return await blog.save();
                }
                catch (error) {
                    return new Error(error.message);
                }
            },
        },
        //update Blog
        updateBlog: {
            type: schema_1.BlogType,
            args: {
                id: {
                    type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLID)
                },
                title: {
                    type: graphql_1.GraphQLString
                },
                content: {
                    type: graphql_1.GraphQLString
                },
            },
            async resolve(parent, { id, title, content }) {
                let existingBlog;
                try {
                    existingBlog = await Blog_1.default.findById(id);
                    if (!existingBlog)
                        return new Error("Blog does not exist");
                    return await Blog_1.default.findByIdAndUpdate(id, { title, content }, { new: true });
                }
                catch (error) {
                    return new Error('error in update');
                }
            },
        },
        // delete Blog
        deleteBlog: {
            type: schema_1.BlogType,
            args: {
                id: {
                    type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLID)
                },
            },
            async resolve(parent, { id }) {
                let existingBlog;
                try {
                    existingBlog = await Blog_1.default.findById(id);
                    if (!existingBlog)
                        return new Error("Blog does not exist");
                    return await Blog_1.default.findByIdAndDelete(id);
                }
                catch (error) {
                    return new Error('error in delete');
                }
            },
        },
    },
});
exports.default = new graphql_1.GraphQLSchema({ query: RootQuery, mutation: mutations });
//# sourceMappingURL=handlers.js.map