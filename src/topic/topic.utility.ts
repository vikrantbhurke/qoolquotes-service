import { Topic } from "./topic.model";
import { TopicResponseDTO } from "./dtos";
import { Schema } from "mongoose";

export class TopicUtility {
  convertTopicToTopicDTO(topic: Topic): TopicResponseDTO {
    const topicDTO = new TopicResponseDTO();
    topicDTO.id = topic._id as Schema.Types.ObjectId;
    topicDTO.name = topic.name;
    return topicDTO;
  }
}

export const topicUtility = new TopicUtility();
