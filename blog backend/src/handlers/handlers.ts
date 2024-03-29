import {
    GraphQLID,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
} from "graphql";
import { BlogType, UserType, CommentType } from "../schema/schema";
import Blog from "../models/Blog";
import Comment from "../models/Comment";
import User from "../models/User";
import { Document } from "mongoose";
import { compareSync, hashSync } from "bcryptjs";

const RootQuery = new GraphQLObjectType({
    name: "RootQuery",
    fields: {
        //get all user from
        users: {
            type: new GraphQLList(UserType),
            async resolve() {
                return await User.find();
            },
        },
        // get all blog
        blogs: {
            type: new GraphQLList(BlogType),
            async resolve() {
                return await Blog.find();
            },
        },
        // get all comments
        comments: {
            type: new GraphQLList(CommentType),
            async resolve() {
                return await Comment.find();
            },
        },
    },
});

const mutations = new GraphQLObjectType({
    name: "mutations",
    fields: {
        //user sign up
        signup: {
            type: UserType,
            args: {
                name: {
                    type: GraphQLNonNull(GraphQLString),
                },
                email: {
                    type: GraphQLNonNull(GraphQLString),
                },
                password: {
                    type: GraphQLString,
                },
            },
            async resolve(parent, { name, email, password }) {
                let existingUser: Document<any, any, any>;
                try {
                    existingUser = await User.findOne({ email });
                    if (existingUser) return new Error(`User ${email} already exists`);
                    const encryptedPassword = hashSync(password);
                    const user = new User({
                        name,
                        email,
                        password: encryptedPassword,
                    });
                    return await user.save();
                } catch (e) {
                    return new Error(`User ${email} signup failed. Try Again`);
                }
            },
        },
        // user login
        login: {
            type: UserType,
            args: {
                email: {
                    type: GraphQLNonNull(GraphQLString),
                },
                password: {
                    type: GraphQLNonNull(GraphQLString),
                },
            },
            async resolve(parent, { email, password }) {
                let existingUser: Document<any, any, any>;
                try {
                    existingUser = await User.findOne({ email });
                    if (!existingUser) return new Error(`User ${email} does not exist`);
                    const decryptedPassword = compareSync(
                        password,
                        //@ts-ignore
                        existingUser?.password
                    );
                    if (!decryptedPassword) return new Error(`Password does not match`);
                    return existingUser;
                } catch (e) {
                    return new Error(`User ${email} login failed. Try Again`);
                }
            },
        },
        //create Blog
        addBlog: {
            type: BlogType,
            args: {
                title: {
                    type: GraphQLNonNull(GraphQLString),
                },
                content: {
                    type: GraphQLNonNull(GraphQLString),
                },
                date: {
                    type: GraphQLNonNull(GraphQLString),
                },
            },
            async resolve(parent,{title,content,date}){
                let blog: Document<any,any,any>
                try {
                    blog=new Blog({
                        title,content,date
                    });
                  return  await blog.save();

                } catch (error) {
                    return new Error(error.message)
                }
            },
        },
        //update Blog
        updateBlog:{
            type:BlogType,
            args:{
                id:{
                    type:GraphQLNonNull(GraphQLID)
                },
                title:{
                    type:GraphQLString
                },
                content:{
                    type:GraphQLString
                },
            },
                async resolve(parent,{id,title,content}){
                    let existingBlog:Document<any,any,any>
                    try {
                        existingBlog =await Blog.findById(id);
                        if(!existingBlog) return new Error("Blog does not exist");
                        return await Blog.findByIdAndUpdate(id,
                            {title,content},
                            {new:true});
                    } catch (error) {
                      return new Error('error in update');  
                    }
                },
            },
            // delete Blog
            deleteBlog:{
                type:BlogType,
                args:{
                    id:{
                        type:GraphQLNonNull(GraphQLID)
                    },
                },
                async resolve(parent,{id}){
                        let existingBlog:Document<any,any,any>
                        try {
                            existingBlog =await Blog.findById(id);
                            if(!existingBlog) return new Error("Blog does not exist");
                            return await Blog.findByIdAndDelete(id);
                        } catch (error) {
                          return new Error('error in delete');  
                        }
                    },
                },
            },
        },
  
);

export default new GraphQLSchema({ query: RootQuery, mutation: mutations });
