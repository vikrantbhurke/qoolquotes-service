import { v2 as cloudinary } from "cloudinary";
import { PlaylistService } from "../playlist";
import { QuoteLikerService } from "../quote-liker";
import { PlaylistSaverService } from "../playlist-saver";
import { PlaylistLikerService } from "../playlist-liker";
import { UserRepository } from "./user.repository";
import { UserUtility } from "./user.utility";
import { DeletionTracker } from "../global/utilities";
import {
  SignInUserDTO,
  SignUpUserDTO,
  UpdateUserDTO,
  UsernameDTO,
} from "./dtos";

export class UserService {
  userRepository: UserRepository;
  userUtility: UserUtility;
  playlistService: PlaylistService;
  quoteLikerService: QuoteLikerService;
  playlistLikerService: PlaylistLikerService;
  playlistSaverService: PlaylistSaverService;
  deletionTracker: DeletionTracker;

  setUserRepository(userRepository: UserRepository): void {
    this.userRepository = userRepository;
  }

  setUserUtility(userUtility: UserUtility): void {
    this.userUtility = userUtility;
  }

  setPlaylistService(playlistService: PlaylistService): void {
    this.playlistService = playlistService;
  }

  setQuoteLikerService(quoteLikerService: QuoteLikerService): void {
    this.quoteLikerService = quoteLikerService;
  }

  setPlaylistLikerService(playlistLikerService: PlaylistLikerService): void {
    this.playlistLikerService = playlistLikerService;
  }

  setPlaylistSaverService(playlistSaverService: PlaylistSaverService): void {
    this.playlistSaverService = playlistSaverService;
  }

  setDeletionTracker(deletionTracker: DeletionTracker) {
    this.deletionTracker = deletionTracker;
  }

  async generateToken(jwtPayload: any) {
    return await this.userUtility.generateToken(jwtPayload);
  }

  async verifyToken(token: string) {
    return await this.userUtility.verifyToken(token);
  }

  async signUpUser(signUpUserDTO: SignUpUserDTO) {
    const { firstname, lastname, username, email, password, gender } =
      signUpUserDTO;

    const userWithEmailExists = await this.userRepository.checkUserByEmail({
      email,
    });

    const userWithUsername = await this.userRepository.getUserByUsername({
      username,
    });

    if (userWithEmailExists)
      throw new Error("User with given email already exists.");

    if (userWithUsername)
      throw new Error("User with given username already exists.");

    const newUser = {
      firstname,
      lastname,
      username,
      email,
      gender,
      hashedPassword: await this.userUtility.encryptPassword(password),
    };

    const user = await this.userRepository.signUpUser(newUser);
    const token = await this.generateToken({ username });

    await this.userUtility.sendEmail(
      email,
      `Verify Your Email For ${process.env.APP_NAME}`,
      "verify-account.email.html",
      {
        clientUrl: process.env.CLIENT_URL,
        name: firstname,
        token,
      }
    );

    return user;
  }

  async signInUser(signInUserDTO: SignInUserDTO) {
    const { username, password } = signInUserDTO;
    const user = await this.userRepository.getUserByUsername({ username });

    if (!user) throw new Error("User with given username not found.");

    const isPasswordValid = await this.userUtility.validateHashedPassword(
      password,
      user.hashedPassword
    );

    if (!isPasswordValid) throw new Error("Password is incorrect.");

    if (!user.isVerified)
      throw new Error("Please verify your email. Check your inbox.");
    return user;
  }

  async verifyAccount(token: string) {
    if (!token) throw new Error("Invalid or expired token.");
    const decoded = await this.verifyToken(token);

    // @ts-ignore
    const user = await this.getUserByUsername({ username: decoded.username });
    if (user.isVerified) throw new Error("Email already verified.");
    user.isVerified = true;

    await this.updateUserById(user._id, { isVerified: true }, null);

    await this.userUtility.sendEmail(
      user.email,
      `Welcome To ${process.env.APP_NAME}!`,
      "welcome.email.html",
      {
        clientUrl: process.env.CLIENT_URL,
        name: user.firstname,
      }
    );
  }

