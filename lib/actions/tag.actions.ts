/* eslint-disable no-unused-vars */
"use server"

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import { GetAllTagsParams, GetTopInteractedTagsParams, getQuestionByTagIdParams } from "./shared.types";
import Tag, { ITag } from "@/database/tags.model";
import { FilterQuery } from "mongoose";

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
    try {
        connectToDatabase();
        const { userId } = params;
        const user = await User.findById(userId);

        if(!user) throw new Error("User not found");

        // Find interaction for the user and group by tags
        // TODO: Create Interactions model 

        return [{ _id: "1", name: "tag1" }, { _id: "2", name: "tag2" }];

    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getAllTags(params: GetAllTagsParams){
  try {


    const { searchQuery, filter, page=1, pageSize=20 } = params;
    const skipCount = (page - 1) * pageSize;
    
  const query: FilterQuery<typeof Tag> = {};

  let sortOptions = {};
 
  switch (filter) {
    case 'popular':
      sortOptions = { questions: -1}
      break;
    case 'recent':
      sortOptions = { createdAt: -1}     
      break;
    case 'name':
      sortOptions = { name: 1}
      break;
    case 'old':
      sortOptions = { createdAt: 1}
      break;
  
    default:
      break;
  }

  if(searchQuery){
    query.$or = [
      {name: {$regex: new RegExp(searchQuery, 'i')}},
    ]
  }


    connectToDatabase();

    const tags = await Tag.find(query)
      .sort(sortOptions)
      .skip(skipCount)
      .limit(pageSize);

    const totalTags = await Tag.countDocuments(query);
    const isNext = totalTags > skipCount + tags.length;

    return { tags, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getQuestionByTagId(params: getQuestionByTagIdParams){
  try {
    connectToDatabase();
    const { tagId, page=1, pageSize=10, searchQuery } = params;
    
    const skipCount = (page - 1) * pageSize;

    const tagFilter: FilterQuery<ITag> = {_id: tagId};

    const tag = await Tag.findOne(tagFilter)
      .populate({
        path: 'questions',
        model: 'Question',
        match: searchQuery ? { title: {$regex: searchQuery, $options: 'i'}} : {}, 
        options: {
          sort: { createdAt: -1 },
          skip: skipCount,
          limit: pageSize + 1
        },
        populate: [
          {path: 'tags', model: 'Tag', select: "_id name"},
          {path: 'author', model: 'User', select: "_id name username picture clerkId"  }
        ]
      })


      if(!tag) throw new Error('Tag not found');



    const isNext = tag.questions.length > pageSize;
      const questions = tag.questions; 
      return { tagTitle: tag.name, questions, isNext}
    
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getPopularTags(){
  try {
    connectToDatabase();
    const popularTags = await Tag.aggregate([
      {$project: {name: 1, totalQuestions:{$size: "$questions"}}},
      {$sort: {totalQuestions: -1}},
      {$limit: 5}
    ])

    return popularTags;
    
  } catch (error) {
    console.log(error)
    throw error;
  }
}