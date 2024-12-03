import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  QueryParams,
  Res,
} from "routing-controllers";
import {
  TopicService,
  topicService,
  TopicUtility,
  topicUtility,
} from "./index";
import { Page } from "global/types/page.type";
import { Response } from "express";
import { GetTopicsDTO, TopicResponseDTO, UpdateTopicDTO } from "./dtos";

@Controller("/topics")
export class TopicController {
  topicService: TopicService;
  topicUtility: TopicUtility;

  constructor() {
    this.topicService = topicService;
    this.topicUtility = topicUtility;
  }

  @Get("/:tid/quotes")
  async countTopicQuotes(@Param("tid") tid: string, @Res() response: Response) {
    try {
      const count = await this.topicService.countTopicQuotes(tid);
      return response.status(200).json({ count });
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }

  @Get()
  async getTopics(
    @QueryParams() getTopicsDTO: GetTopicsDTO,
    @Res() response: Response
  ) {
    try {
      const topicsPage: Page = await this.topicService.getTopics(getTopicsDTO);

      const topicsDTO: TopicResponseDTO[] = topicsPage.content.map((topic) =>
        this.topicUtility.convertTopicToTopicDTO(topic)
      );

      const topicsPageDTO: Page = {
        ...topicsPage,
        content: topicsDTO,
      };

      return response.status(200).json(topicsPageDTO);
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }

  @Get("/search/:search")
  async searchTopics(
    @QueryParams() { page }: GetTopicsDTO,
    @Param("search") search: string,
    @Res() response: Response
  ) {
    try {
      const topicsPage: Page = await this.topicService.searchTopics(
        page,
        search
      );

      const topicsDTO: TopicResponseDTO[] = topicsPage.content.map((topic) =>
        this.topicUtility.convertTopicToTopicDTO(topic)
      );

      const topicsPageDTO: Page = {
        ...topicsPage,
        content: topicsDTO,
      };

      return response.status(200).json(topicsPageDTO);
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }

  @Patch("/:tid")
  async updateTopicById(
    @Param("tid") tid: string,
    @Body() updateTopicDTO: UpdateTopicDTO,
    @Res() response: Response
  ) {
    try {
      await this.topicService.updateTopicById(tid, updateTopicDTO);
      return response.status(200).send({ message: "Topic updated." });
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }

  @Delete("/:tid")
  async deleteTopicById(@Param("tid") tid: string, @Res() response: Response) {
    try {
      await this.topicService.deleteTopicById(tid);
      return response.status(200).send({ message: "Topic deleted." });
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }
}
