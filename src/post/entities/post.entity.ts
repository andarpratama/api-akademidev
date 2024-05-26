// user.entity.ts
import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, BeforeInsert, BeforeUpdate } from 'typeorm';
import * as slugify from 'slugify';


@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  slug: string;

  @Column({ unique: true })
  title: string;

  @Column()
  content: string;

  @Column()
  image: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', precision: 6 })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)', precision: 6 })
  updatedAt: Date;

  @ManyToOne(() => User, user => user.posts)
  createdBy: User;

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    // Check if title is provided
    if (this.title) {
        // Generate slug from title
        this.slug = slugify.default(this.title, { lower: true });
      } else {
        // Handle case when title is not provided
        throw new Error('Title is required to generate slug');
      }
  }
}