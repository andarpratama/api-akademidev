import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, Put } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post as PostEntity } from './entities/post.entity';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Get(':slug')
  async getPostBySlug(@Param('slug') slug: string): Promise<PostEntity> {
    const post = await this.postService.getPostBySlug(slug);
    if (!post) {
      throw new NotFoundException(`Post with slug '${slug}' not found`);
    }
    return post;
  }

  @Put(':slug')
  async updatePost(@Param('slug') slug: string, @Body() updatePostDto: UpdatePostDto): Promise<PostEntity> {
    const updatedPost = await this.postService.updatePost(slug, updatePostDto);
    if (!updatedPost) {
      throw new NotFoundException(`Post with slug '${slug}' not found`);
    }
    return updatedPost;
  }

  @Delete(':slug')
  async deletePost(@Param('slug') slug: string): Promise<void> {
    const deleted = await this.postService.deletePost(slug);
    if (!deleted) {
      throw new NotFoundException(`Post with slug '${slug}' not found`);
    }
  }

}
