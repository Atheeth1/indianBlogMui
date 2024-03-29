import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import Blog from "../models/Blog";
import User from "../models/User";
import Comment from "../models/Comment";

export const UserType = new GraphQLObjectType(
    {
        name: "UserType",
        fields: () => ({
            id: {
                type: GraphQLNonNull(GraphQLID)
            },
            name: {
                type: GraphQLNonNull(GraphQLString)
            },
            email: {
                type: GraphQLNonNull(GraphQLString)
            },
            password: {
                type: GraphQLNonNull(GraphQLString)
            },
            blogs: {
                type: new GraphQLList(BlogType),
                async resolve(parent) {
                    return await Blog.find({ user: parent.id });
                }
            },
            comments:{
                type: new GraphQLList(CommentType),
                async resolve(parent) {
                    return  Comment.find({ user: parent.id });
                }
               }
        }),
    }
);

export const BlogType = new GraphQLObjectType({
    name: "BlogType",
    fields: () => ({
        id: {
            type: GraphQLNonNull(GraphQLID)
        },
        title: {
            type: GraphQLNonNull(GraphQLString)
        },
        content: {
            type: GraphQLNonNull(GraphQLString)
        },
        author: {
            type: GraphQLNonNull(UserType)
        },
        date: {
            type: GraphQLNonNull(GraphQLString)
        },
        user: {
            type: UserType,
            async resolve(parent, args) {
                return await User.findById(parent.user);
            }
        },
        comments:{
            type: new GraphQLList(CommentType),
            async resolve(parent) {
                return  Comment.find({user:parent.id });
            }
           },

    }),
});
export const CommentType = new GraphQLObjectType({
    name: "CommentType",
    fields: () => ({
        id: {
            type: GraphQLNonNull(GraphQLID)
        },
        content: {
            type: GraphQLNonNull(GraphQLString)
        },
        author: {
            type: GraphQLNonNull(UserType)
        },
        date: {
            type: GraphQLNonNull(GraphQLString)
        },
        user: {
            type: UserType,
            async resolve(parent, args) {
                return await User.findById(parent.user);
            }
        },
        blogs: {
            type: new GraphQLList(BlogType),
            async resolve(parent, args) {
                return await Blog.find({ user: parent.id });
            }
        },

    }),
});