import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { ApiCreatedResponse, ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor() {
  }

  @Get('/')
  @ApiCreatedResponse({
    status: 200,
    description: 'return index.html for test filter csv file., run from browser',
  })
  getHello(@Res() res): void {
    console.log(process.cwd() + '/download.html');
    res.sendFile(process.cwd() + '/test/download.html');
  }

  @Post('/')
  @ApiExcludeEndpoint()
  @ApiCreatedResponse({
    status: 200,
    description: 'filter and return result as file',
  })
  public download(@Req() req, @Res() res): void {
    let data = [];
    res.setHeader('Content-Disposition', 'attachment; filename="filtered.csv"');

    const checkResponse = (end = false) => {
      for (let i = 0; i < data.length - 5; i++) {
        const raw = data.shift();
        if (!end && !raw.endsWith('\r')) return;
        const fields = raw.split(',');
        if (fields[fields.length - 1].includes('yahoo.com')) {
          res.write(raw + '\n');
        }
      }
      if (end) {
        res.write('\ngoodbye :) be happy.');
        res.end();
      }
    };

    req.on('data', (chunk: Buffer) => {
      const arr = chunk.toString().split('\n');
      if (arr[0].includes('------WebKitFormBound')) {
        res.write(arr[4] + '\n');
        arr.splice(0, 5);
        data = data.concat(arr);
      } else {
        const last = data[data.length - 1];
        if (!last.endsWith('\r')) {
          data[data.length - 1] = last + arr.shift();
        }
        data = data.concat(arr);
      }
      checkResponse();
    });
    req.on('error', (er) => res.status(500).send(er));
    req.on('end', async () => {
      checkResponse(true);
    });
  }
}
