import { Args, Query, Resolver } from '@nestjs/graphql'
import { CategoryService } from './category.service'
import { CategoryModel } from './models/category.model'

@Resolver('Category')
export class CategoryResolver {
  public constructor(private readonly categoryService: CategoryService) {}

  @Query(() => [CategoryModel], { name: 'findAllCategories' })
  public async findAll() {
    return this.categoryService.findAll()
  }

  @Query(() => [CategoryModel], { name: 'findRandomCategories' })
  public async findRandomCategories() {
    return this.categoryService.findRandomCategories()
  }

  @Query(() => CategoryModel, { name: 'findCategoriesBySlug' })
  public async findBySlug(@Args('slug') slug: string) {
    return this.categoryService.findBySlug(slug)
  }
}
