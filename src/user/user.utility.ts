import bcrypt from "bcrypt";
import { Schema } from "mongoose";
import { User } from "./user.model";
import { UserResponseDTO, AuthResponseDTO } from "./dtos";
import jsonwebtoken, { JwtPayload } from "jsonwebtoken";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { Readable } from "stream";
import multer from "multer";
import { transporter } from "../index";
import fs from "fs";
import path from "path";

export class UserUtility {
  convertUserToUserDTO(user: User): UserResponseDTO {
    const userDTO = new UserResponseDTO();
    userDTO.id = user._id as Schema.Types.ObjectId;
    userDTO.profilepic = user.profilepic;
    userDTO.firstname = user.firstname;
    userDTO.lastname = user.lastname;
    userDTO.username = user.username;
    userDTO.email = user.email;
    return userDTO;
  }

  convertUserToAuthDTO(user: any, token: string): AuthResponseDTO {
    const authDTO = new AuthResponseDTO();
    authDTO.id = user._id as Schema.Types.ObjectId;
    authDTO.profilepic = user.profilepic;
    authDTO.firstname = user.firstname;
    authDTO.lastname = user.lastname;
    authDTO.username = user.username;
    authDTO.email = user.email;
    authDTO.token = token;
    authDTO.role = user.role;
    return authDTO;
  }

  encryptPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    let hashedPassword = "";

    try {
      hashedPassword = bcrypt.hashSync(password, salt);
    } catch (error) {
      throw new Error("An error occurred encrypting password. Try again.");
    }

    return hashedPassword;
  };

  generateToken = async (jwtPayload: any) => {
    return jsonwebtoken.sign(jwtPayload, process.env.JWT_SECRET_KEY as string, {
      expiresIn: "1d",
    });
  };

  verifyToken = async (token: string) => {
    return jsonwebtoken.verify(token, process.env.JWT_SECRET_KEY as string);
  };

  validateHashedPassword = async (password: string, hashedPassword: string) => {
    return bcrypt.compareSync(password, hashedPassword);
  };

  authorizationChecker = async (action: any, roles: string[]) => {
    let token = action.request.headers["authorization"];

    if (token) {
      try {
        const decoded: string | JwtPayload = jsonwebtoken.verify(
          token,
          process.env.JWT_SECRET_KEY as string
        );

        // @ts-ignore
        const user = await userService.getUserById(decoded.username);

        if (user && !roles.length) return true;
        if (user && roles.find((role) => user.roles.indexOf(role) !== -1))
          return true;
        return false;
      } catch (error) {
        action.response
          .status(401)
          .json({ message: "Not authorized, token failed." });

        return false;
      }
    } else {
      action.response
        .status(401)
        .json({ message: "Not authorized, no token." });

      return false;
    }
  };

  uploadToCloudinary = (
    buffer: Buffer,
    filename: string
  ): Promise<UploadApiResponse> => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: process.env.CLOUDINARY_PROFILE_PICS, public_id: filename },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as UploadApiResponse);
        }
      );

      Readable.from(buffer).pipe(stream);
    });
  };

  sendEmail = async (
    to: string,
    subject: string,
    templateName: string,
    variables: any
  ) => {
    const html = this.loadTemplate(templateName, variables);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  loadTemplate = (templateName: string, variables: any) => {
    const templatePath = path.join(
      __dirname,
      "../global/templates",
      templateName
    );

    let template = fs.readFileSync(templatePath, "utf-8");

    Object.keys(variables).forEach((key) => {
      template = template.replace(`{{${key}}}`, variables[key]);
    });

    return template;
  };
}

const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const userUtility = new UserUtility();
