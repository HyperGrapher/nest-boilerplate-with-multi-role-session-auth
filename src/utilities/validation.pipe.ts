import { HttpException, HttpStatus } from '@nestjs/common';
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

/**
 * Validates argument types,
 * checks if body is submitted in the request
 *
 * Only use on controller methods that accepts @Body()
 * 
 * Usage:
 * 
    @Post()
	@UsePipes(new ValidationPipe())
	createPost(@Body() data: PostDTO): Promise<PostEntity> {
		return this.postService.create(data);
    }
    
    
 */
@Injectable()
export class ValidationPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async transform(value: any, { metatype }: ArgumentMetadata) {
    //* Checks if request body exist
    if (value instanceof Object && this.isEmpty(value)) {
      throw new HttpException(
        'Validation failed: Request body not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new HttpException(
        `Validation failed: ${this.formatErrors(errors)}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return value;
  }

  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private formatErrors(errors: any[]): any {
    return errors
      .map((err) => {
        for (const property in err.constraints) {
          return err.constraints[property];
        }
      })
      .join(', ');
  }

  private isEmpty(value: any): boolean {
    if (Object.keys(value).length > 0) {
      return false;
    }

    return true;
  }
}
