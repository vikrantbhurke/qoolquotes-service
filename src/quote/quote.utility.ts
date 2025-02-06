import { CreateQuoteDTO, QuoteResponseDTO } from "./dtos";
import { Quote } from "./quote.model";
import { stopWordsEnglish } from "./processing/stopWordsEnglish";
import { modifications } from "./processing/modifications";
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
    return quoteDTO;
  }

  public extractTopicsFromQuote(createQuoteDTO: CreateQuoteDTO) {
    const tokenizer = new WordTokenizer();

    const tokens = createQuoteDTO.content
      .toLowerCase()
      // Remove every character except alphabet and single quote and dash
      .replace(/[^\w\s'-]+/g, "")
      // Remove digits
      .replace(/\d/g, "")
      .split(" ");

    const tokensWithoutStopWords = tokens.filter(
      (token) => !stopWordsEnglish.includes(token)
    );

    const filteredTokens = tokenizer.tokenize(tokensWithoutStopWords.join(" "));

    const tokensWithoutStopWordsTwo = filteredTokens.filter(
      (token) => !stopWordsEnglish.includes(token)
    );

    const lemmatizedTokens = tokensWithoutStopWordsTwo.map((token) => {
      return lemmatizer(token);
    });

    const modifiedTokens = lemmatizedTokens.map((word: string) => {
      for (let i = 0; i < modifications.length; i++)
        if (word === modifications[i].old) word = modifications[i].new;
      return word;
    });

    const seen = new Set();

    const uniqueModifiedTokens = modifiedTokens.filter((token) => {
      if (seen.has(token)) return false;
      seen.add(token);
      return true;
    });

    const tokensWithoutStopWordsThree = uniqueModifiedTokens.filter(
      (token) => !stopWordsEnglish.includes(token)
    );

    const capitalizedLemmatizedTokens = tokensWithoutStopWordsThree.map(
      (token) => {
        return token.charAt(0).toUpperCase() + token.slice(1);
      }
    );

    const tokensWithoutStopWordsFour = capitalizedLemmatizedTokens.filter(
      (token) => !stopWordsEnglish.includes(token)
    );

    return {
      ...createQuoteDTO,
      topics: Array.from(new Set(tokensWithoutStopWordsFour)),
    };
  }
}

export const quoteUtility = new QuoteUtility();
