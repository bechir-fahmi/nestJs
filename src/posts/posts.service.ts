import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './schemas/post.schema';
import { CloudinaryService } from '../common/services/cloudinary.service';
import { NotificationsService } from '../notifications/notifications.service';
import { MailService } from '../common/services/mail.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    private cloudinaryService: CloudinaryService,
    private notificationsService: NotificationsService,
    private mailService: MailService,
    private configService: ConfigService,
  ) {}

  async getFeedPosts(user: any) {
    return this.postModel
      .find({ author: { $in: [...user.connections, user._id] } })
      .populate('author', 'name username profilePicture headline')
      .populate('comments.user', 'name profilePicture')
      .sort({ createdAt: -1 });
  }

  async createPost(createPostDto: any, user: any) {
    const { content, image } = createPostDto;
    let imageUrl;

    if (image) {
      const uploadResult = await this.cloudinaryService.uploadImage(image);
      imageUrl = uploadResult.secure_url;
    }

    const newPost = new this.postModel({
      author: user._id,
      content,
      image: imageUrl,
    });

    return newPost.save();
  }

  async createComment(postId: string, commentDto: any, user: any) {
    const post = await this.postModel.findByIdAndUpdate(
      postId,
      {
        $push: { comments: { user: user._id, content: commentDto.content } },
      },
      { new: true }
    ).populate('author', 'name email username headline profilePicture');

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Create notification if comment owner is not post owner
    if (post.author._id.toString() !== user._id.toString()) {
      await this.notificationsService.createNotification({
        recipient: post.author._id,
        type: 'comment',
        relatedUser: user._id,
        relatedPost: postId,
      });

      // Send email notification
      const postUrl = `${this.configService.get('client.url')}/post/${postId}`;
      await this.mailService.sendCommentNotificationEmail(
        post.author.email,
        post.author.name,
        user.name,
        postUrl,
        commentDto.content
      );
    }

    return post;
  }

  async likePost(postId: string, user: any) {
    const post = await this.postModel.findById(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const userId = user._id;
    
    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter(id => id.toString() !== userId.toString());
    } else {
      post.likes.push(userId);
      
      if (post.author.toString() !== userId.toString()) {
        await this.notificationsService.createNotification({
          recipient: post.author,
          type: 'like',
          relatedUser: userId,
          relatedPost: postId,
        });
      }
    }

    return post.save();
  }
}
