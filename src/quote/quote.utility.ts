import { CreateQuoteDTO, QuoteResponseDTO } from "./dtos";
import { Quote } from "./quote.model";
import { stopWordsEnglish } from "./processing/stopWordsEnglish";
import { WordTokenizer } from "natural";
import { lemmatizer } from "lemmatizer";
import { Schema } from "mongoose";

export class QuoteUtility {
  public convertQuoteToQuoteDTO(quote: Quote): QuoteResponseDTO {
    const quoteDTO = new QuoteResponseDTO();
    quoteDTO.id = quote._id as Schema.Types.ObjectId;
    quoteDTO.content = quote.content;
    quoteDTO.authorId = quote.authorId;
    quoteDTO.topicIds = quote.topicIds;
    quoteDTO.likes = quote.likes;
    return quoteDTO;
  }

  public extractTopicsFromQuote(createQuoteDTO: CreateQuoteDTO) {
    const tokenizer = new WordTokenizer();

    const tokens = createQuoteDTO.content
      .toLowerCase()
      // Remove every character except alphabet and single quote
      .replace(/[^\w\s']+/g, "")
      // Remove digits
      .replace(/\d/g, "")
      .split(" ");

    const tokensWithoutStopWords = tokens.filter(
      (token) => !stopWordsEnglish.includes(token)
    );

    const filteredTokens = tokenizer.tokenize(
      tokensWithoutStopWords
        .join(" ")
        // Remove dash and single quote
        .replace(/['-]/g, "")
    );

    const lemmatizedTokens = filteredTokens.map((token) => {
      return lemmatizer(token);
    });

    const capitalizedLemmatizedTokens = lemmatizedTokens.map((token) => {
      return token.charAt(0).toUpperCase() + token.slice(1);
    });

    return {
      ...createQuoteDTO,
      topics: Array.from(new Set(capitalizedLemmatizedTokens)),
    };
  }
}

export const quoteUtility = new QuoteUtility();
