import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleEntity } from './article.entity';
import { ContentEntity } from '../content/content.entity';
import { ArticleDTO } from './article.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(ContentEntity)
    private readonly contentRepository: Repository<ContentEntity>,
  ) {}

  toResponseObject(article: ArticleEntity) {
    const responseObject: any = { ...article };
    if (responseObject.content) {
      responseObject.content = responseObject.content.map(content => ({
        ...content,
      }));
    }
    return responseObject;
  }

  async create(articleDto: ArticleDTO) {
    let article = new ArticleEntity();
    Object.assign(article, articleDto); // or you can use some library like class-transformer to convert DTO to entity
    const savedArticle = await this.articleRepository.save(article);

    for (let contentData of articleDto.content) {
      let content = new ContentEntity();
      Object.assign(content, { ...contentData, article: savedArticle });
      await this.contentRepository.save(content);
    }

    const allContent = await this.contentRepository.find();
    return savedArticle;
  }

  async findAll(): Promise<ArticleEntity[]> {
    return await this.articleRepository.find({
      relations: ['content'],
    });
  }

  async findOne(id: string): Promise<ArticleEntity> {
    const article = await this.articleRepository.findOne({
      where: { id },
      relations: ['content'],
    });
    if (!article) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return article;
  }

  async update(id: string, newArticleData: Partial<ArticleDTO>): Promise<ArticleEntity> {
    const article = await this.articleRepository.findOne({
      where: { id },
      relations: ['content'],
    });
    if (!article) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    // Aktualizacja głównych danych artykułu
    Object.assign(article, newArticleData);
    await this.articleRepository.save(article);

    // Usunięcie istniejących zawartości artykułu
    if (newArticleData.content) {
      for (let content of article.content) {
        await this.contentRepository.remove(content);
      }

      // Dodawanie nowej zawartości do artykułu
      for (let contentData of newArticleData.content || []) {
        let content = new ContentEntity();
        Object.assign(content, { ...contentData, article });
        await this.contentRepository.save(content);
      }
    }

    return article;
  }

  async remove(id: string): Promise<ArticleEntity[]> {
    const article = await this.articleRepository.findOne({
      where: { id },
      relations: ['content'],
    });
    if (!article) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    console.log(article.content);

    while (article.content.length > 0) {
      console.log("tu sie wykonuję!")
      await this.contentRepository.remove(article.content.pop());
    }
    await this.articleRepository.delete({ id });
    
    const articles:ArticleEntity[] = await this.articleRepository.find({
      relations: ['content'],
    });

    return articles;
  }
}