  async verifyEmail(token: string) {
    if (!token) throw new Error("Invalid or expired token.");
    const decoded = await this.verifyToken(token);
    // @ts-ignore
    const { uid, email } = decoded;
    const user = await this.updateUserEmailById(uid, email);
    if (!user) throw new Error("User not found.");
  }

  async getUserByUsername(usernameDTO: UsernameDTO) {
    const user = await this.userRepository.getUserByUsername(usernameDTO);
    if (!user) throw new Error("User not found.");
    return user;
  }

  async getUserById(uid: string) {
    const user = await this.userRepository.getUserById(uid);
    if (!user) throw new Error("User not found.");
    return user;
  }

  async updateUserById(
    uid: string,
    updateUserByIdDTO: UpdateUserDTO,
    file: any
  ) {
    const user = await this.userRepository.getUserById(uid);

    if (!user) throw new Error("User not found.");

    const { firstname, lastname, email, password, isVerified } =
      updateUserByIdDTO;

    if (email && email !== user.email) {
      const token = await this.generateToken({ uid, email });

      await this.userUtility.sendEmail(
        email,
        `Verify Your New Email For ${process.env.APP_NAME}`,
        "verify-email.email.html",
        {
          clientUrl: process.env.CLIENT_URL,
          name: firstname || user.firstname,
          token,
        }
      );
    }

    const updatedUser = {
      profilepic: user.profilepic,
      firstname: firstname ? firstname : user.firstname,
      lastname: lastname ? lastname : user.lastname,
      email: user.email,
      hashedPassword: password
        ? await this.userUtility.encryptPassword(password)
        : user.hashedPassword,
      isVerified: isVerified ? isVerified : user.isVerified,
    };

    if (file) {
      const result = await this.userUtility.uploadToCloudinary(
        file.buffer,
        user.username
      );

      updatedUser.profilepic = result.secure_url;
    }

    return await this.userRepository.updateUserById(uid, updatedUser);
  }

  async updateUserEmailById(uid: string, email: string) {
    const user = await this.userRepository.updateUserById(uid, { email });
    if (!user) throw new Error("User not found.");
    return user;
  }

  async deleteProfilePicById(uid: string) {
    const user = await this.userRepository.getUserById(uid);

    if (!user) throw new Error("User not found.");
    if (!user.profilepic) throw new Error("Profile picture not found.");

    await cloudinary.uploader.destroy(
      `${process.env.CLOUDINARY_PROFILE_PICS}/${user.username}`
    );

    return await this.userRepository.updateUserById(uid, { profilepic: "" });
  }

  async deleteUserById(uid: string) {
    if (this.deletionTracker.has(uid)) return;
    this.deletionTracker.add(uid);

    const user = await this.userRepository.getUserById(uid);
    if (!user) throw new Error("User not found.");

    await this.playlistLikerService.deletePlaylistsLikersByLikerId({
      likerId: uid,
    });

    await this.playlistSaverService.deletePlaylistsSaversBySaverId({
      saverId: uid,
    });

    await this.quoteLikerService.deleteQuotesLikersByLikerId({ likerId: uid });

    await this.playlistService.deletePlaylistsByCreatorId({ creatorId: uid });

    await this.userRepository.deleteUserById(uid);

    await cloudinary.uploader.destroy(
      `${process.env.CLOUDINARY_PROFILE_PICS}/${user.username}`
    );

    await this.userUtility.sendEmail(
      user.email,
      `Account Deleted From ${process.env.APP_NAME}!`,
      "delete.email.html",
      {
        name: user.firstname,
      }
    );

    this.deletionTracker.remove(uid);

    return user;
  }
}

export const userService = new UserService();
