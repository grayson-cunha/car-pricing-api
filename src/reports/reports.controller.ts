import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SerializeResponseTo } from '../interceptors/serialize.interceptor';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { CreateReportDto } from './dtos/create-report-dto';
import { ReportsService } from './reports.service';
import { ReportDto } from './dtos/report.dto';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @SerializeResponseTo(ReportDto)
  async createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    const test = await this.reportsService.create(body, user);

    console.log(test);

    return test;
  }
}
