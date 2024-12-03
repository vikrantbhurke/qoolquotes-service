import { Schema } from "mongoose";
import { Author } from "./author.model";
import { AuthorResponseDTO } from "./dtos";

export class AuthorUtility {
  convertAuthorToAuthorDTO(author: Author): AuthorResponseDTO {
    const authorDTO = new AuthorResponseDTO();
    authorDTO.id = author._id as Schema.Types.ObjectId;
    authorDTO.name = author.name;
    return authorDTO;
  }
}

export const authorUtility = new AuthorUtility();
