import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { TokensGuard } from '../tokens/tokens.guard';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review-dto';
import { ReqWithTokensData } from '../tokens/types/reqWithTokensData.interface';
import { EditReviewDto } from './dto/edit-review-dto';

@Controller('review')
@UseGuards(TokensGuard)
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @Post('create')
  createReview(@Body() createReviewDto: CreateReviewDto, @Req() req: ReqWithTokensData) {
    return this.reviewService.createReview(createReviewDto, req.user.url);
  }

  @Post(':reviewId')
  editReview(@Param('reviewId') reviewId: string, @Body() editReviewDto: EditReviewDto, @Req() req: ReqWithTokensData) {
    return this.reviewService.editReview(editReviewDto, reviewId, req.user.url);
  }
}
