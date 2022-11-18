import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report-dto';
import { Report } from './reports.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private reportsRepository: Repository<Report>,
  ) {}

  create(reportDto: CreateReportDto, user: User): Promise<Report> {
    const report: Report = this.reportsRepository.create(reportDto);

    report.user = user;

    return this.reportsRepository.save(report);
  }

  async changeApproval(id: string, approved: boolean) {
    const report = await this.reportsRepository.findOne({
      where: { id: parseInt(id) },
    });

    if (!report) {
      throw new NotFoundException('report not found');
    }

    report.approved = approved;

    return this.reportsRepository.save(report);
  }
}
