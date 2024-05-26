import { HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);

  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    try {
      const newPost = this.postRepository.create(createPostDto);
      return await this.postRepository.save(newPost);
    } catch (error) {
      this.logger.debug(error);
      if (error.code === 'ER_DUP_ENTRY') {
        // MySQL duplicate entry error, handle accordingly
        throw new HttpException(
          {
            success: false,
            code: error.code,
            message: 'Post with this title already exists.',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      // Rethrow the original error if it's not a duplicate entry error
      throw new HttpException(
        {
          success: false,
          message: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(): Promise<Post[]> {
    return this.postRepository.find();
  }


  async findOne(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({ where: { id: id } });
    if (!post) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return post;
  }

  async getPostBySlug(slug: string): Promise<Post | undefined> {
    return this.postRepository.findOne({ where: { slug } });
  }

  async updatePost(slug: string, updatePostDto: UpdatePostDto): Promise<Post | undefined> {
    const existingPost = await this.postRepository.findOne({ where: { slug } });
    if (!existingPost) {
      return undefined;
    }

    const updatedPost = { ...existingPost, ...updatePostDto };
    return this.postRepository.save(updatedPost);
  }

  async deletePost(slug: string): Promise<boolean> {
    const result = await this.postRepository.delete({ slug });
    return result.affected > 0;
  }
}
