import { Controller, Get, Body, UseGuards, Post, UseInterceptors, UploadedFile,UploadedFiles } from '@nestjs/common';
import {  FileFieldsInterceptor,FileInterceptor } from '@nestjs/platform-express';
import { PhotoService } from "./photo.service";
import { ApiTags, ApiBearerAuth  } from '@nestjs/swagger';
import multer = require('multer');


@ApiTags('img 图片上传') 
@Controller('/img')
export class PhotoController {
  constructor(private readonly photoService: PhotoService ) {}
  /**
   * 上传图片到 本地 和 oss
   * @param body 
   */
 

  
  @Post('upload_image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.diskStorage({
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    })
  )
  async uploadImage(@UploadedFile() file: any): Promise<any> {
    console.log("photo controller",file)
    // return file
    const res = await this.photoService.uploadImage(file)
    return res 
  }

 
}