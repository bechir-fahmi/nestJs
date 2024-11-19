import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  UseGuards,
  Req,
  Delete,
  NotFoundException 
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getFeedPosts(@Req() req) {
    return this.postsService.getFeedPosts(req.user);
  }

  @Post('create')
  createPost(@Body() createPostDto: any, @Req() req) {
    return this.postsService.createPost(createPostDto, req.user);
  }

  @Post(':id/comment')
  createComment(
    @Param('id') postId: string,
    @Body() commentDto: any,
    @Req() req,
  ) {
    return this.postsService.createComment(postId, commentDto, req.user);
  }

  @Post(':id/like')
  likePost(@Param('id') postId: string, @Req() req) {
    return this.postsService.likePost(postId, req.user);
  }
}
