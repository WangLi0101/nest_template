import { Injectable } from '@nestjs/common';
import { AccessToken, VideoGrant } from 'livekit-server-sdk';
import { ConfigService } from '@nestjs/config';
import { LivekitEnum } from 'types/config.enum';
import { CreateSignDto } from './dto/create-livekit.dto';
@Injectable()
export class LivekitService {
  constructor(private readonly configService: ConfigService) {}
  createSign(createSignDto: CreateSignDto) {
    const { roomName, username } = createSignDto;
    const at = new AccessToken(
      this.configService.get(LivekitEnum.LIVEKIT_API_KEY),
      this.configService.get(LivekitEnum.LIVEKIT_SECRET_KEY),
      {
        identity: username,
      },
    );
    const videoGrant: VideoGrant = {
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
    };
    at.addGrant(videoGrant);
    return at.toJwt();
  }
}
