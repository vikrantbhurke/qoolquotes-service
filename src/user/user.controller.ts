import {
  Get,
  Req,
  Res,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseBefore,
  Controller,
} from "routing-controllers";
import { Response } from "express";
import { upload } from "./user.utility";
import { SignInUserDTO, SignUpUserDTO, UpdateUserDTO } from "./dtos";
import { UserService, userService, UserUtility, userUtility } from "./index";

const validateOptions = {
  validate: { whitelist: true, forbidNonWhitelisted: true },
};

@Controller("/users")
export class UserController {
  userService: UserService;
  userUtility: UserUtility;

  constructor() {
    this.userService = userService;
    this.userUtility = userUtility;
  }

  @Post("/sign-up")
  async signUpUser(
    @Body(validateOptions)
    signUpUserDTO: SignUpUserDTO,
    @Res() response: Response
  ) {
    try {
      await this.userService.signUpUser(signUpUserDTO);
      return response.status(201).send({ message: "Welcome!" });
    } catch (error: any) {
      let message;
      if (error.code === 11000) message = "User already exists.";
      else message = error.message;
      return response.status(500).send({ message });
    }
  }

  @Post("/sign-in")
  async signInUser(
    @Body() signInUserDTO: SignInUserDTO,
    @Res() response: Response
  ) {
    try {
      await this.userService.signInUser(signInUserDTO);
      return response.status(201).send({ message: "Welcome Back!" });
    } catch (error: any) {
      return response.status(500).json({ message: error.message });
    }
  }

  @Get("/verify-account/:token")
  async verifyAccount(
    @Param("token") token: string,
    @Res() response: Response
  ) {
    try {
      await this.userService.verifyAccount(token);

      return response.status(200).send({
        message: "Account verified successfully.",
      });
    } catch (error: any) {
      return response.status(500).json({ message: error.message });
    }
  }

  @Get("/verify-email/:token")
  async verifyEmail(@Param("token") token: string, @Res() response: Response) {
    try {
      await this.userService.verifyEmail(token);

      return response.status(200).send({
        message: "Email verified successfully.",
      });
    } catch (error: any) {
      return response.status(500).json({ message: error.message });
    }
  }

  @Get("/username/:username")
  async getUserByUsername(
    @Param("username") username: string,
    @Res()
    response: Response
  ) {
    try {
      const user = await this.userService.getUserByUsername({
        username,
      });

      const token = await this.userService.generateToken({ uid: user._id });
      const authDTO = this.userUtility.convertUserToAuthDTO(user, token);
      return response.status(200).json(authDTO);
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }

  @Get("/:uid")
  async getUserById(@Param("uid") uid: string, @Res() response: Response) {
    try {
      const user = await this.userService.getUserById(uid);
      if (!user) return response.status(404).send("User not found.");
      const userDTO = this.userUtility.convertUserToUserDTO(user);
      return response.status(200).json(userDTO);
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }

  @UseBefore(upload.single("profilepic"))
  @Patch("/:uid")
  async updateUserById(
    @Param("uid") uid: string,
    @Body({ validate: { whitelist: true, forbidNonWhitelisted: true } })
    updateUserByIdDTO: UpdateUserDTO,
    @Req() request: any,
    @Res() response: Response
  ) {
    try {
      await this.userService.updateUserById(
        uid,
        updateUserByIdDTO,
        request.file
      );

      return response.status(201).send({ message: "Profile updated." });
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }

  @Delete("/:uid/profilepic")
  async deleteProfilePicById(
    @Param("uid") uid: string,
    @Res() response: Response
  ) {
    try {
      await this.userService.deleteProfilePicById(uid);
      return response.status(200).send({ message: "Profile picture deleted." });
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }

  @Delete("/:uid")
  async deleteUserById(@Param("uid") uid: string, @Res() response: Response) {
    try {
      await this.userService.deleteUserById(uid);
      return response.status(200).send({ message: "User deleted." });
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }
}
