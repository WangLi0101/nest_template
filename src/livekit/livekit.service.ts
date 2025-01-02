import { BadRequestException, Injectable } from '@nestjs/common';
import { AccessToken, VideoGrant } from 'livekit-server-sdk';
import { RoomServiceClient } from 'livekit-server-sdk';
import { ConfigService } from '@nestjs/config';
import { LivekitEnum } from 'types/config.enum';
import { CreateSignDto } from './dto/create-livekit.dto';

@Injectable()
export class LivekitService {
  private roomService: RoomServiceClient;

  constructor(private readonly configService: ConfigService) {
    this.roomService = new RoomServiceClient(
      this.configService.get(LivekitEnum.LIVEKIT_HOST) as string,
      this.configService.get(LivekitEnum.LIVEKIT_API_KEY) as string,
      this.configService.get(LivekitEnum.LIVEKIT_SECRET_KEY) as string,
    );
  }

  async createSign(createSignDto: CreateSignDto) {
    const { roomName, username } = createSignDto;

    const participants = await this.roomService.listParticipants(roomName);
    const isUserExist = participants.some(
      (participant) => participant.identity === username,
    );

    if (isUserExist) {
      throw new BadRequestException('用户名已存在');
    }

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
