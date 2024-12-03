import Topic from "./topic.model";
import {
  getModelByField,
  getModelsByFieldDynamic,
  searchModels,
} from "../global/decorators/read";
import { createModel } from "../global/decorators/create";
import { getTopicsConfig, searchTopicsConfig } from "./topic.config";
import { updateModelById } from "../global/decorators/update";
import { deleteModelById } from "../global/decorators/delete";
import {
  CreateTopicDTO,
  GetTopicsDTO,
  UpdateTopicDTO,
  GetTopicByNameDTO,
} from "./dtos";

export class TopicRepository {
  @createModel(Topic)
  async createTopic(createTopicDTO: CreateTopicDTO, topic?: any) {
    return topic;
  }

  @getModelsByFieldDynamic(Topic, getTopicsConfig)
  async getTopics(getTopicsDTO: any, topicsPage?: any) {
    return topicsPage;
  }

  @getModelByField(Topic, {})
  async getTopicByName(getTopicByNamDTO: GetTopicByNameDTO, topic?: any) {
    return topic;
  }

  @searchModels(Topic, searchTopicsConfig)
  async searchTopics(page: number, search: string, topicsPage?: any) {
    return topicsPage;
  }

  @updateModelById(Topic)
  async updateTopicById(
    tid: string,
    updateTopicDTO: UpdateTopicDTO,
    topic?: any
  ) {
    return topic;
  }

  @deleteModelById(Topic)
  async deleteTopicById(tid: string, topic?: any) {
    return topic;
  }
}

export const topicRepository = new TopicRepository();
